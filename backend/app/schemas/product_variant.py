from decimal import Decimal
from typing import Optional
from pydantic import BaseModel

class ProductVariantBase(BaseModel):
    size: Optional[str] = None
    color: Optional[str] = None
    color_code: Optional[str] = None
    sku: Optional[str] = None
    additional_price: Decimal = Decimal("0.0")
    stock_quantity: int = 0
    is_active: bool = True

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariantUpdate(BaseModel):
    size: Optional[str] = None
    color: Optional[str] = None
    color_code: Optional[str] = None
    sku: Optional[str] = None
    additional_price: Optional[Decimal] = None
    stock_quantity: Optional[int] = None
    is_active: Optional[bool] = None

class ProductVariantResponse(ProductVariantBase):
    id: int
    product_id: int

    class Config:
        from_attributes = True
