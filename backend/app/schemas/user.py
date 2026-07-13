from pydantic import EmailStr

from app.schemas.base import BaseSchema


class UserCreateSchema(BaseSchema):
    phone: str
    name: str
    email: EmailStr


class UserResponseSchema(BaseSchema):
    id: str
    name: str
    email: str
    is_active: bool


__all__ = ["UserCreateSchema", "UserResponseSchema"]
