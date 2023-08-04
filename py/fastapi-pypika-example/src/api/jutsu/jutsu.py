from uuid import UUID
from fastapi import Depends, Response, APIRouter
from ...db.providers import get_providers, Providers
from ...types.types import JutsuNew, JutsuUpdates

router = APIRouter()


@router.get("/{id}")
async def get_jutsu(
    response: Response,
    id: str,
    providers: Providers = Depends(get_providers)
):
    """Get jutsu"""
    if not isinstance(id, str):
        response.status_code = 400
        return {}
    try:
        jutsu = await providers.pgdal.get_jutsu(UUID(id))
        response.status_code = 200
        return jutsu
    except Exception:
        response.status_code = 500
        return {}


@router.post("/")
async def create_jutsu(
    response: Response,
    jutsu_new: JutsuNew,
    providers: Providers = Depends(get_providers)
):
    """Insert new jutsu"""
    try:
        jutsu = await providers.pgdal.create_jutsu(jutsu_new)
        response.status_code = 200
        return jutsu
    except Exception:
        response.status_code = 500
        return {}


@router.put("/{id}")
async def update_jutsu(
    response: Response,
    id: str,
    jutsu_updates: JutsuUpdates,
    providers: Providers = Depends(get_providers)
):
    """Update existing jutsu"""
    if not isinstance(id, str):
        response.status_code = 400
        return {}
    try:
        jutsu = await providers.pgdal.update_jutsu(UUID(id), jutsu_updates)
        response.status_code = 200
        return jutsu
    except Exception:
        response.status_code = 500
        return {}


@router.delete("/{id}")
async def delete_jutsu(
    response: Response,
    id: str,
    providers: Providers = Depends(get_providers)
):
    """Delete existing jutsu"""
    if not isinstance(id, str):
        response.status_code = 400
        return {}
    try:
        jutsu = await providers.pgdal.delete_jutsu(UUID(id))
        response.status_code = 200
        return jutsu
    except Exception:
        response.status_code = 500
        return {}
