from datetime import datetime

from app.schemas.base import BaseSchema

class ResponseSiteSchema(BaseSchema):
    id: str 
    name: str

    created_at: datetime
    updated_at: datetime
    




