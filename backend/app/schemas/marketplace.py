from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str
    quantity_available: Optional[int] = None
    unit: str = "kg"
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    quantity_available: Optional[int] = None

class ProductResponse(ProductBase):
    id: str
    seller_id: str
    seller_name: Optional[str] = None
    created_at: datetime
    is_available: bool = True

class OrderItem(BaseModel):
    product_id: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    items: List[OrderItem]
    delivery_address: str
    phone: str
    notes: Optional[str] = None

class OrderResponse(BaseModel):
    id: str
    buyer_id: str
    items: List[OrderItem]
    total_amount: float
    status: str = "pending"
    delivery_address: str
    phone: str
    created_at: datetime
    estimated_delivery: Optional[datetime] = None