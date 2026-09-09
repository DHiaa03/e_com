"""
Placeholder schema for Comments / Reviews.
According to the specification:
"routers/comments.py و schemas/comment.py يُتركان كملفات فارغة/placeholder فقط (بدون منطق فعلي) تمهيداً لإضافتها لاحقاً".
"""
from typing import Optional
from pydantic import BaseModel

class CommentPlaceholder(BaseModel):
    id: Optional[int] = None
    content: Optional[str] = None
