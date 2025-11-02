from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from app.schemas.farmer import CropCreate, CropUpdate, CropResponse
from app.utils.auth import verify_token
from app.database import get_database
from bson import ObjectId
from datetime import datetime
from typing import List

router = APIRouter()
security = HTTPBearer()

@router.post("/crops", response_model=dict)
async def create_crop(crop: CropCreate, token: str = Depends(security)):
    username = verify_token(token.credentials)
    db = get_database()
    
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    crop_doc = {
        "name": crop.name,
        "variety": crop.variety,
        "area": crop.area,
        "planting_date": crop.planting_date,
        "expected_harvest": crop.expected_harvest,
        "status": crop.status,
        "farmer_id": str(user["_id"]),
        "created_at": datetime.utcnow()
    }
    
    result = await db.crops.insert_one(crop_doc)
    return {"message": "Crop created successfully", "crop_id": str(result.inserted_id)}

@router.get("/crops", response_model=List[dict])
async def get_crops(token: str = Depends(security)):
    username = verify_token(token.credentials)
    db = get_database()
    
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    crops = await db.crops.find({"farmer_id": str(user["_id"])}).to_list(100)
    
    for crop in crops:
        crop["id"] = str(crop["_id"])
        del crop["_id"]
    
    return crops

@router.put("/crops/{crop_id}", response_model=dict)
async def update_crop(crop_id: str, crop_update: CropUpdate, token: str = Depends(security)):
    username = verify_token(token.credentials)
    db = get_database()
    
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = {k: v for k, v in crop_update.dict().items() if v is not None}
    
    if update_data:
        result = await db.crops.update_one(
            {"_id": ObjectId(crop_id), "farmer_id": str(user["_id"])},
            {"$set": update_data}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Crop not found")
    
    return {"message": "Crop updated successfully"}

@router.delete("/crops/{crop_id}", response_model=dict)
async def delete_crop(crop_id: str, token: str = Depends(security)):
    username = verify_token(token.credentials)
    db = get_database()
    
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    result = await db.crops.delete_one({"_id": ObjectId(crop_id), "farmer_id": str(user["_id"])})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Crop not found")
    
    return {"message": "Crop deleted successfully"}

@router.get("/dashboard", response_model=dict)
async def get_farmer_dashboard(token: str = Depends(security)):
    username = verify_token(token.credentials)
    db = get_database()
    
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get farmer's crops
    crops = await db.crops.find({"farmer_id": str(user["_id"])}).to_list(100)
    
    # Get farmer's orders
    orders = await db.orders.find({"user_id": str(user["_id"])}).to_list(100)
    
    # Calculate statistics
    total_crops = len(crops)
    total_area = sum(crop.get("area", 0) for crop in crops)
    total_orders = len(orders)
    total_earnings = sum(order.get("total_amount", 0) for order in orders if order.get("status") == "completed")
    
    # Crop health summary
    healthy_crops = len([c for c in crops if c.get("status") == "healthy"])
    growing_crops = len([c for c in crops if c.get("status") == "growing"])
    
    return {
        "farmer_name": user.get("full_name", username),
        "total_crops": total_crops,
        "total_area": total_area,
        "total_orders": total_orders,
        "total_earnings": total_earnings,
        "crop_health": {
            "healthy": healthy_crops,
            "growing": growing_crops,
            "total": total_crops
        },
        "recent_crops": crops[:5],  # Last 5 crops
        "recent_orders": orders[:5],  # Last 5 orders
        "weather_alert": "Moderate weather conditions expected for next 3 days",
        "recommendations": [
            "Monitor soil moisture levels",
            "Apply organic fertilizer for better yield",
            "Check for pest infestations"
        ]
    }