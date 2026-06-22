from pydantic import RootModel
from typing import List

from app.schemas.jobs.response import ResponseJobSchema

class ListJobSchema(RootModel[List[ResponseJobSchema]]):
    pass 