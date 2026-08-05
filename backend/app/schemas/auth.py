from pydantic import Field, ConfigDict, BaseModel
from typing import Annotated
from app.schemas.base import BaseSchema

class LoginRequestSchema(BaseSchema):
    phone: Annotated[str, Field(min_length=1)]
    password: Annotated[str, Field(min_length=1)]

class WhatsappLoginRequestSchema(BaseSchema):
    phone: Annotated[str, Field(min_length=1)]

class LoginGoogleRequestSchema(BaseSchema):
    credential: Annotated[str, Field(min_length=1)]

class ConnectAccountGoogleRequestSchema(BaseSchema):
    access_token: Annotated[str, Field(min_length=1)]

class PasswordForgotSchema(BaseSchema):
    phone: Annotated[str, Field(min_length=1)]

class PasswordResetSchema(BaseSchema):
    password: Annotated[str, Field(min_length=1)]
    token: Annotated[str, Field(min_length=1)]
class TokenResponseSchema(BaseSchema):
    access_token: str
    token_type: Annotated[str, Field(default="bearer")]
    expires_in: int

class GoogleUserInfoSchema(BaseModel):
    sub: str
    email: str
    name: str

    model_config = ConfigDict(from_attributes=True)

__all__ = [
    "LoginRequestSchema", 
    "TokenResponseSchema",
    "PasswordResetSchema",
    "WhatsappLoginRequestSchema",
    "LoginGoogleRequestSchema",
    "GoogleUserInfoSchema",
    "ConnectAccountGoogleRequestSchema"
]
