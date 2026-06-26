from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List
from uuid import uuid4

from app.models.base import BaseModel


class SearchJobModel(BaseModel):
    __tablename__ = "search_job"

    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid4()))
    search: Mapped[str] = mapped_column(nullable=True)
    location: Mapped[str] = mapped_column(nullable=True)
    job_type: Mapped[str] = mapped_column(nullable=True)
    is_remote: Mapped[bool]
    pages: Mapped[int] 
    country_indeed: Mapped[str] = mapped_column(nullable=True)
    hours_publi: Mapped[int]
    linkedin_fetch_description: Mapped[bool]


    search_job_sites: Mapped[List["SearchJobSiteModel"]] = relationship(
        back_populates="search_job"
    )

    @property
    def sites(self):
        return [item.site for item in self.search_job_sites]
    
    