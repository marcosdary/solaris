from src.schemas.base import BaseSchema

class IndexSchema(BaseSchema):
    version:str
    message: str