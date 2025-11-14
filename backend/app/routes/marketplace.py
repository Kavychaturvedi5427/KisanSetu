from fastapi import APIRouter, HTTPException
from typing import Optional
import random

router = APIRouter()

# Enhanced mock products data with sustainability metrics and proper images
MOCK_PRODUCTS = [
    # GRAINS
    {
        "id": 1, "name": "Organic Wheat", "price": 25, "category": "grains", 
        "seller": "Ram Singh", "image": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400", "location": "Punjab", "distance_km": 15,
        "sustainability_score": 95, "carbon_footprint": 1.2, "organic": True, "rating": 4.8,
        "harvest_date": "2024-01-10", "quantity_kg": 500, "description": "Premium organic wheat grown without chemicals"
    },
    {
        "id": 2, "name": "Basmati Rice", "price": 80, "category": "grains", 
        "seller": "Gita Devi", "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", "location": "UP", "distance_km": 25,
        "sustainability_score": 90, "carbon_footprint": 2.1, "organic": True, "rating": 4.9,
        "harvest_date": "2024-01-05", "quantity_kg": 1000, "description": "Aromatic basmati rice, traditionally grown"
    },
    {
        "id": 3, "name": "Millets Mix", "price": 45, "category": "grains", 
        "seller": "Sustainable Grains", "image": "https://images.unsplash.com/photo-1605034313761-73ea4a0cfbf3?w=400", "location": "Tamil Nadu", "distance_km": 35,
        "sustainability_score": 96, "carbon_footprint": 0.9, "organic": True, "rating": 4.8,
        "harvest_date": "2024-01-07", "quantity_kg": 100, "description": "Nutritious millet mix, climate-resilient crops"
    },
    {
        "id": 4, "name": "Quinoa", "price": 120, "category": "grains", 
        "seller": "Health Grains Co", "image": "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400", "location": "Himachal Pradesh", "distance_km": 50,
        "sustainability_score": 92, "carbon_footprint": 1.0, "organic": True, "rating": 4.7,
        "harvest_date": "2024-01-08", "quantity_kg": 75, "description": "High-protein superfood grain"
    },
    {
        "id": 5, "name": "Black Rice", "price": 95, "category": "grains", 
        "seller": "Organic Valley", "image": "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=400", "location": "Assam", "distance_km": 40,
        "sustainability_score": 94, "carbon_footprint": 1.8, "organic": True, "rating": 4.6,
        "harvest_date": "2024-01-09", "quantity_kg": 150, "description": "Antioxidant-rich black rice variety"
    },
    
    # VEGETABLES
    {
        "id": 6, "name": "Fresh Tomatoes", "price": 30, "category": "vegetables", 
        "seller": "Shyam Kumar", "image": "https://images.unsplash.com/photo-1546470427-e5380e0d26db?w=400", "location": "Haryana", "distance_km": 8,
        "sustainability_score": 85, "carbon_footprint": 0.8, "organic": False, "rating": 4.5,
        "harvest_date": "2024-01-12", "quantity_kg": 200, "description": "Fresh farm tomatoes, pesticide-free"
    },
    {
        "id": 7, "name": "Red Onions", "price": 25, "category": "vegetables", 
        "seller": "Mohan Lal", "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400", "location": "Rajasthan", "distance_km": 45,
        "sustainability_score": 80, "carbon_footprint": 1.5, "organic": False, "rating": 4.3,
        "harvest_date": "2024-01-08", "quantity_kg": 300, "description": "Quality red onions, good storage life"
    },
    {
        "id": 8, "name": "Fresh Spinach", "price": 20, "category": "vegetables", 
        "seller": "Green Valley Farm", "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400", "location": "Local", "distance_km": 3,
        "sustainability_score": 92, "carbon_footprint": 0.2, "organic": True, "rating": 4.6,
        "harvest_date": "2024-01-13", "quantity_kg": 50, "description": "Fresh organic spinach, harvested daily"
    },
    {
        "id": 9, "name": "Organic Carrots", "price": 35, "category": "vegetables", 
        "seller": "Fresh Fields", "image": "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400", "location": "Punjab", "distance_km": 12,
        "sustainability_score": 88, "carbon_footprint": 0.6, "organic": True, "rating": 4.4,
        "harvest_date": "2024-01-11", "quantity_kg": 120, "description": "Sweet organic carrots, rich in beta-carotene"
    },
    {
        "id": 10, "name": "Green Capsicum", "price": 40, "category": "vegetables", 
        "seller": "Veggie Paradise", "image": "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400", "location": "Maharashtra", "distance_km": 28,
        "sustainability_score": 83, "carbon_footprint": 0.9, "organic": False, "rating": 4.2,
        "harvest_date": "2024-01-12", "quantity_kg": 80, "description": "Fresh green bell peppers, vitamin C rich"
    },
    {
        "id": 11, "name": "Organic Potatoes", "price": 22, "category": "vegetables", 
        "seller": "Earth Harvest", "image": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400", "location": "UP", "distance_km": 18,
        "sustainability_score": 87, "carbon_footprint": 1.1, "organic": True, "rating": 4.5,
        "harvest_date": "2024-01-09", "quantity_kg": 400, "description": "Organic potatoes, perfect for cooking"
    },
    
    # FRUITS
    {
        "id": 12, "name": "Fresh Apples", "price": 80, "category": "fruits", 
        "seller": "Hill Orchards", "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400", "location": "Himachal Pradesh", "distance_km": 60,
        "sustainability_score": 89, "carbon_footprint": 1.3, "organic": True, "rating": 4.7,
        "harvest_date": "2024-01-05", "quantity_kg": 200, "description": "Crisp organic apples from hill stations"
    },
    {
        "id": 13, "name": "Organic Bananas", "price": 35, "category": "fruits", 
        "seller": "Tropical Farms", "image": "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400", "location": "Kerala", "distance_km": 45,
        "sustainability_score": 91, "carbon_footprint": 0.7, "organic": True, "rating": 4.6,
        "harvest_date": "2024-01-11", "quantity_kg": 150, "description": "Sweet organic bananas, naturally ripened"
    },
    {
        "id": 14, "name": "Fresh Oranges", "price": 45, "category": "fruits", 
        "seller": "Citrus Grove", "image": "https://images.unsplash.com/photo-1547514701-42782101795e?w=400", "location": "Maharashtra", "distance_km": 35,
        "sustainability_score": 86, "carbon_footprint": 1.0, "organic": False, "rating": 4.4,
        "harvest_date": "2024-01-10", "quantity_kg": 180, "description": "Juicy oranges, high in vitamin C"
    },
    {
        "id": 15, "name": "Organic Mangoes", "price": 120, "category": "fruits", 
        "seller": "Mango King", "image": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400", "location": "UP", "distance_km": 22,
        "sustainability_score": 93, "carbon_footprint": 1.2, "organic": True, "rating": 4.9,
        "harvest_date": "2024-01-08", "quantity_kg": 100, "description": "Premium organic mangoes, king of fruits"
    },
    
    # FARMING SUPPLIES
    {
        "id": 16, "name": "Organic Fertilizer", "price": 500, "category": "supplies", 
        "seller": "EcoFarm Solutions", "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400", "location": "Local", "distance_km": 5,
        "sustainability_score": 100, "carbon_footprint": 0.3, "organic": True, "rating": 4.7,
        "harvest_date": "2024-01-01", "quantity_kg": 50, "description": "100% organic compost fertilizer"
    },
    {
        "id": 17, "name": "Vegetable Seeds Pack", "price": 150, "category": "supplies", 
        "seller": "Heritage Seeds Co", "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400", "location": "Karnataka", "distance_km": 12,
        "sustainability_score": 98, "carbon_footprint": 0.1, "organic": True, "rating": 4.9,
        "harvest_date": "2024-01-01", "quantity_kg": 2, "description": "Traditional heirloom vegetable seeds"
    },
    {
        "id": 18, "name": "Bio Pesticide", "price": 300, "category": "supplies", 
        "seller": "Green Guard", "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400", "location": "Gujarat", "distance_km": 30,
        "sustainability_score": 95, "carbon_footprint": 0.2, "organic": True, "rating": 4.5,
        "harvest_date": "2024-01-01", "quantity_kg": 5, "description": "Natural bio-pesticide, safe for crops"
    },
    {
        "id": 19, "name": "Drip Irrigation Kit", "price": 2500, "category": "supplies", 
        "seller": "Water Wise", "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400", "location": "Rajasthan", "distance_km": 40,
        "sustainability_score": 92, "carbon_footprint": 0.5, "organic": False, "rating": 4.6,
        "harvest_date": "2024-01-01", "quantity_kg": 15, "description": "Water-efficient drip irrigation system"
    },
    {
        "id": 20, "name": "Soil Testing Kit", "price": 800, "category": "supplies", 
        "seller": "Agri Tech", "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400", "location": "Delhi", "distance_km": 25,
        "sustainability_score": 88, "carbon_footprint": 0.1, "organic": False, "rating": 4.4,
        "harvest_date": "2024-01-01", "quantity_kg": 1, "description": "Complete soil analysis kit for farmers"
    },
    
    # DAIRY & LIVESTOCK
    {
        "id": 21, "name": "Fresh Cow Milk", "price": 45, "category": "dairy", 
        "seller": "Dairy Fresh", "image": "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400", "location": "Haryana", "distance_km": 15,
        "sustainability_score": 85, "carbon_footprint": 2.0, "organic": True, "rating": 4.5,
        "harvest_date": "2024-01-13", "quantity_kg": 20, "description": "Fresh organic cow milk, daily delivery"
    },
    {
        "id": 22, "name": "Farm Eggs", "price": 8, "category": "dairy", 
        "seller": "Happy Hens", "image": "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400", "location": "Punjab", "distance_km": 10,
        "sustainability_score": 90, "carbon_footprint": 1.2, "organic": True, "rating": 4.7,
        "harvest_date": "2024-01-13", "quantity_kg": 1, "description": "Free-range organic eggs, per piece"
    },
    {
        "id": 23, "name": "Goat Cheese", "price": 250, "category": "dairy", 
        "seller": "Mountain Dairy", "image": "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400", "location": "Himachal Pradesh", "distance_km": 55,
        "sustainability_score": 88, "carbon_footprint": 1.8, "organic": True, "rating": 4.6,
        "harvest_date": "2024-01-10", "quantity_kg": 0.5, "description": "Artisanal goat cheese, handmade"
    },
    
    # SPICES & HERBS
    {
        "id": 24, "name": "Organic Turmeric", "price": 180, "category": "spices", 
        "seller": "Spice Garden", "image": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400", "location": "Kerala", "distance_km": 50,
        "sustainability_score": 96, "carbon_footprint": 0.3, "organic": True, "rating": 4.8,
        "harvest_date": "2024-01-05", "quantity_kg": 5, "description": "Premium organic turmeric powder"
    },
    {
        "id": 25, "name": "Fresh Ginger", "price": 65, "category": "spices", 
        "seller": "Herb Valley", "image": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400", "location": "Himachal Pradesh", "distance_km": 45,
        "sustainability_score": 92, "carbon_footprint": 0.4, "organic": True, "rating": 4.6,
        "harvest_date": "2024-01-09", "quantity_kg": 10, "description": "Fresh organic ginger root"
    },
    {
        "id": 31, "name": "Red Chili Powder", "price": 150, "category": "spices", 
        "seller": "Spice Masters", "image": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400", "location": "Andhra Pradesh", "distance_km": 55,
        "sustainability_score": 89, "carbon_footprint": 0.5, "organic": False, "rating": 4.5,
        "harvest_date": "2024-01-06", "quantity_kg": 8, "description": "Authentic red chili powder, medium spice"
    },
    {
        "id": 32, "name": "Coriander Seeds", "price": 85, "category": "spices", 
        "seller": "Herb Harvest", "image": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400", "location": "Rajasthan", "distance_km": 38,
        "sustainability_score": 91, "carbon_footprint": 0.3, "organic": True, "rating": 4.4,
        "harvest_date": "2024-01-07", "quantity_kg": 12, "description": "Organic coriander seeds, aromatic quality"
    },
    
    # MORE VEGETABLES
    {
        "id": 33, "name": "Cauliflower", "price": 28, "category": "vegetables", 
        "seller": "Fresh Harvest", "image": "https://images.unsplash.com/photo-1568584711271-946d4d46b7d8?w=400", "location": "Punjab", "distance_km": 18,
        "sustainability_score": 84, "carbon_footprint": 0.7, "organic": False, "rating": 4.3,
        "harvest_date": "2024-01-12", "quantity_kg": 100, "description": "Fresh white cauliflower heads"
    },
    {
        "id": 34, "name": "Green Peas", "price": 45, "category": "vegetables", 
        "seller": "Garden Fresh", "image": "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400", "location": "UP", "distance_km": 22,
        "sustainability_score": 87, "carbon_footprint": 0.4, "organic": True, "rating": 4.6,
        "harvest_date": "2024-01-13", "quantity_kg": 60, "description": "Sweet organic green peas, freshly shelled"
    },
    {
        "id": 35, "name": "Bottle Gourd", "price": 18, "category": "vegetables", 
        "seller": "Village Farms", "image": "https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=400", "location": "Haryana", "distance_km": 15,
        "sustainability_score": 82, "carbon_footprint": 0.3, "organic": False, "rating": 4.2,
        "harvest_date": "2024-01-11", "quantity_kg": 80, "description": "Fresh bottle gourd, perfect for curry"
    },
    
    # MORE FARMING EQUIPMENT
    {
        "id": 26, "name": "Hand Tractor", "price": 45000, "category": "supplies", 
        "seller": "Farm Machinery", "image": "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400", "location": "Punjab", "distance_km": 20,
        "sustainability_score": 85, "carbon_footprint": 5.0, "organic": False, "rating": 4.5,
        "harvest_date": "2024-01-01", "quantity_kg": 200, "description": "Compact hand tractor for small farms"
    },
    {
        "id": 27, "name": "Solar Water Pump", "price": 15000, "category": "supplies", 
        "seller": "Solar Solutions", "image": "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400", "location": "Rajasthan", "distance_km": 35,
        "sustainability_score": 98, "carbon_footprint": 0.1, "organic": False, "rating": 4.8,
        "harvest_date": "2024-01-01", "quantity_kg": 25, "description": "Eco-friendly solar-powered water pump"
    },
    {
        "id": 28, "name": "Greenhouse Kit", "price": 8000, "category": "supplies", 
        "seller": "Green Tech", "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400", "location": "Maharashtra", "distance_km": 30,
        "sustainability_score": 90, "carbon_footprint": 2.0, "organic": False, "rating": 4.4,
        "harvest_date": "2024-01-01", "quantity_kg": 50, "description": "Complete greenhouse setup kit"
    },
    {
        "id": 29, "name": "Organic Mulch", "price": 200, "category": "supplies", 
        "seller": "Eco Farms", "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400", "location": "Kerala", "distance_km": 40,
        "sustainability_score": 95, "carbon_footprint": 0.2, "organic": True, "rating": 4.6,
        "harvest_date": "2024-01-01", "quantity_kg": 25, "description": "Natural organic mulch for soil protection"
    },
    {
        "id": 30, "name": "Weather Station", "price": 3500, "category": "supplies", 
        "seller": "Agri Tech Pro", "image": "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400", "location": "Bangalore", "distance_km": 45,
        "sustainability_score": 88, "carbon_footprint": 0.3, "organic": False, "rating": 4.7,
        "harvest_date": "2024-01-01", "quantity_kg": 2, "description": "Digital weather monitoring station"
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
            {"id": "dairy", "name": "Dairy", "icon": "🥛"},
            {"id": "spices", "name": "Spices", "icon": "🌶️"},
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