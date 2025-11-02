import asyncio
from app.database import connect_to_mongo, get_database
from app.utils.auth import get_password_hash
from datetime import datetime

async def create_admin_user():
    """Create admin user in database"""
    try:
        await connect_to_mongo()
        db = get_database()
        
        # Check if admin exists
        existing_admin = await db.users.find_one({"username": "admin"})
        if existing_admin:
            print("✅ Admin user already exists")
            return
        
        # Create admin user
        admin_user = {
            "username": "admin",
            "email": "admin@kisansetu.com",
            "full_name": "Admin User",
            "user_type": "admin",
            "hashed_password": get_password_hash("password"),
            "created_at": datetime.utcnow(),
            "is_active": True
        }
        
        result = await db.users.insert_one(admin_user)
        print(f"✅ Admin user created with ID: {result.inserted_id}")
        
        # Create sample farmer user
        farmer_user = {
            "username": "farmer1",
            "email": "farmer@kisansetu.com",
            "full_name": "Ram Singh",
            "user_type": "farmer",
            "hashed_password": get_password_hash("password"),
            "created_at": datetime.utcnow(),
            "is_active": True
        }
        
        result = await db.users.insert_one(farmer_user)
        print(f"✅ Sample farmer user created with ID: {result.inserted_id}")
        
        # Create sample crops for farmer
        farmer_id = str(result.inserted_id)
        sample_crops = [
            {
                "name": "wheat",
                "variety": "HD-2967",
                "area": 5.0,
                "planting_date": datetime(2024, 11, 15),
                "expected_harvest": datetime(2025, 4, 15),
                "status": "growing",
                "farmer_id": farmer_id,
                "created_at": datetime.utcnow()
            },
            {
                "name": "rice",
                "variety": "Basmati",
                "area": 3.0,
                "planting_date": datetime(2024, 6, 15),
                "expected_harvest": datetime(2024, 11, 15),
                "status": "healthy",
                "farmer_id": farmer_id,
                "created_at": datetime.utcnow()
            }
        ]
        
        await db.crops.insert_many(sample_crops)
        print("✅ Sample crops created")
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")

if __name__ == "__main__":
    asyncio.run(create_admin_user())