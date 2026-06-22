from typing import Annotated, Optional, List
from pydantic import BeforeValidator, Field

from app.schemas.base import BaseSchema

from app.schemas.validators import Validators

class InsertDBSearchJobSchema(BaseSchema):
    search: str
    location: Annotated[str, Field(default="Brazil")]
    country_indeed: Annotated[str, Field(default="Brazil")]
    pages: Annotated[int, BeforeValidator(Validators.validate_number), Field(default=2)]
    hours_publi: Annotated[int, BeforeValidator(Validators.validate_number), Field(default=24)]
    is_remote: Annotated[Optional[bool], Field(default=False)]
    job_type: Annotated[Optional[str], Field(default="fulltime")]
    linkedin_fetch_description: Annotated[Optional[bool], Field(default=False)]

    sites: List[str]