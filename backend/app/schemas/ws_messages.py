from typing import Literal, Annotated, Any, Optional
from pydantic import Field, ConfigDict

from .base import BaseSchema

ActionType = Literal[
    "add_experience",   "updated_experience",   "delete_experience",
    "add_education",    "update_education",     "delete_education",
    "add_project",      "update_project",       "delete_project",
    "add_certification","update_certification", "delete_certification",
    "update_personal"
]

class WSRequestSchema(BaseSchema):
    action: ActionType
    data: Annotated[dict[str, Any], Field(default_factory=dict)]
    entity_id: Annotated[Optional[str], Field(default=None, min_length=1)]

    model_config = ConfigDict(extra="forbid")

class WSResponseSchema(BaseSchema):

    action: str
    status: Literal["success", "error"]
    data: Annotated[Optional[Any], Field(default=None)]
    error: Annotated[Optional[Any], Field(default=None)]

__all__ = ["ActionType", "WSRequestSchema", "WSResponseSchema"]
