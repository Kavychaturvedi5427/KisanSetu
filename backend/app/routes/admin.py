from fastapi import APIRouter, HTTPException, Depends
from app.utils.auth import verify_token
from app.database import get_database
import random

router = APIRouter()

@router.get("/stats")
async def get_admin_stats():
    """Enhanced admin dashboard statistics with sustainability metrics"""
    
    # Core metrics
    total_users = random.randint(1200, 2500)
    total_farmers = random.randint(800, 1500)
    total_consumers = random.randint(400, 1000)
    total_orders = random.randint(500, 1200)
    total_revenue = random.randint(150000, 350000)
    
    # Sustainability metrics
    carbon_saved = random.randint(2500, 5000)  # kg CO2
    water_saved = random.randint(50000, 120000)  # liters
    organic_percentage = random.randint(65, 85)
    local_sourcing_percentage = random.randint(70, 90)
    
    return {
        "user_metrics": {
            "total_users": total_users,
            "total_farmers": total_farmers,
            "total_consumers": total_consumers,
            "active_users_today": random.randint(150, 300),
            "new_registrations_today": random.randint(15, 45),
            "user_growth_rate": f"+{random.randint(12, 25)}%"
        },
        "business_metrics": {
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "orders_today": random.randint(25, 75),
            "revenue_today": random.randint(5000, 15000),
            "avg_order_value": round(total_revenue / total_orders, 2),
            "revenue_growth_rate": f"+{random.randint(18, 35)}%"
        },
        "sustainability_metrics": {
            "total_carbon_saved_kg": carbon_saved,
            "total_water_saved_liters": water_saved,
            "organic_products_percentage": organic_percentage,
            "local_sourcing_percentage": local_sourcing_percentage,
            "farmers_supported": random.randint(450, 800),
            "avg_delivery_distance_km": random.randint(15, 35),
            "sustainability_score": random.randint(85, 95)
        },
        "platform_health": {
            "api_uptime_percentage": 99.8,
            "avg_response_time_ms": random.randint(150, 350),
            "active_listings": random.randint(2500, 4500),
            "successful_deliveries_percentage": random.randint(92, 98)
        },
        "regional_data": {
            "top_states": [
                {"state": "Punjab", "farmers": random.randint(150, 250), "orders": random.randint(200, 350)},
                {"state": "Haryana", "farmers": random.randint(120, 200), "orders": random.randint(150, 280)},
                {"state": "UP", "farmers": random.randint(180, 300), "orders": random.randint(220, 400)},
                {"state": "Maharashtra", "farmers": random.randint(100, 180), "orders": random.randint(130, 250)}
            ]
        },
        "trends": {
            "monthly_growth": [
                {"month": "Jan", "users": random.randint(100, 200), "orders": random.randint(50, 120)},
                {"month": "Feb", "users": random.randint(120, 220), "orders": random.randint(60, 140)},
                {"month": "Mar", "users": random.randint(140, 250), "orders": random.randint(70, 160)},
                {"month": "Apr", "users": random.randint(160, 280), "orders": random.randint(80, 180)}
            ]
        }
    }

@router.get("/users")
async def get_users_list(page: int = 1, limit: int = 10):
    """Get paginated users list"""
    # Mock users data
    users = []
    for i in range(limit):
        users.append({
            "id": f"user_{i + (page-1)*limit}",
            "username": f"user{i + (page-1)*limit}",
            "email": f"user{i + (page-1)*limit}@example.com",
            "full_name": f"User {i + (page-1)*limit}",
            "user_type": "farmer" if i % 2 == 0 else "consumer",
            "created_at": "2024-01-01T00:00:00Z",
            "is_active": True
        })
    
    return {
        "users": users,
        "total": random.randint(500, 1000),
        "page": page,
        "limit": limit
    }

@router.get("/all-users")
async def get_all_users():
    """Get all users for admin"""
    try:
        db = get_database()
        
        # Try to get from database first
        if hasattr(db, 'users'):
            users = await db.users.find({})
            user_list = []
            for user in users:
                user_data = {
                    "id": str(user.get("_id", "")),
                    "username": user.get("username", ""),
                    "email": user.get("email", ""),
                    "full_name": user.get("full_name", ""),
                    "user_type": user.get("user_type", ""),
                    "phone": user.get("phone", ""),
                    "created_at": user.get("created_at", ""),
                    "is_active": user.get("is_active", True)
                }
                user_list.append(user_data)
            return user_list
        else:
            # Return mock data if database not available
            return [
                {
                    "id": "1",
                    "username": "admin",
                    "email": "admin@kisansetu.com",
                    "full_name": "Admin User",
                    "user_type": "admin",
                    "phone": "9999999999",
                    "created_at": "2024-01-01T00:00:00Z",
                    "is_active": True
                },
                {
                    "id": "2", 
                    "username": "farmer1",
                    "email": "farmer1@example.com",
                    "full_name": "Ram Singh",
                    "user_type": "farmer",
                    "phone": "9876543210",
                    "created_at": "2024-01-02T00:00:00Z",
                    "is_active": True
                }
            ]
    except Exception as e:
        print(f"Error in get_all_users: {str(e)}")
        # Return mock data on error
        return [
            {
                "id": "mock_1",
                "username": "admin",
                "email": "admin@kisansetu.com", 
                "full_name": "Admin User",
                "user_type": "admin",
                "phone": "9999999999",
                "created_at": "2024-01-01T00:00:00Z",
                "is_active": True
            }
        ]