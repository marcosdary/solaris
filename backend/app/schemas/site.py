from datetime import datetime
from pydantic import RootModel
from typing import List

from app.schemas.base import BaseSchema

class AddSiteSchema(BaseSchema):
    name: str

class ResponseSiteSchema(BaseSchema):
    id: str 
    name: str

    created_at: datetime
    updated_at: datetime

class ListSiteSchema(RootModel[List[ResponseSiteSchema]]):
    pass 

__all__ = [
    "AddSiteSchema",
    "ResponseSiteSchema",
    "ListSiteSchema"
]