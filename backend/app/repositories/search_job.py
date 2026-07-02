from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from typing import List, Optional

from app.models import SearchJobModel, SiteModel, SearchJobSiteModel

class SearchJobAsyncRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(
        self, 
        search: str,
        location: str,
        country_indeed: Optional[str],
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
    
    async def select_all(self) -> List[SearchJobModel]:
        stmt = select(SearchJobModel).options(
            joinedload(SearchJobModel.search_job_sites)
            .joinedload(SearchJobSiteModel.site)
        )
        rows = await self.session.execute(stmt) 
        return rows.scalars().unique().all()

__all__ = ["SearchJobAsyncRepository"]