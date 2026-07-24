from pydantic import Field
from typing import Annotated
from app.schemas.base import BaseSchema

class LoginRequestSchema(BaseSchema):
    phone: Annotated[str, Field(min_length=1)]
    password: Annotated[str, Field(min_length=1)]

class PasswordForgotSchema(BaseSchema):
    phone: Annotated[str, Field(min_length=1)]

class PasswordResetSchema(BaseSchema):
    password: Annotated[str, Field(min_length=1)]
    token: Annotated[str, Field(min_length=1)]
class TokenResponseSchema(BaseSchema):
    access_token: str
    token_type: Annotated[str, Field(default="bearer")]
    expires_in: int

__all__ = [
    "LoginRequestSchema", 
    "TokenResponseSchema",
    "PasswordResetSchema"
]
