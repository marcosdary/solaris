from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from app.models import JobModel
from app.config import Sites

class JobAsyncRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def select_all(self, site: Sites, page: int, limit: int, all: bool = False) -> List[JobModel]:
        if page <= 0 or limit <= 0:
            raise ValueError("Valores de paginação não pode ser menor que zero.")
        
        offset = (page - 1) * limit
        stmt = select(JobModel)
        if not all:
            stmt = stmt.filter(JobModel.site_id == site.value)
        stmt = stmt.order_by(JobModel.created_at).offset(offset).limit(limit)
        
        rows = await self.session.scalars(stmt)
        return rows.all()
