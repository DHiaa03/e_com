"""
Placeholder router for Comments & Product Reviews.
According to the specification:
"routers/comments.py و schemas/comment.py يُتركان كملفات فارغة/placeholder فقط (بدون منطق فعلي) تمهيداً لإضافتها لاحقاً، ولا تُستهلك من الفرونت في هذه المرحلة."
"""
from fastapi import APIRouter

router = APIRouter(prefix="/comments", tags=["Comments (Placeholder - Phase 2)"])

@router.get("", summary="Comments Placeholder Endpoint")
def comments_placeholder():
    """Reserved for future reviews & comments release."""
    return {"status": "placeholder", "message": "Comments feature will be enabled in Phase 2"}
