from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class CropBase(BaseModel):
    name: str
    variety: Optional[str] = None
    area: float
    planting_date: Optional[datetime] = None
    expected_harvest: Optional[datetime] = None
    status: str = "planted"

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

class FarmerProfile(BaseModel):
    farm_size: Optional[float] = None
    location: Optional[str] = None
    crops: Optional[List[str]] = []
    experience_years: Optional[int] = None
    farming_type: Optional[str] = "traditional"  # traditional, organic, hydroponic