import os
import uuid
import aiofiles
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.models.product import Product
from app.models.product_image import ProductImage
from app.schemas.product_image import ProductImageResponse
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/images", tags=["Images & Uploads"])

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}

@router.post("/products/{product_id}", response_model=ProductImageResponse, status_code=status.HTTP_201_CREATED, summary="Upload Product Image (Admin)")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    is_primary: bool = Form(False),
    alt_text: str = Form(None),
    sort_order: int = Form(0),
    db: Session = Depends(get_db),
    _admin = Depends(get_current_admin)
):
    """
    Upload and attach an image file for a product.
    Saves image into static/uploads/products/ directory.
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed: {', '.join(ALLOWED_EXTENSIONS)}"
        )

    # Destination directory
    target_dir = os.path.join(settings.UPLOAD_DIR, "products")
    os.makedirs(target_dir, exist_ok=True)

    filename = f"prod_{product_id}_{uuid.uuid4().hex[:8]}{ext}"
    filepath = os.path.join(target_dir, filename)

    async with aiofiles.open(filepath, "wb") as out_file:
        content = await file.read()
        await out_file.write(content)

    # Relative URL served by static mount
    image_url = f"/static/uploads/products/{filename}"

    # If is_primary, unset any existing primary image for this product
    if is_primary:
        db.query(ProductImage).filter(ProductImage.product_id == product_id).update({"is_primary": False})

    new_img = ProductImage(
        product_id=product_id,
        image_url=image_url,
        is_primary=is_primary,
        alt_text=alt_text or product.name_ar,
        sort_order=sort_order
    )
    db.add(new_img)
    db.commit()
    db.refresh(new_img)
    return new_img

@router.delete("/{image_id}", summary="Delete Image (Admin)")
def delete_image(
    image_id: int,
    db: Session = Depends(get_db),
    _admin = Depends(get_current_admin)
):
    """Delete image from database and local storage (Admin only)."""
    img = db.query(ProductImage).filter(ProductImage.id == image_id).first()
    if not img:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Image not found")

    # Try removing file from disk
    if img.image_url.startswith("/static/uploads/"):
        relative_path = img.image_url.replace("/static/uploads/", "")
        disk_path = os.path.join(settings.UPLOAD_DIR, relative_path.replace("/", os.sep))
        if os.path.exists(disk_path):
            try:
                os.remove(disk_path)
            except OSError:
                pass

    db.delete(img)
    db.commit()
    return {"message": "Image deleted successfully"}
