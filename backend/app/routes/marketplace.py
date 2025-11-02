from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer
from app.schemas.marketplace import OrderCreate, OrderResponse
from app.utils.auth import verify_token
from app.database import get_database
from bson import ObjectId
from datetime import datetime
from typing import List

router = APIRouter()
security = HTTPBearer()

# Sample products data
products_data = [
    {"id": "1", "name": "Organic Fertilizer", "description": "High quality organic fertilizer for better crop yield", "price": 500, "category": "fertilizer", "image_url": "/fertilizer.jpg", "rating": 4.5, "stock": 50, "farmer_name": "Ram Singh", "location": "Punjab"},
    {"id": "2", "name": "Premium Seeds Pack", "description": "High-yield wheat seeds variety HD-2967", "price": 200, "category": "seeds", "image_url": "/seeds.jpg", "rating": 4.8, "stock": 100, "farmer_name": "Suresh Kumar", "location": "Haryana"},
    {"id": "3", "name": "Drip Irrigation Kit", "description": "Complete water-saving irrigation system", "price": 2500, "category": "equipment", "image_url": "/dripirrigation.jpg", "rating": 4.3, "stock": 25, "farmer_name": "Agri Solutions", "location": "Delhi"},
    {"id": "4", "name": "Soil Tester Kit", "description": "Digital pH and nutrient testing device", "price": 800, "category": "tools", "image_url": "/soiltesterkit.jpg", "rating": 4.6, "stock": 30, "farmer_name": "Tech Agri", "location": "Bangalore"},
    {"id": "5", "name": "Natural Pesticides", "description": "Neem-based eco-friendly pest control", "price": 400, "category": "pesticide", "image_url": "/naturalpesticides.jpg", "rating": 4.4, "stock": 75, "farmer_name": "Organic Farm", "location": "Kerala"},
    {"id": "6", "name": "Compost Bag", "description": "Organic compost for soil enrichment", "price": 150, "category": "fertilizer", "image_url": "/compostbag.jpg", "rating": 4.2, "stock": 80, "farmer_name": "Green Earth", "location": "Maharashtra"},
    {"id": "7", "name": "Mini Greenhouse", "description": "Portable greenhouse for small farms", "price": 5000, "category": "equipment", "image_url": "/minigreenhouse.jpg", "rating": 4.7, "stock": 15, "farmer_name": "Farm Tech", "location": "Gujarat"},
    {"id": "8", "name": "Tractor Rental", "description": "Daily tractor rental service", "price": 1200, "category": "equipment", "image_url": "/tractorrental.jpg", "rating": 4.5, "stock": 5, "farmer_name": "Rental Hub", "location": "Uttar Pradesh"},
    {"id": "9", "name": "Watering Can", "description": "Heavy-duty metal watering can", "price": 300, "category": "tools", "image_url": "/wateringcan.jpg", "rating": 4.1, "stock": 60, "farmer_name": "Tool Mart", "location": "Rajasthan"}
]

@router.get("/products", response_model=List[dict])
async def get_products(category: str = None, min_price: float = None, max_price: float = None, search: str = None, location: str = None):
    products = products_data.copy()
    
    if category:
        products = [p for p in products if p["category"] == category]
    if min_price:
        products = [p for p in products if p["price"] >= min_price]
    if max_price:
        products = [p for p in products if p["price"] <= max_price]
    if search:
        products = [p for p in products if search.lower() in p["name"].lower() or search.lower() in p["description"].lower()]
    if location:
        products = [p for p in products if location.lower() in p["location"].lower()]
    
    return products

@router.get("/products/{product_id}", response_model=dict)
async def get_product(product_id: str):
    product = next((p for p in products_data if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/categories", response_model=List[str])
async def get_categories():
    categories = list(set(p["category"] for p in products_data))
    return sorted(categories)

@router.post("/orders", response_model=dict)
async def create_order(order_data: dict, token: str = Depends(security)):
    username = verify_token(token.credentials)
    db = get_database()
    
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Generate order ID
    order_id = f"ORD{datetime.utcnow().strftime('%Y%m%d')}{str(user['_id'])[-4:]}{len(await db.orders.find({}).to_list(1000)) + 1:03d}"
    
    order_doc = {
        "order_id": order_id,
        "user_id": str(user["_id"]),
        "user_name": user.get("full_name", username),
        "items": order_data.get("items", []),
        "delivery_address": order_data.get("delivery_address", ""),
        "payment_method": order_data.get("payment_method", "cod"),
        "discount_applied": order_data.get("discount_applied", 0),
        "total_amount": order_data.get("total_amount", 0),
        "status": "confirmed",
        "created_at": datetime.utcnow(),
        "estimated_delivery": datetime.utcnow() + timedelta(days=3)
    }
    
    result = await db.orders.insert_one(order_doc)
    
    return {
        "message": "Order placed successfully! 🎉",
        "order_id": order_id,
        "total_amount": order_data.get("total_amount", 0),
        "estimated_delivery": "3-5 business days",
        "status": "confirmed"
    }

@router.get("/orders/{order_id}", response_model=dict)
async def get_order(order_id: str, token: str = Depends(security)):
    username = verify_token(token.credentials)
    db = get_database()
    
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    order = await db.orders.find_one({"_id": ObjectId(order_id), "user_id": str(user["_id"])})
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order["id"] = str(order["_id"])
    del order["_id"]
    
    return order

@router.get("/orders", response_model=List[dict])
async def get_user_orders(token: str = Depends(security)):
    username = verify_token(token.credentials)
    db = get_database()
    
    user = await db.users.find_one({"username": username})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    orders = await db.orders.find({"user_id": str(user["_id"])}).to_list(100)
    
    for order in orders:
        order["id"] = str(order["_id"])
        del order["_id"]
    
    return orders