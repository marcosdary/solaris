from pydantic import Field, BeforeValidator, AliasChoices
from typing import Annotated

from datetime import datetime
from app.schemas.base import BaseSchema
from app.schemas.validators import Validators

def default_filename() -> str:
    return f"cv_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"

class GenerateCVResponseSchema(BaseSchema):
    name: Annotated[str, BeforeValidator(Validators.validate_string), Field(alias=AliasChoices("name"))]
    mimetype: Annotated[str, BeforeValidator(Validators.validate_mimetype), Field(alias=AliasChoices("mimeType", "mimetype"))]

__all__ = [
    "GenerateCVResponseSchema"
]