import asyncpg
from .pg.pgdal import PGDAL


class Providers:
    def __init__(self, pgdal: PGDAL):
        self.pgdal = pgdal


async def get_providers() -> Providers:
    pgdal = await get_pgdal()
    providers = Providers(pgdal)
    return providers


async def get_pgdal() -> PGDAL:
    conn = await get_connection()
    pgdal = PGDAL(conn)
    return pgdal


async def get_connection() -> asyncpg.connection.Connection:
    conn: asyncpg.connection.Connection = await asyncpg.connect(
        host="127.0.0.1",
        database="practice",
        user="postgres",
        password="postgres"
    )
    return conn
