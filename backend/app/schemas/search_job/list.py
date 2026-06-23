from pydantic import RootModel
from typing import List

from app.schemas.search_job.response import ResponseSearchJobSchema

class ListSearchJobSchema(RootModel[List[ResponseSearchJobSchema]]):
    pass 