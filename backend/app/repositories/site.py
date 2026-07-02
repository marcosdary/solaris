from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.models import SiteModel

class SiteRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, name: str) -> SiteModel:
        site = SiteModel(name=name)
        self.session.add(site)
        return site
    

    async def select_all(self) -> List[SiteModel]:
        stmt = select(SiteModel)
        return await self.session.scalars(stmt)
    
__all__ = ["SiteRepository"]