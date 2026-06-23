from typing import Union, List
from datetime import datetime

from app.schemas.base import BaseSchema
from app.schemas.sites import ResponseSiteSchema

class ResponseDBJobSchema(BaseSchema):
    id: str 
    job_url : str 
    title: str
    company: str 
    location: str 
    job_level: Union[str, float, None] 
    job_function: Union[str, float, None] 
    description: str 
    company_url: str 

    created_at: datetime
    updated_at: datetime


    site: ResponseSiteSchema




    