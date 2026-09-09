from datetime import datetime
from decimal import Decimal
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from app.schemas.order_item import OrderItemCreate, OrderItemResponse

class GuestOrderCreate(BaseModel):
    customer_name: str
    phone: str
    email: Optional[EmailStr] = None
    address: str
    city: Optional[str] = None
    notes: Optional[str] = None
    items: List[OrderItemCreate]

class OrderStatusUpdate(BaseModel):
    status: str # 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'

class OrderResponse(BaseModel):
    id: int
    order_number: str
    customer_name: str
    phone: str
    email: Optional[str] = None
    address: str
    city: Optional[str] = None
    notes: Optional[str] = None
    subtotal: Decimal
    shipping_fee: Decimal
    total_amount: Decimal
    status: str
    payment_method: str
    created_at: datetime
    updated_at: datetime
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class OrderListResponse(BaseModel):
    items: List[OrderResponse]
    total: int
    page: int
    limit: int

class OrderStatsResponse(BaseModel):
    total_orders: int
    total_revenue: Decimal
    pending_orders: int
    delivered_orders: int
