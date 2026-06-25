from typing import Optional, List

from app.schemas.base import BaseSchema
from app.schemas import ResponseSiteSchema

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

