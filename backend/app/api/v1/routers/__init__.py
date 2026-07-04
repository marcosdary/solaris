from .cv import router as cv_router
from .ws import router as ws_router
from .cv_ws import router as cv_ws_router

__all__ = [
    "cv_router",
    "ws_router",
    "cv_ws_router"
]