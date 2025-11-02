from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    category: str
    image_url: Optional[str] = None

class OrderItem(BaseModel):
    product_id: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItem]
    delivery_address: str

class OrderResponse(BaseModel):
    id: str
    user_id: str
    items: List[OrderItem]
    total_amount: float
    status: str = "pending"
    created_at: datetime