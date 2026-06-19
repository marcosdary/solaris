from fastapi import (
    APIRouter, 
    status,
    HTTPException
)
from pydantic import TypeAdapter

from app.schemas import JobsSchema, JobSearchRequestSchema
from app.services import (
    JobScraperService
)

router = APIRouter()


@router.post(
    "", 
    status_code=status.HTTP_201_CREATED, 
    response_model=JobsSchema
)
async def jobs(
    request: JobSearchRequestSchema,
) -> JobsSchema: 
    try:
        job_scraper = JobScraperService(**request.model_dump())
        jobs_df = job_scraper.get_jobs()
        records = jobs_df.to_dict(orient="records")
        jobs = TypeAdapter(
            JobsSchema,
        ).validate_python(records)
        return jobs
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=exc
        )