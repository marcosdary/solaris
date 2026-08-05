from typing import Optional
from datetime import datetime

from app.schemas.base import BaseSchema

class UserCreateSchema(BaseSchema):
    google_sub: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    name: str
    password: str


class UserUpdateSchema(BaseSchema):
    google_sub: Optional[str] = None
    email: Optional[str] = None
    name: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None


class UserResponseSchema(BaseSchema):
    name: str
    email: Optional[str]
    phone: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: datetime


__all__ = ["UserCreateSchema", "UserUpdateSchema", "UserResponseSchema"]
