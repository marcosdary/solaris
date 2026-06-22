from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.models import SearchJobModel, SiteModel, SearchJobSiteModel

class SearchJobAsyncRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self, 
        search: str,
        location: str,
        country_indeed: str,
        pages: int,
        hours_publi: int,
        is_remote: Optional[bool],
        job_type: Optional[str],
        linkedin_fetch_description: Optional[bool],
        sites: List[str]
    ) -> SearchJobModel:

        model = SearchJobModel()
        model.search = search
        model.location = location
        model.country_indeed = country_indeed
        model.hours_publi = hours_publi
        model.is_remote = is_remote
        model.job_type = job_type
        model.pages = pages
        model.linkedin_fetch_description = linkedin_fetch_description

        if sites:
            stmt = select(SiteModel).where(SiteModel.id.in_(sites))
            result = await self.session.scalars(stmt)
            
            for row in result:        
                model.search_job_sites.append(SearchJobSiteModel(site=row))
                
        self.session.add(model)
        return model
    
    async def select_by_id(self, id: str) -> SearchJobModel:
        stmt = select(SearchJobModel).filter(SearchJobModel.id == id)
        row = await self.session.scalar(stmt) 

        if not row:
            raise ValueError("Informação não encontrada.")
        return row

