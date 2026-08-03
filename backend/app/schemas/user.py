from typing import Optional
from datetime import datetime

from app.schemas.base import BaseSchema

class UserCreateSchema(BaseSchema):
    phone: str
    name: str
    password: str


class UserUpdateSchema(BaseSchema):
    name: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None


class UserResponseSchema(BaseSchema):
    name: str
    phone: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


__all__ = ["UserCreateSchema", "UserUpdateSchema", "UserResponseSchema"]
