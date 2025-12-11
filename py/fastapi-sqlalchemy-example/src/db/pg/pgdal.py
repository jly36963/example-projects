"""Postgres data access layer."""

from uuid import UUID, uuid4

import asyncpg
import sqlalchemy as sa
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine  # AsyncSession

from ...types.types import Jutsu, JutsuNew, JutsuUpdates, Ninja, NinjaNew, NinjaUpdates

meta = sa.MetaData()


PgNinja = sa.Table(
    "ninjas",
    meta,
    sa.Column("id", sa.Uuid, primary_key=True),
    sa.Column("first_name", sa.String),
    sa.Column("last_name", sa.String),
    sa.Column("age", sa.Integer),
    sa.Column("created_at", sa.DateTime),
    sa.Column("updated_at", sa.DateTime, nullable=True),
)

PgJutsu = sa.Table(
    "jutsus",
    meta,
    sa.Column("id", sa.Uuid, primary_key=True),
    sa.Column("name", sa.String),
    sa.Column("description", sa.String),
    sa.Column("chakra_nature", sa.String),
    sa.Column("created_at", sa.DateTime),
    sa.Column("updated_at", sa.DateTime, nullable=True),
)

PgNinjaJutsu = sa.Table(
    "ninjas_jutsus",
    meta,
    sa.Column("id", sa.Uuid, primary_key=True),
    sa.Column("ninja_id", sa.Uuid),
    sa.Column("jutsu_id", sa.Uuid),
)


Statement = sa.Select | sa.Insert | sa.Update | sa.Delete


class PgDal:
    """TODO."""

    conn: asyncpg.connection.Connection
    engine: AsyncEngine

    def __init__(self, conn: asyncpg.connection.Connection, pg_url: str):
        """TODO."""
        updated_url = pg_url.replace("postgresql", "postgresql+asyncpg")

        engine = create_async_engine(updated_url, echo=True)
        self.conn = conn
        self.engine = engine

    # ---
    # Ninjas
    # ---

    async def create_ninja(self, ninja_new: NinjaNew) -> Ninja | None:
        """Create a ninja and return it."""
        query = (
            sa.insert(PgNinja)
            .values(**ninja_new, id=uuid4())
            .returning(sa.literal_column("*"))
        )
        cursor: sa.CursorResult
        async with self.engine.connect() as conn:
            cursor = await conn.execute(query)
            await conn.commit()
        result = cursor.mappings().first()
        if not result:
            return None
        return Ninja(**result)

    async def get_ninja(self, ninja_id: UUID) -> Ninja | None:
        """Get a ninja by id."""
        query = sa.select(PgNinja).where(PgNinja.c.id == ninja_id)
        cursor: sa.CursorResult
        async with self.engine.connect() as conn:
            cursor = await conn.execute(query)
            await conn.commit()
        result = cursor.mappings().first()
        if not result:
            return None
        return Ninja(**result)

    async def update_ninja(
        self,
        ninja_id: UUID,
        ninja_updates: NinjaUpdates,
    ) -> Ninja | None:
        """Update a ninja by id and return it."""
        query = (
            sa.update(PgNinja)
            .where(PgNinja.c.id == ninja_id)
            .values(**ninja_updates)
            .returning(sa.literal_column("*"))
        )
        cursor: sa.CursorResult
        async with self.engine.connect() as conn:
            cursor = await conn.execute(query)
            await conn.commit()
        result = cursor.mappings().first()
        if not result:
            return None
        return Ninja(**result)

    async def delete_ninja(self, ninja_id: UUID) -> Ninja | None:
        """Delete a ninja and return it."""
        query = (
            sa.delete(PgNinja)
            .where(PgNinja.c.id == ninja_id)
            .returning(sa.literal_column("*"))
        )
        cursor: sa.CursorResult
        async with self.engine.connect() as conn:
            cursor = await conn.execute(query)
            await conn.commit()
        result = cursor.mappings().first()
        if not result:
            return None
        return Ninja(**result)

    async def associate_ninja_and_jutsu(self, ninja_id: UUID, jutsu_id: UUID) -> None:
        """Associate a ninja and jutsu."""
        query = (
            sa.insert(PgNinjaJutsu)
            .values(id=uuid4(), ninja_id=ninja_id, jutsu_id=jutsu_id)
            .returning(sa.literal_column("*"))
        )
        async with self.engine.connect() as conn:
            await conn.execute(query)
            await conn.commit()

    async def dissociate_ninja_and_jutsu(self, ninja_id: UUID, jutsu_id: UUID) -> None:
        """Dissociate a ninja and jutsu."""
        query = (
            sa.delete(PgNinjaJutsu)
            .where(
                PgNinjaJutsu.c.ninja_id == ninja_id
                and PgNinjaJutsu.c.jutsu_id == jutsu_id
            )
            .returning(sa.literal_column("*"))
        )
        async with self.engine.connect() as conn:
            await conn.execute(query)
            await conn.commit()

    async def get_ninja_with_jutsus(self, ninja_id: UUID) -> Ninja | None:
        """Get ninja with associated jutsus."""
        # TODO: replace
        return await self.get_ninja(ninja_id)

    # ---
    # Jutsus
    # ---

    async def create_jutsu(self, jutsu_new: JutsuNew) -> Jutsu | None:
        """Create a jutsu and return it."""
        query = (
            sa.insert(PgJutsu)
            .values(**jutsu_new, id=uuid4())
            .returning(sa.literal_column("*"))
        )
        cursor: sa.CursorResult
        async with self.engine.connect() as conn:
            cursor = await conn.execute(query)
            await conn.commit()
        result = cursor.mappings().first()
        if not result:
            return None
        return Jutsu(**result)

    async def get_jutsu(self, jutsu_id: UUID) -> Jutsu | None:
        """Get a jutsu by id."""
        query = sa.select(PgJutsu).where(PgJutsu.c.id == jutsu_id)
        cursor: sa.CursorResult
        async with self.engine.connect() as conn:
            cursor = await conn.execute(query)
            await conn.commit()
        result = cursor.mappings().first()
        if not result:
            return None
        return Jutsu(**result)

    async def update_jutsu(
        self,
        jutsu_id: UUID,
        jutsu_updates: JutsuUpdates,
    ) -> Jutsu | None:
        """Update a jutsu by id and return it."""
        query = (
            sa.update(PgJutsu)
            .where(PgJutsu.c.id == jutsu_id)
            .values(**jutsu_updates)
            .returning(sa.literal_column("*"))
        )
        cursor: sa.CursorResult
        async with self.engine.connect() as conn:
            cursor = await conn.execute(query)
            await conn.commit()
        result = cursor.mappings().first()
        if not result:
            return None
        return Jutsu(**result)

    async def delete_jutsu(self, jutsu_id: UUID) -> Jutsu | None:
        """Delete a jutsu and return it."""
        query = (
            sa.delete(PgJutsu)
            .where(PgJutsu.c.id == jutsu_id)
            .returning(sa.literal_column("*"))
        )
        cursor: sa.CursorResult
        async with self.engine.connect() as conn:
            cursor = await conn.execute(query)
            await conn.commit()
        result = cursor.mappings().first()
        if not result:
            return None
        return Jutsu(**result)
