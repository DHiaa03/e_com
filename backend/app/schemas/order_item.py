from decimal import Decimal
from typing import Optional
from pydantic import BaseModel

class OrderItemCreate(BaseModel):
    product_id: int
    variant_id: Optional[int] = None
    quantity: int = 1

class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    variant_id: Optional[int] = None
    product_name: str
    variant_details: Optional[str] = None
    price: Decimal
    quantity: int
    subtotal: Decimal

    class Config:
        from_attributes = True
