from fastapi import APIRouter, HTTPException
from typing import Optional
import random
import math

router = APIRouter()

# Mock users data with locations
MOCK_USERS = [
    {"id": 1, "name": "Ram Singh", "type": "farmer", "lat": 28.6139, "lng": 77.2090, "city": "Delhi", "crops": ["Wheat", "Rice"]},
    {"id": 2, "name": "Shyam Kumar", "type": "consumer", "lat": 28.6200, "lng": 77.2100, "city": "Delhi", "interests": ["Organic", "Fresh"]},
    {"id": 3, "name": "Gita Devi", "type": "farmer", "lat": 28.6000, "lng": 77.2000, "city": "Delhi", "crops": ["Vegetables", "Fruits"]},
    {"id": 4, "name": "Mohan Lal", "type": "consumer", "lat": 28.6300, "lng": 77.2200, "city": "Delhi", "interests": ["Local", "Seasonal"]},
    {"id": 5, "name": "Priya Sharma", "type": "farmer", "lat": 28.5900, "lng": 77.1900, "city": "Delhi", "crops": ["Organic Vegetables"]},
]

def calculate_distance(lat1, lng1, lat2, lng2):
    """Calculate distance between two points in kilometers"""
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lng1_rad = math.radians(lng1)
    lat2_rad = math.radians(lat2)
    lng2_rad = math.radians(lng2)
    
    dlat = lat2_rad - lat1_rad
    dlng = lng2_rad - lng1_rad
    
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlng/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return R * c

@router.get("/nearby-users")
async def get_nearby_users(latitude: float, longitude: float, radius: float = 50):
    """Get nearby users within specified radius"""
    try:
        nearby_users = []
        
        for user in MOCK_USERS:
            distance = calculate_distance(latitude, longitude, user["lat"], user["lng"])
            
            if distance <= radius:
                user_data = {
                    **user,
                    "distance": round(distance, 2)
                }
                nearby_users.append(user_data)
        
        # Sort by distance
        nearby_users.sort(key=lambda x: x["distance"])
        
        return {
            "users": nearby_users,
            "total": len(nearby_users),
            "radius": radius,
            "center": {"latitude": latitude, "longitude": longitude}
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/update-location")
async def update_user_location(location_data: dict):
    """Update user's location"""
    try:
        # In a real app, this would update the database
        return {
            "message": "Location updated successfully",
            "location": location_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user-stats/{user_id}")
async def get_user_location_stats(user_id: str):
    """Get user's location-based statistics"""
    try:
        return {
            "user_id": user_id,
            "total_connections": random.randint(10, 50),
            "nearby_farmers": random.randint(5, 25),
            "nearby_consumers": random.randint(5, 25),
            "successful_transactions": random.randint(2, 15),
            "average_distance": round(random.uniform(5.0, 25.0), 2)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))