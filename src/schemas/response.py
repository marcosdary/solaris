from typing import Optional, Annotated
from pydantic import Field

from src.schemas.base import BaseSchema

class ResponseSchema(BaseSchema):
    dist_path: str
    id_google_drive: Annotated[Optional[str], Field(default=None)]
    