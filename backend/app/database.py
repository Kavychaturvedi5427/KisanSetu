from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "kisan_setu")

client: AsyncIOMotorClient = None
database = None

async def connect_to_mongo():
    global client, database
    client = AsyncIOMotorClient(MONGODB_URL)
    database = client[DATABASE_NAME]
    print("Connected to MongoDB")

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("Disconnected from MongoDB")

def get_database():
    return database