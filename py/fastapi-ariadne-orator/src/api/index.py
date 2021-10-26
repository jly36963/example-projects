from fastapi import Response, APIRouter
from src.lib.hello import hello

router = APIRouter()


@router.get("/", status_code=200)
async def root():
    """
    route -- GET /api
    description -- hello world
    access -- public
    """
    greeting: str = "Hello World"
    return {"message": greeting, "error": None}


@router.get("/hello", status_code=200)
async def say_hello(response: Response):
    """
    route -- GET /api/hello
    description -- return greeting
    access -- public
    """
    try:
        greeting: str = hello()
        return {"data": greeting, "error": None}
    except Exception as e:
        response.status_code = 500
        return {"data": None, "error": str(e)}
