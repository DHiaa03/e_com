from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class ProductImageBase(BaseModel):
    image_url: str
    is_primary: bool = False
    alt_text: Optional[str] = None
    sort_order: int = 0

class ProductImageCreate(ProductImageBase):
    pass

class ProductImageResponse(ProductImageBase):
    id: int
    product_id: int
    created_at: datetime

    class Config:
        from_attributes = True
