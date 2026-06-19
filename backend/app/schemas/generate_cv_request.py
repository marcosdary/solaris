from pydantic import Field, BeforeValidator
from typing import Annotated, Optional

from datetime import datetime
from app.config import TemplateFile
from app.schemas.base import BaseSchema
from app.schemas.validators import Validators

def default_filename() -> str:
    return f"cv_{datetime.now().strftime('%Y%m%d_%H%M%S_%f')}"

class GenerateCVRequestSchema(BaseSchema):
    cv: Annotated[TemplateFile, BeforeValidator(Validators.validate_cv)]
    info: Annotated[str, BeforeValidator(Validators.validate_string)]
    pdf: Annotated[Optional[bool], Field(default=False)]
    
