from fastapi import APIRouter

router = APIRouter()


@router.get("/", status_code=200)
async def root():
    """Return hello world message"""
    greeting: str = "Hello World"
    return {"message": greeting, "error": None}
