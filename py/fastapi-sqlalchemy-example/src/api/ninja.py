"""Ninja API routes."""

# pylint: disable=W0718

from uuid import UUID

from fastapi import APIRouter, FastAPI, Response  # Depends

from ..db.providers import Providers  # get_providers
from ..types.types import NinjaNew, NinjaUpdates


def add_ninja_routes(app: FastAPI, providers: Providers):
    """Add ninja routes."""
    router = APIRouter()

    @router.get("/{ninja_id}")
    async def get_ninja(
        response: Response,
        ninja_id: str,
        # providers: Providers = Depends(get_providers),
    ):
        """Get ninja."""
        try:
            ninja = await providers.pgdal.get_ninja(UUID(ninja_id))
            response.status_code = 200
            return ninja
        except Exception:
            response.status_code = 500
            return {}

    @router.post("/")
    async def create_ninja(
        response: Response,
        ninja_new: NinjaNew,
        # providers: Providers = Depends(get_providers),
    ):
        """Insert new ninja."""
        try:
            ninja = await providers.pgdal.create_ninja(ninja_new)
            response.status_code = 200
            return ninja
        except Exception:
            response.status_code = 500
            return {}

    @router.put("/{ninja_id}")
    async def update_ninja(
        response: Response,
        ninja_id: str,
        ninja_updates: NinjaUpdates,
        # providers: Providers = Depends(get_providers),
    ):
        """Update existing ninja."""
        try:
            ninja = await providers.pgdal.update_ninja(UUID(ninja_id), ninja_updates)
            response.status_code = 200
            return ninja
        except Exception:
            response.status_code = 500
            return {}

    @router.delete("/{ninja_id}")
    async def delete_ninja(
        response: Response,
        ninja_id: str,
        # providers: Providers = Depends(get_providers),
    ):
        """Delete existing ninja."""
        try:
            ninja = await providers.pgdal.delete_ninja(UUID(ninja_id))
            response.status_code = 200
            return ninja
        except Exception:
            response.status_code = 500
            return {}

    @router.post("/{ninja_id}/jutsu/{jutsu_id}")
    async def associate_ninja_and_jutsu(
        response: Response,
        ninja_id: str,
        jutsu_id: str,
        # providers: Providers = Depends(get_providers),
    ):
        """Associate ninja and jutsu."""
        try:
            await providers.pgdal.associate_ninja_and_jutsu(
                UUID(ninja_id), UUID(jutsu_id)
            )
            response.status_code = 200
            return {}
        except Exception:
            response.status_code = 500
            return {}

    @router.delete("/{ninja_id}/jutsu/{jutsu_id}")
    async def dissociate_ninja_and_jutsu(
        response: Response,
        ninja_id: str,
        jutsu_id: str,
        # providers: Providers = Depends(get_providers),
    ):
        """Dissociate ninja and jutsu."""
        try:
            await providers.pgdal.dissociate_ninja_and_jutsu(
                UUID(ninja_id), UUID(jutsu_id)
            )
            response.status_code = 200
            return {}
        except Exception:
            response.status_code = 500
            return {}

    @router.get("/{ninja_id}/jutsus")
    async def get_ninja_with_jutsus(
        response: Response,
        ninja_id: str,
        # providers: Providers = Depends(get_providers),
    ):
        """Get ninja with jutsus."""
        try:
            ninja = await providers.pgdal.get_ninja_with_jutsus(UUID(ninja_id))
            response.status_code = 200
            return ninja
        except Exception:
            response.status_code = 500
            return {}

    app.include_router(
        router,
        prefix="/api/ninja",
    )
