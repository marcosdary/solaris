from .curriculum import router as cv_router
from .ws import router as ws_router
from .user import router as user_router

__all__ = [
    "cv_router",
    "ws_router",
    "user_router",
]