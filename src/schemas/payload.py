from pydantic import Field
from typing import Annotated, Optional

from uuid import uuid4
from src.config import Dir, FileDocx
from src.schemas.base import BaseSchema

class PayloadSchema(BaseSchema):
    filename: Annotated[
        str, 
        Field(
            default=f"cv_{uuid4().hex}",
            frozen=True
        )
    ]
    cv: FileDocx
    dirname: Dir
    info: str
    pdf: Annotated[Optional[bool], Field(default=False)]
