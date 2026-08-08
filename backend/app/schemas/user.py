from typing import Optional, Annotated
from pydantic import Field
from datetime import datetime

# Schemas
from ..schemas.base import BaseSchema
from ..schemas.phone import (
    PhoneCreateSchema,
    PhoneEditSchema,
    PhoneSchemaResponse
)

class UserCreateSchema(BaseSchema):
    google_sub: Annotated[Optional[str], Field(default=None)]
    phone: Annotated[Optional[PhoneCreateSchema], Field(default=None)]
    email: str
    name: str
    password: str


class UserUpdateSchema(BaseSchema):
    google_sub: Annotated[Optional[str], Field(default=None)]
    email: Annotated[Optional[str], Field(default=None)]
    name: Annotated[Optional[str], Field(default=None)]
    phone: Annotated[Optional[PhoneEditSchema], Field(default=None)]
    password: Annotated[Optional[str], Field(default=None)]


class UserResponseSchema(BaseSchema):
    name: str
    email: str
    phone: Optional[PhoneSchemaResponse]
    is_active: bool
    created_at: datetime
    updated_at: datetime


__all__ = ["UserCreateSchema", "UserUpdateSchema", "UserResponseSchema"]
