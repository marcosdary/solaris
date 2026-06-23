from typing import List
from sqlalchemy import select

from app.config import celery_app, PostgresSyncDB, get_settings
from app.models import SearchJobModel, JobModel
from app.services import JobScraperService
from app.schemas import ( 
    ListJobSchema,
    ListSearchJobSchema
)

def build_site_mapping(search_job: SearchJobModel) -> dict[str, str]:
    return {
        site.name: site.id
        for site in search_job.sites
    }

def job_to_model(job, sites: dict[str, str]) -> JobModel:
    data = job.model_dump()

    data["site_id"] = sites[data.pop("site")]

    return JobModel(**data)

def create_job_models(
    jobs_data: list[dict],
    search_job: SearchJobModel,
) -> list[JobModel]:

    sites = build_site_mapping(search_job)

    jobs = ListJobSchema.model_validate(jobs_data)

    return [
        job_to_model(job, sites)
        for job in jobs.root
    ]

@celery_app.task
def save_jobs_in_db_task():
    settings = get_settings()
    postgres_db = PostgresSyncDB(url=settings.DB_URL)
    
    job_models: List[JobModel] = []

    with postgres_db.get_session() as session:
        stmt = select(SearchJobModel)
        rows = session.scalars(stmt)
        list_search_job = ListSearchJobSchema.model_validate(rows)
        
        for search_job in list_search_job.root:
            site_mapping = build_site_mapping(search_job)
            print(site_mapping)
            """
            job_scraper = JobScraperService(
                sites=site_mapping.keys(),
                search=search_job.search,
                country_indeed=search_job.country_indeed,
                hours_publi=search_job.hours_publi,
                is_remote=search_job.is_remote,
                job_type=search_job.job_type,
                linkedin_fetch_description=search_job.linkedin_fetch_description,
                location=search_job.location,
                pages=search_job.pages,
            )

            jobs_df = job_scraper.get_jobs()
            records = jobs_df.to_dict(orient="records")


            job_models.extend(
                create_job_models(
                    jobs_data=records,
                    search_job=search_job
                )
            )
            """

        
        session.add_all(job_models)
        session.commit()

        return 