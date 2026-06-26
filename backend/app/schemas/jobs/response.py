from typing import Union, Optional
from pydantic import Field

from app.schemas.base import BaseSchema

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


