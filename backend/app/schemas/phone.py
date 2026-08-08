from pydantic import Field
from typing import Annotated

from app.schemas.base import BaseSchema

class PhoneCreateSchema(BaseSchema):
    ddi: Annotated[str, Field(min_length=1)]
    number: Annotated[str, Field(min_length=1)]

class PhoneEditSchema(BaseSchema):
    ddi: Annotated[str, Field(min_length=1)]
    number: Annotated[str, Field(min_length=1)]

class PhoneSchemaResponse(BaseSchema):
    id: Annotated[str, Field(min_length=1)]
    ddi: Annotated[str, Field(min_length=1)]
    number: Annotated[str, Field(min_length=1)]


__all__ = [
    "PhoneCreateSchema",
    "PhoneEditSchema",
    "PhoneSchemaResponse"
]
