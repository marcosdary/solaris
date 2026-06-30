from app.schemas.generate_cv_request import GenerateCVRequestSchema
from app.schemas.generate_cv_response import GenerateCVResponseSchema
from app.schemas.index import IndexSchema
from app.schemas.jobs import (
    InsertDBJobSchema,
    ListJobSchema,
    ResponseDBJobSchema,
    ResponseJobSchema,
)
from app.schemas.sites import (
    ResponseSiteSchema,
    AddSiteSchema,
    ListSiteSchema
)
from app.schemas.search_job import (
    InsertDBSearchJobSchema, 
    RequestSearchJobSchema, 
    ResponseSearchJobSchema,
    ListSearchJobSchema
)

from app.schemas.structured_cv_request import (
    StructuredCVRequestSchema,
    CertificationSchema,
    EducationSchema,
    ExperienceSchema,
    ProjectSchema,
    ActivitySchema
)