from fastapi import APIRouter


from src.api.v1.routers import cv

router = APIRouter()


router.include_router(cv.router, prefix="/cv")


