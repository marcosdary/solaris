from typing import AsyncGenerator
from fastapi import (
    APIRouter, 
    status,
    HTTPException,
    Depends
)
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import TypeAdapter

from app.schemas import ListJobSchema, RequestSearchJobSchema
from app.repositories import (
    SearchJobAsyncRepository, 
    JobAsyncRepository
)
from app.config import (
    Settings, 
    get_settings, 
    PostgresAsyncDB,
    Sites
)
from app.services import (
    JobScraperService
)

async def get_session(
    settings: Settings = Depends(get_settings),
) -> AsyncGenerator[AsyncSession, None]:
    postgres_db = PostgresAsyncDB(settings.DB_URL)
    async with postgres_db.get_session() as session:
        yield session

router = APIRouter()

@router.post(
    "", 
    status_code=status.HTTP_201_CREATED, 
    response_model=ListJobSchema
)
async def jobs(
    request: RequestSearchJobSchema
) -> ListJobSchema: 
    try:
        job_scraper = JobScraperService(**request.model_dump())
        jobs_df = job_scraper.get_jobs()
        records = jobs_df.to_dict(orient="records")
        jobs = TypeAdapter(
            ListJobSchema,
        ).validate_python(records)
        return jobs
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(exc)
        )

@router.post(
    "/add-filter", 
    status_code=status.HTTP_201_CREATED, 
    response_model=RequestSearchJobSchema
)
async def add_filter_jobs(
    request: RequestSearchJobSchema,
    session: AsyncSession = Depends(get_session),
) -> RequestSearchJobSchema: 
    try:
        search_job_repo = SearchJobAsyncRepository(session=session)
        response = await search_job_repo.create(search=request)
        await session.commit()
        return response
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(exc)
        )

@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=ListJobSchema
)
async def get_jobs(
    site: Sites,
    limit: int = 10, 
    page: int = 1,
    session: AsyncSession = Depends(get_session),
):
    try:
        job_repo = JobAsyncRepository(session=session)
        return await job_repo.select_all(site, page, limit)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(exc)
        )
