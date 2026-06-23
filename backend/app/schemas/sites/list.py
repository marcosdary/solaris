from pydantic import RootModel
from typing import List

from app.schemas.sites.response import ResponseSiteSchema

class ListSiteSchema(RootModel[List[ResponseSiteSchema]]):
    pass 