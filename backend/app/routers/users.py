from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_password_hash, verify_password
from app.models.user import User
from app.schemas.user import AdminUserResponse
from app.routers.auth import get_current_admin
from pydantic import BaseModel

router = APIRouter(prefix="/users", tags=["Users (Admin Profile Only)"])

class PasswordChangeRequest(BaseModel):
    old_password: str
    new_password: str

@router.get("/admin", response_model=AdminUserResponse, summary="View Admin Profile")
def get_admin_profile(current_admin: User = Depends(get_current_admin)):
    """Return admin profile."""
    return current_admin

@router.put("/admin/password", summary="Change Admin Password")
def update_admin_password(
    data: PasswordChangeRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Update admin password securely."""
    if not verify_password(data.old_password, current_admin.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect old password"
        )
    current_admin.hashed_password = get_password_hash(data.new_password)
    db.commit()
    return {"message": "Admin password updated successfully"}
