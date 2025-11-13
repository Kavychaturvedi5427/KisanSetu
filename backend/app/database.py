from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "krishi")

client: AsyncIOMotorClient = None
database = None

async def connect_to_mongo():
    global client, database
    try:
        client = AsyncIOMotorClient(MONGODB_URL)
        database = client[DATABASE_NAME]
        # Test connection
        await client.admin.command('ping')
        print(f"✅ Connected to MongoDB at {MONGODB_URL}")
        print(f"📊 Using database: {DATABASE_NAME}")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        print("🔧 Starting without database - some features may not work")
        # Continue without database for basic functionality
        database = None

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("Disconnected from MongoDB")

def get_database():
    if database is None:
        # Return a mock database for basic functionality
        print("⚠️ Database not available, using persistent mock data")
        return MockDatabase()
    return database

class MockDatabase:
    """Mock database for when MongoDB is not available"""
    def __init__(self):
        self.users = MockCollection()
        
class MockCollection:
    """Mock collection that simulates database operations with persistent storage"""
    def __init__(self):
        self._data = {}
        self._load_data()
        
    def _load_data(self):
        """Load data from file if exists"""
        try:
            import json
            with open('mock_users.json', 'r') as f:
                self._data = json.load(f)
        except:
            self._data = {}
            
    def _save_data(self):
        """Save data to file"""
        try:
            import json
            with open('mock_users.json', 'w') as f:
                json.dump(self._data, f, default=str)
        except:
            pass
        
    async def find_one(self, query):
        """Find one document matching query"""
        for doc in self._data.values():
            if isinstance(doc, dict):
                if 'username' in query and doc.get('username') == query['username']:
                    return doc
                if 'email' in query and doc.get('email') == query['email']:
                    return doc
        return None
        
    async def find(self, query=None):
        """Find all documents matching query"""
        if query is None:
            return list(self._data.values())
        results = []
        for doc in self._data.values():
            if isinstance(doc, dict):
                match = True
                for key, value in query.items():
                    if doc.get(key) != value:
                        match = False
                        break
                if match:
                    results.append(doc)
        return results
        
    async def insert_one(self, document):
        from bson import ObjectId
        doc_id = ObjectId()
        document['_id'] = doc_id
        self._data[str(doc_id)] = document
        self._save_data()
        return type('MockResult', (), {'inserted_id': doc_id})()
        
    async def update_one(self, query, update):
        self._save_data()
        return type('MockResult', (), {'modified_count': 1})()
        
    async def delete_one(self, query):
        self._save_data()
        return type('MockResult', (), {'deleted_count': 1})()