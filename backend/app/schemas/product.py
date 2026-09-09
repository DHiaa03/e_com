from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel
from app.schemas.product_variant import ProductVariantResponse, ProductVariantCreate
from app.schemas.product_image import ProductImageResponse, ProductImageCreate

class ProductBase(BaseModel):
    name_ar: str
    name_en: str
    slug: str
    description_ar: Optional[str] = None
    description_en: Optional[str] = None
    base_price: Decimal
    discount_price: Optional[Decimal] = None
    is_on_sale: bool = False
    is_featured: bool = False
    is_active: bool = True
    gender_section: str = "men" # 'men', 'women', 'unisex'
    category_id: int

class ProductCreate(ProductBase):
    variants: Optional[List[ProductVariantCreate]] = []
    images: Optional[List[ProductImageCreate]] = []

class ProductUpdate(BaseModel):
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    slug: Optional[str] = None
    description_ar: Optional[str] = None
    description_en: Optional[str] = None
    base_price: Optional[Decimal] = None
    discount_price: Optional[Decimal] = None
    is_on_sale: Optional[bool] = None
    is_featured: Optional[bool] = None
    is_active: Optional[bool] = None
    gender_section: Optional[str] = None
    category_id: Optional[int] = None

class SimpleCategoryInfo(BaseModel):
    id: int
    name_ar: str
    name_en: str
    slug: str

    class Config:
        from_attributes = True

class ProductResponse(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    category: Optional[SimpleCategoryInfo] = None
    variants: List[ProductVariantResponse] = []
    images: List[ProductImageResponse] = []

    class Config:
        from_attributes = True

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
