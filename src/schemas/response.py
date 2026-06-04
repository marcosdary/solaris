from typing import Annotated
from pydantic import Field, AliasChoices

from src.schemas.base import BaseSchema

class ResponseSchema(BaseSchema):
    id: Annotated[str, Field(alias=AliasChoices("id"))]
    name: Annotated[str, Field(alias=AliasChoices("name"))]
    mimetype: Annotated[str, Field(alias=AliasChoices("mimeType"))]
    size: Annotated[str, Field(alias=AliasChoices("size"))]
    web_view_link: Annotated[str, Field(alias=AliasChoices("webViewLink"))]