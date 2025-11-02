from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CropBase(BaseModel):
    name: str
    variety: str
    area: float
    planting_date: datetime
    expected_harvest: datetime
    status: str = "growing"

class CropCreate(CropBase):
    pass

class CropUpdate(BaseModel):
    name: Optional[str] = None
    variety: Optional[str] = None
    area: Optional[float] = None
    status: Optional[str] = None

class CropResponse(CropBase):
    id: str
    farmer_id: str
    created_at: datetime