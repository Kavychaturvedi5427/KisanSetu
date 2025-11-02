from fastapi import APIRouter, HTTPException, Depends
from app.utils.auth import verify_token
from app.database import get_database
from datetime import datetime
import random

router = APIRouter()

@router.get("/dashboard")
async def get_farmer_dashboard():
    """Get farmer dashboard data"""
    try:
        # Mock dashboard data
        dashboard_data = {
            "total_earnings": random.randint(80000, 150000),
            "crop_health": {
                "healthy": random.randint(80, 95),
                "total": 100
            },
            "recent_crops": [
                {
                    "name": "wheat",
                    "variety": "HD-2967",
                    "area": "5",
                    "status": "Growing"
                },
                {
                    "name": "rice",
                    "variety": "Basmati",
                    "area": "3",
                    "status": "Harvesting"
                }
            ],
            "regional_crops": ["Wheat", "Rice", "Cotton"],
            "local_market_prices": {
                "wheat": 2100,
                "rice": 1800,
                "onion": 25,
                "tomato": 30
            }
        }
        return dashboard_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/crops")
async def get_crops():
    """Get farmer's crops"""
    return {
        "crops": [
            {"id": 1, "name": "Wheat", "area": 5, "status": "Growing"},
            {"id": 2, "name": "Rice", "area": 3, "status": "Harvesting"}
        ]
    }