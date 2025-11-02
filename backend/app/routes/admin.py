from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from app.utils.auth import verify_token
from app.database import get_database
from datetime import datetime, timedelta

router = APIRouter()
security = HTTPBearer()

async def verify_admin(token: str):
    username = verify_token(token)
    db = get_database()
    user = await db.users.find_one({"username": username})
    if not user or user.get("user_type") != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.get("/stats", response_model=dict)
async def get_admin_stats(token: str = Depends(security)):
    await verify_admin(token.credentials)
    db = get_database()
    
    # Get user statistics
    total_users = await db.users.count_documents({})
    farmers = await db.users.count_documents({"user_type": "farmer"})
    
    # Get recent registrations (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    recent_users = await db.users.count_documents({"created_at": {"$gte": week_ago}})
    
    # Get crop statistics
    total_crops = await db.crops.count_documents({})
    
    # Get order statistics
    total_orders = await db.orders.count_documents({})
    pending_orders = await db.orders.count_documents({"status": "pending"})
    
    return {
        "users": {
            "total": total_users,
            "farmers": farmers,
            "recent_registrations": recent_users
        },
        "crops": {
            "total": total_crops
        },
        "orders": {
            "total": total_orders,
            "pending": pending_orders
        },
        "generated_at": datetime.utcnow()
    }

@router.get("/users", response_model=dict)
async def get_all_users(skip: int = 0, limit: int = 50, token: str = Depends(security)):
    await verify_admin(token.credentials)
    db = get_database()
    
    users = await db.users.find({}, {"hashed_password": 0}).skip(skip).limit(limit).to_list(limit)
    
    for user in users:
        user["id"] = str(user["_id"])
        del user["_id"]
    
    total_count = await db.users.count_documents({})
    
    return {
        "users": users,
        "total": total_count,
        "skip": skip,
        "limit": limit
    }