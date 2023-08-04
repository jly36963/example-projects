import os
from fastapi import FastAPI
import uvicorn
from src.api.ninja import ninja
from src.api.jutsu import jutsu

dev = os.getenv('PYTHON_ENV') != 'production'

app = FastAPI()
app.include_router(
    ninja.router,
    prefix="/api/ninja",
)
app.include_router(
    jutsu.router,
    prefix="/api/jutsu"
)

if __name__ == "__main__":
    uvicorn.run('main:app', host="127.0.0.1", port=3000, reload=dev)
