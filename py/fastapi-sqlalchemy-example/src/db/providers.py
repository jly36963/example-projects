"""Providers."""

import asyncpg

from .pg.pgdal import PgDal


class Providers:
    """TODO."""

    def __init__(self, pgdal: PgDal):
        """TODO."""
        self.pgdal = pgdal


async def get_providers(pg_url: str) -> Providers:
    """TODO."""
    pgdal = await get_pgdal(pg_url)
    providers = Providers(pgdal)
    return providers


async def get_pgdal(pg_url: str) -> PgDal:
    """TODO."""
    conn = await get_connection(pg_url)
    pgdal = PgDal(conn, pg_url)
    return pgdal


async def get_connection(pg_url: str) -> asyncpg.connection.Connection:
    """TODO."""
    conn: asyncpg.connection.Connection = await asyncpg.connect(pg_url)
    return conn
