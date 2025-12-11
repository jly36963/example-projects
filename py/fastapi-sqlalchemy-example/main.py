"""FastAPI and SQLAlchemy example."""

import asyncio
import os

from fastapi import FastAPI
from hypercorn.asyncio import serve
from hypercorn.config import Config
from pydantic import BaseModel, StrictInt, StrictStr

from src.api.jutsu import add_jutsu_routes
from src.api.ninja import add_ninja_routes
from src.db.providers import get_providers


class ServerConfig(BaseModel):
    """TODO."""

    port: StrictInt
    pg_url: StrictStr


def _get_config() -> ServerConfig:
    pg_url = os.getenv("PG_URL") or "postgresql://postgres:postgres@127.0.0.1/practice"
    port_str = os.getenv("PORT")
    port = int(port_str) if port_str else 3000
    config = ServerConfig(port=port, pg_url=pg_url)
    return config


async def _start_server(app: FastAPI, port: int):
    serve_on = f"127.0.0.1:{port}"
    cfg = Config()
    cfg.bind = serve_on
    await serve(app, cfg)  # type: ignore


async def main():
    """Start server."""
    config = _get_config()
    providers = await get_providers(config.pg_url)
    app = FastAPI()
    add_ninja_routes(app, providers)
    add_jutsu_routes(app, providers)
    await _start_server(app, config.port)


if __name__ == "__main__":
    asyncio.run(main())
