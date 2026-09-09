from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/categories", tags=["Categories (Hierarchical)"])

@router.get("", response_model=List[CategoryResponse], summary="List Categories Hierarchy")
def get_categories(
    root_only: bool = True,
    db: Session = Depends(get_db)
):
    """
    List categories. By default returns root categories with their subcategories pre-populated.
    Supports Arabic and English names.
    """
    query = db.query(Category).filter(Category.is_active == True)
    if root_only:
        query = query.filter(Category.parent_id == None)
    return query.all()

@router.get("/{id_or_slug}", response_model=CategoryResponse, summary="Get Category by ID or Slug")
def get_category(id_or_slug: str, db: Session = Depends(get_db)):
    """Retrieve single category with subcategories."""
    if id_or_slug.isdigit():
        category = db.query(Category).filter(Category.id == int(id_or_slug)).first()
    else:
        category = db.query(Category).filter(Category.slug == id_or_slug).first()

    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return category

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED, summary="Create Category (Admin)")
def create_category(
    category_in: CategoryCreate,
    db: Session = Depends(get_db),
    _admin = Depends(get_current_admin)
):
    """Create category or subcategory (Admin only)."""
    # Check duplicate slug
    existing = db.query(Category).filter(Category.slug == category_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Category with slug '{category_in.slug}' already exists"
        )

    # If parent_id provided, verify it exists
    if category_in.parent_id:
        parent = db.query(Category).filter(Category.id == category_in.parent_id).first()
        if not parent:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Parent category does not exist"
            )

    new_cat = Category(**category_in.model_dump())
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@router.put("/{category_id}", response_model=CategoryResponse, summary="Update Category (Admin)")
def update_category(
    category_id: int,
    category_in: CategoryUpdate,
    db: Session = Depends(get_db),
    _admin = Depends(get_current_admin)
):
    """Update category details (Admin only)."""
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    update_data = category_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(cat, field, val)

    db.commit()
    db.refresh(cat)
    return cat

@router.delete("/{category_id}", summary="Delete Category (Admin)")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
    _admin = Depends(get_current_admin)
):
    """Delete category (Admin only)."""
    cat = db.query(Category).filter(Category.id == category_id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    db.delete(cat)
    db.commit()
    return {"message": "Category deleted successfully"}
