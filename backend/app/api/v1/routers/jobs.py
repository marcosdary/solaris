from typing import AsyncGenerator, List
from sqlalchemy.exc import IntegrityError
from fastapi import (
    APIRouter, 
    status,
    HTTPException,
    Depends
)
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import TypeAdapter

from app.schemas import (
    RequestSearchJobSchema,
    ResponseSiteSchema,
    AddSiteSchema,
    ListSiteSchema,
    ResponseSearchJobSchema,
    ListSearchJobSchema,
    ResponseDBJobSchema,
    ListJobSchema
)
from app.repositories import (
    SearchJobAsyncRepository, 
    JobAsyncRepository,
    SiteRepository
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
        print(request.model_dump_json(indent=4))
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
    response_model=ResponseSearchJobSchema
)
async def add_filter_jobs(
    request: RequestSearchJobSchema,
    session: AsyncSession = Depends(get_session),
) -> ResponseSearchJobSchema: 
    try:
        search_job_repo = SearchJobAsyncRepository(session=session)
        response = await search_job_repo.create(**request.model_dump())
        await session.commit()
        return response
    
    except IntegrityError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{exc.__class__.__name__} - Erro de integridade da informações."
        )

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(exc)
        )
    
@router.get(
    "/filter", 
    status_code=status.HTTP_201_CREATED, 
    response_model=ListSearchJobSchema
)
async def select_filter_jobs(
    session: AsyncSession = Depends(get_session),
) -> ListSearchJobSchema: 
    try:
        search_job_repo = SearchJobAsyncRepository(session=session)
        return await search_job_repo.select_all()
    
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(exc)
        )

@router.post(
    "/sites",
    status_code=status.HTTP_201_CREATED, 
    response_model=ResponseSiteSchema
)
async def add_site_for_job(
    request: AddSiteSchema,
    session: AsyncSession = Depends(get_session),
) -> ResponseSiteSchema:
    try:
        site_repo = SiteRepository(session)
        response = await site_repo.create(**request.model_dump())
        await session.commit()
        return response

    except IntegrityError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{exc.__class__.__name__} - Erro de integridade da informações."
        )

    except Exception as exc:
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc)
        )

@router.get(
    "/sites",
    status_code=status.HTTP_200_OK, 
    response_model=ListSiteSchema
)
async def select_sites(
    session: AsyncSession = Depends(get_session),
) -> ListSiteSchema:
    try:
        site_repo = SiteRepository(session)
        return await site_repo.select_all()

    except IntegrityError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"{exc.__class__.__name__} - Erro de integridade da informações."
        )

    except Exception as exc:
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc)
        )

@router.get(
    "",
    status_code=status.HTTP_200_OK,
    response_model=List[ResponseDBJobSchema]
)
async def get_jobs(
    limit: int = 10, 
    page: int = 1,
    session: AsyncSession = Depends(get_session),
) -> List[ResponseDBJobSchema]:
    try:
        job_repo = JobAsyncRepository(session=session)
        return await job_repo.select_all(page, limit)

    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
            detail=str(exc)
        )
