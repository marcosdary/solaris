from pydantic import Field, BeforeValidator
from typing import Annotated, Optional

from datetime import datetime
from src.config import Dir, FileDocx
from src.schemas.base import BaseSchema
from src.schemas.validators import Validators

class PayloadSchema(BaseSchema):
    filename: Annotated[
        str, 
        Field(
            default=f"cv_{datetime.now().timestamp()}",
            frozen=True
        )
    ]
    cv: Annotated[FileDocx, BeforeValidator(Validators.validate_cv)]
    dirname: Annotated[Dir, BeforeValidator(Validators.validate_dir)]
    info: Annotated[str, BeforeValidator(Validators.validate_string)]
    pdf: Annotated[Optional[bool], Field(default=False)]
    
