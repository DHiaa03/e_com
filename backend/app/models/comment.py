"""
Placeholder model for Comments / Reviews.
According to the specification:
"التقييمات/التعليقات — ملغاة في هذه المرحلة. تُترك كملفات placeholder فقط بدون منطق فعلي تمهيداً لإضافتها لاحقاً."
"""
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.core.database import Base

class Comment(Base):
    __tablename__ = "comments_placeholder"

    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=True)
