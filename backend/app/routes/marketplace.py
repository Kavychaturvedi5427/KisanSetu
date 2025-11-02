from fastapi import APIRouter, HTTPException
from typing import Optional
import random

router = APIRouter()

# Enhanced mock products data with sustainability metrics
MOCK_PRODUCTS = [
    {
        "id": 1, "name": "Organic Wheat", "price": 25, "category": "grains", 
        "seller": "Ram Singh", "image": "/seeds.jpg", "location": "Punjab", "distance_km": 15,
        "sustainability_score": 95, "carbon_footprint": 1.2, "organic": True, "rating": 4.8,
        "harvest_date": "2024-01-10", "quantity_kg": 500, "description": "Premium organic wheat grown without chemicals"
    },
    {
        "id": 2, "name": "Fresh Tomatoes", "price": 30, "category": "vegetables", 
        "seller": "Shyam Kumar", "image": "/placeholder.jpg", "location": "Haryana", "distance_km": 8,
        "sustainability_score": 85, "carbon_footprint": 0.8, "organic": False, "rating": 4.5,
        "harvest_date": "2024-01-12", "quantity_kg": 200, "description": "Fresh farm tomatoes, pesticide-free"
    },
    {
        "id": 3, "name": "Basmati Rice", "price": 80, "category": "grains", 
        "seller": "Gita Devi", "image": "/seeds.jpg", "location": "UP", "distance_km": 25,
        "sustainability_score": 90, "carbon_footprint": 2.1, "organic": True, "rating": 4.9,
        "harvest_date": "2024-01-05", "quantity_kg": 1000, "description": "Aromatic basmati rice, traditionally grown"
    },
    {
        "id": 4, "name": "Red Onions", "price": 25, "category": "vegetables", 
        "seller": "Mohan Lal", "image": "/placeholder.jpg", "location": "Rajasthan", "distance_km": 45,
        "sustainability_score": 80, "carbon_footprint": 1.5, "organic": False, "rating": 4.3,
        "harvest_date": "2024-01-08", "quantity_kg": 300, "description": "Quality red onions, good storage life"
    },
    {
        "id": 5, "name": "Organic Fertilizer", "price": 500, "category": "supplies", 
        "seller": "EcoFarm Solutions", "image": "/fertilizer.jpg", "location": "Local", "distance_km": 5,
        "sustainability_score": 100, "carbon_footprint": 0.3, "organic": True, "rating": 4.7,
        "harvest_date": "2024-01-01", "quantity_kg": 50, "description": "100% organic compost fertilizer"
    },
    {
        "id": 6, "name": "Heirloom Seeds", "price": 150, "category": "supplies", 
        "seller": "Heritage Seeds Co", "image": "/seeds.jpg", "location": "Karnataka", "distance_km": 12,
        "sustainability_score": 98, "carbon_footprint": 0.1, "organic": True, "rating": 4.9,
        "harvest_date": "2024-01-01", "quantity_kg": 2, "description": "Traditional heirloom vegetable seeds"
    },
    {
        "id": 7, "name": "Fresh Spinach", "price": 20, "category": "vegetables", 
        "seller": "Green Valley Farm", "image": "/placeholder.jpg", "location": "Local", "distance_km": 3,
        "sustainability_score": 92, "carbon_footprint": 0.2, "organic": True, "rating": 4.6,
        "harvest_date": "2024-01-13", "quantity_kg": 50, "description": "Fresh organic spinach, harvested daily"
    },
    {
        "id": 8, "name": "Millets Mix", "price": 45, "category": "grains", 
        "seller": "Sustainable Grains", "image": "/seeds.jpg", "location": "Tamil Nadu", "distance_km": 35,
        "sustainability_score": 96, "carbon_footprint": 0.9, "organic": True, "rating": 4.8,
        "harvest_date": "2024-01-07", "quantity_kg": 100, "description": "Nutritious millet mix, climate-resilient crops"
    }
]

@router.get("/products")
async def get_products(
    category: Optional[str] = None, 
    search: Optional[str] = None,
    organic_only: bool = False,
    max_distance: Optional[int] = None,
    sort_by: str = "name",
    min_sustainability: Optional[int] = None
):
    """Enhanced product search with sustainability filters"""
    products = MOCK_PRODUCTS.copy()
    
    # Apply filters
    if category:
        products = [p for p in products if p["category"] == category]
    
    if search:
        products = [p for p in products if search.lower() in p["name"].lower() or search.lower() in p["description"].lower()]
    
    if organic_only:
        products = [p for p in products if p["organic"]]
    
    if max_distance:
        products = [p for p in products if p["distance_km"] <= max_distance]
    
    if min_sustainability:
        products = [p for p in products if p["sustainability_score"] >= min_sustainability]
    
    # Sort products
    if sort_by == "price_low":
        products.sort(key=lambda x: x["price"])
    elif sort_by == "price_high":
        products.sort(key=lambda x: x["price"], reverse=True)
    elif sort_by == "distance":
        products.sort(key=lambda x: x["distance_km"])
    elif sort_by == "sustainability":
        products.sort(key=lambda x: x["sustainability_score"], reverse=True)
    elif sort_by == "rating":
        products.sort(key=lambda x: x["rating"], reverse=True)
    elif sort_by == "freshness":
        products.sort(key=lambda x: x["harvest_date"], reverse=True)
    
    # Calculate total carbon savings
    total_carbon_saved = sum(2.5 - p["carbon_footprint"] for p in products if p["carbon_footprint"] < 2.5)
    
    return {
        "products": products,
        "total_products": len(products),
        "filters_applied": {
            "category": category,
            "organic_only": organic_only,
            "max_distance": max_distance,
            "min_sustainability": min_sustainability
        },
        "sustainability_metrics": {
            "avg_sustainability_score": round(sum(p["sustainability_score"] for p in products) / len(products), 1) if products else 0,
            "organic_percentage": round(sum(1 for p in products if p["organic"]) / len(products) * 100, 1) if products else 0,
            "avg_distance_km": round(sum(p["distance_km"] for p in products) / len(products), 1) if products else 0,
            "total_carbon_saved_kg": round(total_carbon_saved, 2)
        }
    }

@router.get("/products/{product_id}")
async def get_product(product_id: int):
    """Get single product"""
    product = next((p for p in MOCK_PRODUCTS if p["id"] == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/categories")
async def get_categories():
    """Get product categories"""
    return {
        "categories": [
            {"id": "grains", "name": "Grains", "icon": "🌾"},
            {"id": "vegetables", "name": "Vegetables", "icon": "🥕"},
            {"id": "fruits", "name": "Fruits", "icon": "🍎"},
            {"id": "supplies", "name": "Supplies", "icon": "🛠️"}
        ]
    }

@router.post("/orders")
async def create_order(order_data: dict):
    """Enhanced order creation with sustainability tracking"""
    
    order_id = random.randint(1000, 9999)
    
    # Calculate sustainability impact
    total_carbon_footprint = 0
    total_distance = 0
    organic_items = 0
    total_items = len(order_data.get('items', []))
    
    for item in order_data.get('items', []):
        product = next((p for p in MOCK_PRODUCTS if p['id'] == item.get('product_id')), None)
        if product:
            quantity = item.get('quantity', 1)
            total_carbon_footprint += product['carbon_footprint'] * quantity
            total_distance += product['distance_km']
            if product['organic']:
                organic_items += 1
    
    avg_distance = total_distance / total_items if total_items > 0 else 0
    carbon_saved = (2.5 * total_items) - total_carbon_footprint  # vs conventional supply chain
    
    return {
        "order_id": order_id,
        "status": "confirmed",
        "message": "Order placed successfully",
        "estimated_delivery": "2-3 days",
        "sustainability_impact": {
            "carbon_footprint_kg": round(total_carbon_footprint, 2),
            "carbon_saved_kg": round(max(0, carbon_saved), 2),
            "avg_distance_km": round(avg_distance, 1),
            "organic_percentage": round((organic_items / total_items) * 100, 1) if total_items > 0 else 0,
            "sustainability_score": random.randint(80, 95)
        },
        "farmer_support": {
            "farmers_supported": len(set(item.get('seller_id') for item in order_data.get('items', []))),
            "fair_trade_premium": "15% above market rate"
        }
    }

@router.get("/orders")
async def get_orders():
    """Get user orders"""
    return {
        "orders": [
            {
                "id": 1001,
                "date": "2024-01-15",
                "total": 250,
                "status": "delivered",
                "items": ["Wheat 10kg", "Rice 5kg"]
            }
        ]
    }