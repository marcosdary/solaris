from typing import Annotated, List, Optional
from pydantic import Field, field_serializer
import re

from app.schemas.base import BaseSchema

class ActivitySchema(BaseSchema):
    """Uma atividade/realização dentro de uma experiência profissional."""
    description: Annotated[str, Field(min_length=1)]


class ExperienceSchema(BaseSchema):
    """Seção EXPERIÊNCIA PROFISSIONAL — uma entrada com cargo, empresa,
    período, local e lista de atividades."""
    role: Annotated[str, Field(min_length=1)]
    company: Annotated[str, Field(min_length=1)]
    period: Annotated[str, Field(min_length=1)]
    location: Annotated[str, Field(min_length=1)]
    activities: Annotated[List[str], Field(min_length=1)]


class EducationSchema(BaseSchema):
    """Seção EDUCAÇÃO — instituição, curso, período e local."""
    institution: Annotated[str, Field(min_length=1)]
    degree: Annotated[str, Field(min_length=1)]
    period: Annotated[str, Field(min_length=1)]
    location: Annotated[str, Field(min_length=1)]


class ProjectSchema(BaseSchema):
    """Seção PROJETOS — nome, descrição, período e lista de tecnologias."""
    name: Annotated[str, Field(min_length=1)]
    github: Annotated[str, Field(min_length=1)]
    description: Annotated[List[str], Field(min_length=1)]
    period: Annotated[str, Field(min_length=1)]
    technologies: Annotated[Optional[List[str]], Field(default=None)]


class CertificationSchema(BaseSchema):
    """Seção CERTIFICAÇÕES — instituição, nome da certificação,
    período e local."""
    institution: Annotated[str, Field(min_length=1)]
    name: Annotated[str, Field(min_length=1)]
    period: Annotated[str, Field(min_length=1)]
    location: Annotated[str, Field(min_length=1)]


class StructuredCVRequestSchema(BaseSchema):
    """Schema completo para o template portuguese-melhorado.docx.

    Mapeia diretamente os placeholders Jinja2 definidos no template,
    permitindo o envio estruturado de todas as seções do currículo
    em uma única requisição.
    """
    name: Annotated[str, Field(min_length=1)]
    email: Annotated[str, Field(min_length=1)]
    role: Annotated[str, Field(min_length=1)]
    github: Annotated[Optional[str], Field(min_length=1, default=None)]
    linkedin: Annotated[str, Field(min_length=1)]
    phone: Annotated[str, Field(min_length=1)]
    location: Annotated[str, Field(min_length=1)]
    resume: Annotated[str, Field(min_length=1)]
    experiences: Annotated[List[ExperienceSchema], Field(min_length=1)]
    educations: Annotated[List[EducationSchema], Field(min_length=1)]
    projects: Annotated[Optional[List[ProjectSchema]], Field(default=None)]
    certifications: Annotated[
        Optional[List[CertificationSchema]], Field(default=None)
    ]

    @field_serializer("resume", mode="plain")
    def serialize_resume(self, value: str) -> str:
        return re.sub(
            r"\*\*(.*?)\*\*",
            r"<strong>\1</strong>",
            value
        )