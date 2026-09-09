import uuid
from decimal import Decimal
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, func
from app.core.database import get_db
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.schemas.order import (
    GuestOrderCreate,
    OrderStatusUpdate,
    OrderResponse,
    OrderListResponse,
    OrderStatsResponse
)
from app.core.email import send_order_notification_email
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/orders", tags=["Orders & Guest Checkout"])

def generate_order_number() -> str:
    """Generate clean readable order number like BE-2026-98124."""
    random_part = uuid.uuid4().hex[:6].upper()
    return f"BE-{random_part}"

@router.post("", response_model=OrderResponse, status_code=status.HTTP_201_CREATED, summary="Create Order (Guest Checkout)")
def create_guest_order(
    order_in: GuestOrderCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Public Guest Checkout:
    Accepts customer name, phone, address, and items without requiring an account.
    Calculates prices server-side, records order with status 'pending' and COD,
    and schedules background email notification to store owner.
    """
    if not order_in.items:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Order must contain at least one item"
        )

    # Calculate totals and build order items
    subtotal = Decimal("0.0")
    order_items_to_create = []

    for item_in in order_in.items:
        product = db.query(Product).filter(Product.id == item_in.product_id, Product.is_active == True).first()
        if not product:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Product with ID {item_in.product_id} not found or inactive"
            )

        # Base item price (check sale price)
        item_price = product.discount_price if (product.is_on_sale and product.discount_price) else product.base_price

        variant_details = None
        if item_in.variant_id:
            variant = db.query(ProductVariant).filter(
                ProductVariant.id == item_in.variant_id,
                ProductVariant.product_id == product.id
            ).first()
            if not variant:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Variant {item_in.variant_id} does not exist for product {product.name_en}"
                )
            if variant.additional_price:
                item_price += variant.additional_price
            
            # Form variant label
            details = []
            if variant.size:
                details.append(f"Size: {variant.size}")
            if variant.color:
                details.append(f"Color: {variant.color}")
            variant_details = " | ".join(details)

            # Reduce stock if available
            if variant.stock_quantity is not None and variant.stock_quantity >= item_in.quantity:
                variant.stock_quantity -= item_in.quantity

        line_subtotal = item_price * item_in.quantity
        subtotal += line_subtotal

        order_items_to_create.append({
            "product_id": product.id,
            "variant_id": item_in.variant_id,
            "product_name": product.name_ar or product.name_en,
            "variant_details": variant_details,
            "price": item_price,
            "quantity": item_in.quantity,
            "subtotal": line_subtotal
        })

    shipping_fee = Decimal("0.0") # Free delivery in current phase or configurable
    total_amount = subtotal + shipping_fee

    order = Order(
        order_number=generate_order_number(),
        customer_name=order_in.customer_name,
        phone=order_in.phone,
        email=order_in.email,
        address=order_in.address,
        city=order_in.city,
        notes=order_in.notes,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        total_amount=total_amount,
        status="pending",
        payment_method="cash_on_delivery"
    )
    db.add(order)
    db.flush()

    for item_data in order_items_to_create:
        item = OrderItem(order_id=order.id, **item_data)
        db.add(item)

    db.commit()
    db.refresh(order)

    # Schedule SMTP email notification
    email_payload = {
        "order_number": order.order_number,
        "customer_name": order.customer_name,
        "phone": order.phone,
        "address": order.address,
        "city": order.city,
        "notes": order.notes,
        "total_amount": str(order.total_amount),
        "created_at": order.created_at.strftime("%Y-%m-%d %H:%M"),
        "items": [
            {
                "product_name": it.product_name,
                "variant_details": it.variant_details,
                "quantity": it.quantity,
                "subtotal": str(it.subtotal)
            } for it in order.items
        ]
    }
    background_tasks.add_task(send_order_notification_email, email_payload)

    return order

@router.get("", response_model=OrderListResponse, summary="List Orders (Admin Only)")
def list_orders(
    status_filter: Optional[str] = Query(None, description="Filter by status: pending, confirmed, shipped, delivered, cancelled"),
    search: Optional[str] = Query(None, description="Search by customer name, phone, or order number"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    _admin = Depends(get_current_admin)
):
    """List orders with pagination and filtering (Admin only)."""
    query = db.query(Order)

    if status_filter:
        query = query.filter(Order.status == status_filter)

    if search:
        pattern = f"%{search}%"
        query = query.filter(
            (Order.customer_name.ilike(pattern)) |
            (Order.phone.ilike(pattern)) |
            (Order.order_number.ilike(pattern))
        )

    total = query.count()
    offset = (page - 1) * limit
    orders = query.order_by(desc(Order.created_at)).offset(offset).limit(limit).all()

    return {
        "items": orders,
        "total": total,
        "page": page,
        "limit": limit
    }

@router.get("/stats/summary", response_model=OrderStatsResponse, summary="Admin Orders Statistics")
def get_order_stats(
    db: Session = Depends(get_db),
    _admin = Depends(get_current_admin)
):
    """Retrieve summarized store metrics for the admin dashboard."""
    total_orders = db.query(Order).count()
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    delivered_orders = db.query(Order).filter(Order.status == "delivered").count()
    
    revenue_query = db.query(func.sum(Order.total_amount)).filter(Order.status != "cancelled").scalar()
    total_revenue = Decimal(str(revenue_query)) if revenue_query else Decimal("0.0")

    return {
        "total_orders": total_orders,
        "total_revenue": total_revenue,
        "pending_orders": pending_orders,
        "delivered_orders": delivered_orders
    }

@router.get("/{id_or_number}", response_model=OrderResponse, summary="Get Order Details")
def get_order(
    id_or_number: str,
    db: Session = Depends(get_db)
):
    """
    Retrieve order details by order_number or ID.
    Allows customers to view their order status via their order number.
    """
    if id_or_number.isdigit():
        order = db.query(Order).filter(Order.id == int(id_or_number)).first()
    else:
        order = db.query(Order).filter(Order.order_number == id_or_number).first()

    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    return order

@router.patch("/{order_id}/status", response_model=OrderResponse, summary="Update Order Status (Admin)")
def update_order_status(
    order_id: int,
    status_in: OrderStatusUpdate,
    db: Session = Depends(get_db),
    _admin = Depends(get_current_admin)
):
    """Update order status (pending, confirmed, shipped, delivered, cancelled) (Admin only)."""
    valid_statuses = {"pending", "confirmed", "shipped", "delivered", "cancelled"}
    if status_in.status not in valid_statuses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status '{status_in.status}'. Valid choices: {', '.join(valid_statuses)}"
        )

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    order.status = status_in.status
    db.commit()
    db.refresh(order)
    return order
