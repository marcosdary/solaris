from .curriculum import router as cv_router
from .ws import router as ws_router
from .user import router as user_router
from .curriculum_file import router as curriculum_files_router

__all__ = [
    "cv_router",
    "ws_router",
    "user_router",
    "curriculum_files_router",
]