from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from app.core.database import Base

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    size = Column(String(50), nullable=True)         # S, M, L, XL, 42, 44...
    color = Column(String(50), nullable=True)        # Black, Navy, Charcoal...
    color_code = Column(String(20), nullable=True)   # #000000, #1a1a1a...
    sku = Column(String(100), unique=True, index=True, nullable=True)
    additional_price = Column(Numeric(10, 2), default=0.0)
    stock_quantity = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

    product = relationship("Product", back_populates="variants")
    order_items = relationship("OrderItem", back_populates="variant")
