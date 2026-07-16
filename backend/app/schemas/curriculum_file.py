from datetime import datetime
from typing import Optional
from pydantic import Field
from typing import Annotated

from app.schemas.base import BaseSchema


class CurriculumFileCreateSchema(BaseSchema):
    curriculum_id: Annotated[str, Field(min_length=1)]
    name: Annotated[str, Field(min_length=1)]
    mimetype: Annotated[str, Field(min_length=1)]
    url: Annotated[str, Field(min_length=1)]
    template: Optional[str] = None

class CurriculumFileResponseSchema(CurriculumFileCreateSchema):
    id: str
    created_at: datetime
    updated_at: datetime


class DownloadCurriculumResponseSchema(BaseSchema):
    url: str
    name: str
    mimetype: str
    expires_in_seconds: int = 3600
    created_at: Annotated[str, Field(default_factory=lambda: datetime.now().isoformat())]


__all__ = [
    "CurriculumFileCreateSchema",
    "CurriculumFileResponseSchema",
    "DownloadCurriculumResponseSchema",
]
