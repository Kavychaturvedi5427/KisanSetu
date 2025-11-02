from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from app.utils.auth import verify_token
from app.database import get_database
from typing import List, Dict, Any
import math

router = APIRouter()
security = HTTPBearer()

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points using Haversine formula"""
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

@router.get("/nearby-users", response_model=List[Dict[Any, Any]])
async def get_nearby_users(
    latitude: float, 
    longitude: float, 
    radius: float = 50.0,
    token: str = Depends(security)
):
    username = verify_token(token.credentials)
    db = get_database()
    
    current_user = await db.users.find_one({"username": username})
    if not current_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Determine target user type (opposite of current user)
    target_user_type = "consumer" if current_user["user_type"] == "farmer" else "farmer"
    
    # Get all users of target type
    target_users = await db.users.find({
        "user_type": target_user_type,
        "username": {"$ne": username}  # Exclude current user
    }).to_list(100)
    
    nearby_users = []
    
    for user in target_users:
        # Mock location data for demo (in real app, this would be stored in user profile)
        user_locations = {
            "farmer": [
                {"lat": 28.7041, "lng": 77.1025},  # Delhi
                {"lat": 28.4595, "lng": 77.0266},  # Gurgaon
                {"lat": 28.5355, "lng": 77.3910},  # Noida
                {"lat": 28.4089, "lng": 77.3178},  # Faridabad
            ],
            "consumer": [
                {"lat": 28.6139, "lng": 77.2090},  # Delhi
                {"lat": 28.4595, "lng": 77.0266},  # Gurgaon
                {"lat": 28.5355, "lng": 77.3910},  # Noida
                {"lat": 28.4089, "lng": 77.3178},  # Faridabad
            ]
        }
        
        # Assign random location from the pool
        import random
        user_location = random.choice(user_locations[target_user_type])
        
        # Calculate distance
        distance = calculate_distance(
            latitude, longitude,
            user_location["lat"], user_location["lng"]
        )
        
        # Include only users within specified radius
        if distance <= radius:
            user_data = {
                "id": str(user["_id"]),
                "name": user["full_name"],
                "username": user["username"],
                "user_type": user["user_type"],
                "email": user["email"],
                "distance": round(distance, 1),
                "location": {
                    "latitude": user_location["lat"],
                    "longitude": user_location["lng"]
                },
                "created_at": user["created_at"]
            }
            
            # Add type-specific data
            if target_user_type == "farmer":
                user_data["products"] = ["Wheat", "Rice", "Vegetables"]  # Mock data
                user_data["rating"] = round(4.0 + random.random(), 1)
                user_data["sales_count"] = random.randint(50, 200)
            else:
                user_data["requirements"] = ["Fresh Vegetables", "Organic Grains"]  # Mock data
                user_data["rating"] = round(4.0 + random.random(), 1)
                user_data["order_count"] = random.randint(10, 50)
            
            nearby_users.append(user_data)
    
    # Sort by distance
    nearby_users.sort(key=lambda x: x["distance"])
    
    return nearby_users

@router.post("/update-location")
async def update_user_location(
    location_data: dict,
    token: str = Depends(security)
):
    username = verify_token(token.credentials)
    db = get_database()
    
    # Update user location in database
    result = await db.users.update_one(
        {"username": username},
        {"$set": {
            "location": {
                "latitude": location_data.get("latitude"),
                "longitude": location_data.get("longitude"),
                "address": location_data.get("address", ""),
                "updated_at": "2025-01-27T00:00:00"
            }
        }}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"message": "Location updated successfully"}

@router.get("/user-stats/{user_id}")
async def get_user_stats(user_id: str, token: str = Depends(security)):
    verify_token(token.credentials)
    db = get_database()
    
    from bson import ObjectId
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Mock stats for demo
    import random
    stats = {
        "user_id": user_id,
        "name": user["full_name"],
        "user_type": user["user_type"],
        "rating": round(4.0 + random.random(), 1),
        "total_transactions": random.randint(20, 100),
        "joined_date": user["created_at"],
        "verified": True
    }
    
    if user["user_type"] == "farmer":
        stats.update({
            "products": ["Wheat", "Rice", "Vegetables", "Fruits"],
            "farm_size": f"{random.randint(2, 20)} acres",
            "organic_certified": random.choice([True, False])
        })
    else:
        stats.update({
            "preferred_products": ["Organic Vegetables", "Fresh Fruits", "Dairy"],
            "average_order_value": f"₹{random.randint(500, 2000)}",
            "regular_customer": random.choice([True, False])
        })
    
    return stats