from typing import Annotated, List, Optional
from pydantic import BeforeValidator, Field

from app.schemas.base import BaseSchema

from app.schemas.validators import Validators

class RequestSearchJobSchema(BaseSchema):
    search: str
    sites: List[str]
    location: Annotated[str, Field(default="Brazil")]
    country_indeed: Annotated[Optional[str], Field(default=None)]
    pages: Annotated[int, BeforeValidator(Validators.validate_number), Field(default=2)]
    hours_publi: Annotated[int, BeforeValidator(Validators.validate_number), Field(default=24)]
    is_remote: Annotated[Optional[bool], Field(default=False)]
    job_type: Annotated[Optional[str], Field(default="fulltime")]
    linkedin_fetch_description: Annotated[Optional[bool], Field(default=False)]

    