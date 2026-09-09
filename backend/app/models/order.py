from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, DateTime, Text, Numeric
from sqlalchemy.orm import relationship
from app.core.database import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    order_number = Column(String(50), unique=True, index=True, nullable=False)
    
    # Guest Checkout Details (No customer account required)
    customer_name = Column(String(200), nullable=False)
    phone = Column(String(50), nullable=False, index=True)
    email = Column(String(200), nullable=True)
    address = Column(Text, nullable=False)
    city = Column(String(100), nullable=True)
    notes = Column(Text, nullable=True)

    # Order Financials
    subtotal = Column(Numeric(10, 2), nullable=False, default=0.0)
    shipping_fee = Column(Numeric(10, 2), nullable=False, default=0.0)
    total_amount = Column(Numeric(10, 2), nullable=False, default=0.0)

    # Status & Payment
    status = Column(String(50), nullable=False, default="pending", index=True)  # pending, confirmed, shipped, delivered, cancelled
    payment_method = Column(String(50), nullable=False, default="cash_on_delivery") # expandable

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
