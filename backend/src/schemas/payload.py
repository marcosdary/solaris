from pydantic import Field, BeforeValidator
from typing import Annotated, Optional

from datetime import datetime
from src.config import FileDocx
from src.schemas.base import BaseSchema
from src.schemas.validators import Validators

def default_filename() -> str:
    return f"cv_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"

class PayloadSchema(BaseSchema):
    filename: Annotated[
        str, 
        Field(
            default_factory=default_filename,
            frozen=True
        )
    ]
    cv: Annotated[FileDocx, BeforeValidator(Validators.validate_cv)]
    info: Annotated[str, BeforeValidator(Validators.validate_string)]
    pdf: Annotated[Optional[bool], Field(default=False)]
    
