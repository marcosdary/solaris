from .cv import router as cv_router
from .ws import router as ws_router
from .jobs import router as jobs_router

__all__ = [
    "cv_router",
    "ws_router",
    "jobs_router"
]