from fastapi import APIRouter


from src.api.v1.routers import cv, ws

router = APIRouter()


router.include_router(cv.router, prefix="/cv")
router.include_router(ws.router, prefix="/ws")



