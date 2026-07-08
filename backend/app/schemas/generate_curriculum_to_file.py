from pydantic import Field
from typing import Annotated

from datetime import datetime
from app.schemas.base import BaseSchema


class GenerateCurriculumToFileSchema(BaseSchema):
    name: str
    created_at: Annotated[str, Field(default_factory=lambda: datetime.now().isoformat())]

__all__ = [
    "GenerateCurriculumToFileSchema"
]