from typing import Union, Optional, List
from datetime import datetime
from pydantic import RootModel

from app.schemas.base import BaseSchema
from app.schemas.site import ResponseSiteSchema

class InsertDBJobSchema(BaseSchema):
    id: str 
    site_id: str
    site: str
    job_url : str 
    title: str
    company: str 
    location: str 
    job_level: Union[str, float, None] 
    job_function: Union[str, float, None] 
    description: str 
    company_url: str 
    
class ResponseJobSchema(BaseSchema):
    id: str 
    site: str
    job_url : str 
    title: str
    company: Optional[str] = None
    location: str 
    job_level: Union[str, float, None] 
    job_function: Union[str, float, None] 
    description: str 
    company_url: Optional[str] = None

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

class ListJobSchema(RootModel[List[ResponseJobSchema]]):
    pass 

__all__ = [
    "InsertDBJobSchema",
    "ResponseJobSchema",
    "ResponseDBJobSchema",
    "ListJobSchema"
]