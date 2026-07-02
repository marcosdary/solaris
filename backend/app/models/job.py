from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey

from app.models.base import BaseModel


class JobModel(BaseModel):
    __tablename__ = "job"

    id: Mapped[str] = mapped_column(primary_key=True)
    site_id: Mapped[str] = mapped_column(ForeignKey("site.id"), nullable=False)
    job_url: Mapped[str] = mapped_column(nullable=True)
    title: Mapped[str] = mapped_column(nullable=True)
    company_url: Mapped[str] = mapped_column(nullable=True)
    company: Mapped[str] = mapped_column(nullable=True)
    location: Mapped[str] = mapped_column(nullable=True)
    job_level: Mapped[str] = mapped_column(nullable=True)
    job_function: Mapped[str] = mapped_column(nullable=True)
    description: Mapped[str]

    site: Mapped["SiteModel"] = relationship(back_populates="jobs", lazy="selectin")

    def __repr__(self):
        return (
            f"JobModel(id={self.id},site_id={self.site_id}," \
            f"job_url={self.job_url},title={self.job_function},company_url={self.company_url}," \
            f"company={self.company},location={self.location},job_level={self.job_level}," \
            f"description={self.description[:10]}...)"
        )
    
__all__ = ["JobModel"]