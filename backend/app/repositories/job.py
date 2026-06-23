from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List

from app.models import JobModel

class JobAsyncRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def select_all(self, page: int, limit: int) -> List[JobModel]:
        if page <= 0 or limit <= 0:
            raise ValueError("Valores de paginação não pode ser menor que zero.")
        
        offset = (page - 1) * limit
        stmt = select(JobModel)
        stmt = stmt.order_by(JobModel.created_at).offset(offset).limit(limit)
        
        rows = await self.session.scalars(stmt)
        return rows
