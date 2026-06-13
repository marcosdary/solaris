from typing import Annotated
from pydantic import Field, AliasChoices, BeforeValidator

from app.schemas.base import BaseSchema
from app.schemas.validators import Validators

class ResponseSchema(BaseSchema):
    name: Annotated[str, BeforeValidator(Validators.validate_string), Field(alias=AliasChoices("name"))]
    mimetype: Annotated[str, BeforeValidator(Validators.validate_mimetype), Field(alias=AliasChoices("mimeType"))]