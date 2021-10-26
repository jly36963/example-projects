import os
from fastapi import FastAPI
from dotenv import load_dotenv
import uvicorn
from ariadne.asgi import GraphQL
from src.api import index
from src.graphql.schema import schema
from src.graphql.context import get_context_value

# env
load_dotenv(verbose=True)
port = int(os.getenv('PORT') or "8000")
dev = os.getenv('PYTHON_ENV') != 'production'

# app
app = FastAPI()

# rest routes
app.include_router(
    index.router,
    prefix="/api",
)

# graphql
app.add_route(
    '/graphql',
    GraphQL(
        schema,
        context_value=get_context_value,
        debug=dev
    )
)


# listen
if __name__ == "__main__":
    uvicorn.run('main:app', host="0.0.0.0", port=port, reload=dev)

# developement
# pipenv run python3 main.py
# pipenv run uvicorn main:app --reload
