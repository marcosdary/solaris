from pydantic import RootModel
from typing import List

from app.schemas.sites.response import ResponseDBSiteSchema

class ListSiteSchema(RootModel[List[ResponseDBSiteSchema]]):
    pass 