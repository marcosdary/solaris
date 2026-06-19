from pydantic import RootModel
from typing import List

from app.schemas.job import JobSchema

class JobsSchema(RootModel[List[JobSchema]]):
    pass 