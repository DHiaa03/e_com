from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class CategoryBase(BaseModel):
    name_ar: str
    name_en: str
    slug: str
    description_ar: Optional[str] = None
    description_en: Optional[str] = None
    parent_id: Optional[int] = None
    is_active: bool = True

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name_ar: Optional[str] = None
    name_en: Optional[str] = None
    slug: Optional[str] = None
    description_ar: Optional[str] = None
    description_en: Optional[str] = None
    parent_id: Optional[int] = None
    is_active: Optional[bool] = None

class CategorySubResponse(BaseModel):
    id: int
    name_ar: str
    name_en: str
    slug: str
    parent_id: Optional[int] = None
    is_active: bool

    class Config:
        from_attributes = True

class CategoryResponse(CategoryBase):
    id: int
    created_at: datetime
    subcategories: List[CategorySubResponse] = []

    class Config:
        from_attributes = True
