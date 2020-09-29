# ----------
# imports
# ----------

# standard library
import sys
import os
# package imports
from fastapi import FastAPI
import uvicorn
# routers
from routers.api import index


# ----------
# app
# ----------

app = FastAPI()
app.include_router(
    index.router,
    prefix="/api",
)

# ----------
# listen
# ----------

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
