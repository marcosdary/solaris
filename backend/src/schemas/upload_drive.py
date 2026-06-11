from typing import Optional, Annotated 
from pydantic import Field

from src.schemas.base import BaseSchema
from src.config import MimeTypes, Dir


class UploadDriveSchema(BaseSchema):
    filepath: str
    mimetype: Annotated[MimeTypes, Field(default=MimeTypes.pdf.value)]
    dirname: Annotated[Dir, Field(default=Dir.portuguese.value)]
    