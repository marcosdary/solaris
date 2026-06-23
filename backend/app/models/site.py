from sqlalchemy.orm import Mapped, mapped_column, relationship
from uuid import uuid4

from app.models.base import BaseModel


class SiteModel(BaseModel):
    __tablename__ = "site"

    id: Mapped[str] = mapped_column(primary_key=True, default=lambda: str(uuid4()))
    name: Mapped[str] = mapped_column(unique=True)

    jobs: Mapped["JobModel"] = relationship(
        back_populates="site"
    )

    search_job_sites: Mapped[list["SearchJobSiteModel"]] = relationship(
        back_populates="site",
        cascade="all, delete-orphan",
    )


    def __repr__(self):
        return f"SiteModel(id={self.id},name={self.name})"
    

    