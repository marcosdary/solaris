from pydantic import TypeAdapter

from app.config import celery_app, PostgresSyncDB, get_settings, Sites
from app.services import JobScraperService
from app.repositories import JobRepository
from app.schemas import RequestSearchJobSchema, ListJobSchema

@celery_app.task
def save_jobs_in_db_task():
    settings = get_settings()
    postgres_db = PostgresSyncDB(url=settings.DB_URL)
    
    with postgres_db.get_session() as session:
        schema = RequestSearchJobSchema(
            is_remote=False,
            hours_publi=24,
            linkedin_fetch_description=True,
            location="brazil",
            pages=20,
            search="desenvolvedor && developer",
            sites=[
                Sites.linkedin, Sites.indeed
            ]
        )

        job_scraper = JobScraperService(**schema.model_dump())
        jobs_df = job_scraper.get_jobs()
        records = jobs_df.to_dict(orient="records")
        jobs = TypeAdapter(
            ListJobSchema,
        ).validate_python(records)
    
        job_repo = JobRepository(session=session)
        job_repo.create_all(jobs)
        return