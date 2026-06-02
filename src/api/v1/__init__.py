from fastapi import APIRouter


from src.api.v1.routers import auth, cv

router = APIRouter()

router.include_router(auth.router, prefix="/auth")
router.include_router(cv.router, prefix="/cv")


