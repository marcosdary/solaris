from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey

from app.models.base import BaseModel

class SearchJobSiteModel(BaseModel):
    __tablename__ = "search_job_site"

    search_job_id: Mapped[str] = mapped_column(
        ForeignKey("search_job.id", ondelete="CASCADE"),
        primary_key=True,
    )

    site_id: Mapped[str] = mapped_column(
        ForeignKey("site.id", ondelete="RESTRICT"),
        primary_key=True,
    )

    search_job: Mapped["SearchJobModel"] = relationship(
        back_populates="search_job_sites"
    )

    site: Mapped["SiteModel"] = relationship(
        back_populates="search_job_sites"
    )

__all__ = ["SearchJobSiteModel"]