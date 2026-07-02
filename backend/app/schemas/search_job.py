from typing import Annotated, Optional, List
from pydantic import BeforeValidator, Field, RootModel

from app.schemas.base import BaseSchema
from app.schemas.site import ResponseSiteSchema
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

class SearchJobSite(BaseSchema):
    site: ResponseSiteSchema

class ResponseSearchJobSchema(BaseSchema):
    id: str
    search: str
    location: str
    country_indeed: Optional[str]
    pages: int
    hours_publi: int
    is_remote: Optional[bool]
    job_type: Optional[str]
    linkedin_fetch_description: bool

    sites: List[ResponseSiteSchema]


class ListSearchJobSchema(RootModel[List[ResponseSearchJobSchema]]):
    pass 

__all__ = [
    "InsertDBSearchJobSchema",
    "RequestSearchJobSchema",
    "ResponseSearchJobSchema",
    "ListSearchJobSchema",
    "SearchJobSite"
]