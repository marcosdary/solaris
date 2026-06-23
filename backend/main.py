from app.tasks import save_jobs_in_db_task

from typing import List
from pydantic import TypeAdapter
from sqlalchemy import select

from app.config import PostgresSyncDB, get_settings
from app.schemas import ListSearchJobSchema, ListJobSchema
from app.models import SearchJobModel, JobModel
from app.services import JobScraperService

def build_site_mapping(search_job: SearchJobModel) -> dict[str, int]:
    return {
        site.name: site.id
        for site in search_job.sites
    }

def job_to_model(job, sites: dict[str, int]) -> JobModel:
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


if __name__ == "__main__":
    """
    settings = get_settings()
    postgres_db = PostgresSyncDB(url=settings.DB_URL)

    with postgres_db.get_session() as session:

        stmt = select(SearchJobModel)
        rows = session.scalars(stmt)
        search_jobs = ListSearchJobSchema.model_validate(rows)

        job_models: List[JobModel] = []
        
        for search_job in search_jobs.root:
            site_mapping = build_site_mapping(search_job)
            
            job_scraper = JobScraperService(
                sites=list(site_mapping.keys()),
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
            type_adapter = TypeAdapter(ListJobSchema)
            job_datas = type_adapter.validate_python(records)

            job_models.extend(
                create_job_models(
                    jobs_data=job_datas,
                    search_job=search_job
                )
            )
        print(job_datas.model_dump_json(indent=4))
        session.add_all(job_models)
        session.commit()
              
        """








    save_jobs_in_db_task.delay()

