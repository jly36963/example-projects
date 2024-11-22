"""Jutsu API routes."""

# pylint: disable=W0718

from uuid import UUID

from fastapi import APIRouter, FastAPI, Response  # Depends

from ..db.providers import Providers  # get_providers
from ..types.types import JutsuNew, JutsuUpdates


def add_jutsu_routes(app: FastAPI, providers: Providers):
    """Add jutsu routes."""
    router = APIRouter()

    @router.get("/{jutsu_id}")
    async def get_jutsu(
        response: Response,
        jutsu_id: str,
        # providers: Providers = Depends(get_providers),
    ):
        """Get jutsu."""
        try:
            jutsu = await providers.pgdal.get_jutsu(UUID(jutsu_id))
            response.status_code = 200
            return jutsu
        except Exception:
            response.status_code = 500
            return {}

    @router.post("/")
    async def create_jutsu(
        response: Response,
        jutsu_new: JutsuNew,
        # providers: Providers = Depends(get_providers),
    ):
        """Insert new jutsu."""
        try:
            jutsu = await providers.pgdal.create_jutsu(jutsu_new)
            response.status_code = 200
            return jutsu
        except Exception:
            response.status_code = 500
            return {}

    @router.put("/{jutsu_id}")
    async def update_jutsu(
        response: Response,
        jutsu_id: str,
        jutsu_updates: JutsuUpdates,
        # providers: Providers = Depends(get_providers),
    ):
        """Update existing jutsu."""
        try:
            jutsu = await providers.pgdal.update_jutsu(UUID(jutsu_id), jutsu_updates)
            response.status_code = 200
            return jutsu
        except Exception:
            response.status_code = 500
            return {}

    @router.delete("/{jutsu_id}")
    async def delete_jutsu(
        response: Response,
        jutsu_id: str,
        # providers: Providers = Depends(get_providers),
    ):
        """Delete existing jutsu."""
        try:
            jutsu = await providers.pgdal.delete_jutsu(UUID(jutsu_id))
            response.status_code = 200
            return jutsu
        except Exception:
            response.status_code = 500
            return {}

    app.include_router(
        router,
        prefix="/api/jutsu",
    )
