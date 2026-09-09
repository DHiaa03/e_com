from decimal import Decimal
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc
from app.core.database import get_db
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.models.product_image import ProductImage
from app.models.category import Category
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
    ProductListResponse
)
from app.schemas.product_variant import (
    ProductVariantCreate,
    ProductVariantUpdate,
    ProductVariantResponse
)
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/products", tags=["Products & Variants"])

@router.get("", response_model=ProductListResponse, summary="List and Filter Products")
def list_products(
    gender_section: Optional[str] = Query(None, description="Filter by section: 'men', 'women', 'unisex'"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    search: Optional[str] = Query(None, description="Search term in name or description (AR/EN)"),
    min_price: Optional[Decimal] = Query(None, description="Minimum price"),
    max_price: Optional[Decimal] = Query(None, description="Maximum price"),
    is_on_sale: Optional[bool] = Query(None, description="Filter discounted products"),
    is_featured: Optional[bool] = Query(None, description="Filter featured products"),
    sort_by: Optional[str] = Query("newest", description="Sorting: 'newest', 'price_asc', 'price_desc'"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """
    Search and filter products for customers and admin.
    Returns paginated product list with images, variants, and category.
    """
    query = db.query(Product).filter(Product.is_active == True)

    if gender_section:
        query = query.filter(Product.gender_section == gender_section.lower())

    if category_id:
        # Also include subcategories of this category if any
        sub_cat_ids = [c.id for c in db.query(Category.id).filter(Category.parent_id == category_id).all()]
        category_ids = [category_id] + sub_cat_ids
        query = query.filter(Product.category_id.in_(category_ids))

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Product.name_ar.ilike(search_pattern),
                Product.name_en.ilike(search_pattern),
                Product.description_ar.ilike(search_pattern),
                Product.description_en.ilike(search_pattern)
            )
        )

    if min_price is not None:
        query = query.filter(Product.base_price >= min_price)
    if max_price is not None:
        query = query.filter(Product.base_price <= max_price)

    if is_on_sale is not None:
        query = query.filter(Product.is_on_sale == is_on_sale)

    if is_featured is not None:
        query = query.filter(Product.is_featured == is_featured)

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(asc(Product.base_price))
    elif sort_by == "price_desc":
        query = query.order_by(desc(Product.base_price))
    else: # newest
        query = query.order_by(desc(Product.created_at))

    total = query.count()
    offset = (page - 1) * limit
    items = query.offset(offset).limit(limit).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit
    }

@router.get("/{id_or_slug}", response_model=ProductResponse, summary="Get Product Details")
def get_product(id_or_slug: str, db: Session = Depends(get_db)):
    """Retrieve full product details by id or slug."""
    if id_or_slug.isdigit():
        product = db.query(Product).filter(Product.id == int(id_or_slug)).first()
    else:
        product = db.query(Product).filter(Product.slug == id_or_slug).first()

    if not product or not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found"
        )
    return product

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED, summary="Create Product (Admin)")
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db),
    _admin = Depends(get_current_admin)
):
    """Create new product with optional initial variants and images (Admin only)."""
    # Check category
    category = db.query(Category).filter(Category.id == product_in.category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Category not found")

    # Check slug
    existing = db.query(Product).filter(Product.slug == product_in.slug).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Product slug '{product_in.slug}' already exists")

    product_data = product_in.model_dump(exclude={"variants", "images"})
    product = Product(**product_data)
    db.add(product)
    db.flush()

    # Add variants
    if product_in.variants:
        for v in product_in.variants:
            variant = ProductVariant(product_id=product.id, **v.model_dump())
            db.add(variant)

    # Add images
    if product_in.images:
        for img in product_in.images:
            image = ProductImage(product_id=product.id, **img.model_dump())
            db.add(image)

    db.commit()
    db.refresh(product)
    return product

@router.put("/{product_id}", response_model=ProductResponse, summary="Update Product (Admin)")
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db),
    _admin = Depends(get_current_admin)
):
    """Update product information (Admin only)."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    update_data = product_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(product, field, val)

    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}", summary="Delete Product (Admin)")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    _admin = Depends(get_current_admin)
):
    """Delete product and its variants/images (Admin only)."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

# --- Variant Endpoints ---

@router.post("/{product_id}/variants", response_model=ProductVariantResponse, status_code=status.HTTP_201_CREATED, summary="Add Product Variant (Admin)")
def add_product_variant(
    product_id: int,
    variant_in: ProductVariantCreate,
    db: Session = Depends(get_db),
    _admin = Depends(get_current_admin)
):
    """Add a new size/color variant to an existing product (Admin only)."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    variant = ProductVariant(product_id=product_id, **variant_in.model_dump())
    db.add(variant)
    db.commit()
    db.refresh(variant)
    return variant

@router.put("/variants/{variant_id}", response_model=ProductVariantResponse, summary="Update Variant (Admin)")
def update_variant(
    variant_id: int,
    variant_in: ProductVariantUpdate,
    db: Session = Depends(get_db),
    _admin = Depends(get_current_admin)
):
    """Update variant stock, price, or details (Admin only)."""
    variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not variant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Variant not found")

    update_data = variant_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(variant, field, val)

    db.commit()
    db.refresh(variant)
    return variant

@router.delete("/variants/{variant_id}", summary="Delete Variant (Admin)")
def delete_variant(
    variant_id: int,
    db: Session = Depends(get_db),
    _admin = Depends(get_current_admin)
):
    """Delete variant (Admin only)."""
    variant = db.query(ProductVariant).filter(ProductVariant.id == variant_id).first()
    if not variant:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Variant not found")

    db.delete(variant)
    db.commit()
    return {"message": "Variant deleted successfully"}
