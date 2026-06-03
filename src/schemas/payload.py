from pydantic import Field
from typing import Annotated, Optional
from datetime import datetime 

from src.config import Dir, FileDocx
from src.schemas.base import BaseSchema

class PayloadSchema(BaseSchema):
    filename: Annotated[
        str, 
        Field(
            default=f"cv_{datetime.now().timestamp()}",
            frozen=True
        )
    ]
    cv: FileDocx
    dirname: Dir
    info: str
    save_google_drive: Annotated[Optional[bool], Field(default=False)]
    pdf: Annotated[Optional[bool], Field(default=False)]
