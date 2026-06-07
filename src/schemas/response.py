from typing import Annotated
from pydantic import Field, AliasChoices, BeforeValidator

from src.schemas.base import BaseSchema
from src.schemas.validators import Validators
class ResponseSchema(BaseSchema):
    id: Annotated[str, Field(alias=AliasChoices("id"))]
    name: Annotated[str, BeforeValidator(Validators.validate_string), Field(alias=AliasChoices("name"))]
    mimetype: Annotated[str, BeforeValidator(Validators.validate_mimetype), Field(alias=AliasChoices("mimeType"))]
    size: Annotated[int, Field(alias=AliasChoices("size"))]
    web_view_link: Annotated[str, BeforeValidator(Validators.validate_string), Field(alias=AliasChoices("webViewLink"))]