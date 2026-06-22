from typing import Optional, List

from app.schemas.base import BaseSchema
from app.schemas import ResponseDBSiteSchema

class SearchJobSite(BaseSchema):
    site: ResponseDBSiteSchema

class ResponseSearchJobSchema(BaseSchema):
    id: str
    search: str
    location: str
    country_indeed: str
    pages: int
    hours_publi: int
    is_remote: Optional[bool]
    job_type: Optional[str]
    linkedin_fetch_description: bool

    search_job_sites: List[SearchJobSite]