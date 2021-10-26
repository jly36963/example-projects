from uuid import UUID
from fastapi import Depends, Response, APIRouter
from ...db.providers import get_providers, Providers
from ...types.types import NinjaNew, NinjaUpdates

router = APIRouter()


@router.get("/{id}")
async def get_ninja(
    response: Response,
    id: str,
    providers: Providers = Depends(get_providers)
):
    """
    Get ninja
    """
    if not isinstance(id, str):
        response.status_code = 400
        return {}
    try:
        ninja = await providers.pgdal.get_ninja(UUID(id))
        response.status_code = 200
        return ninja
    except Exception:
        response.status_code = 500
        return {}


@router.post("/")
async def create_ninja(
    response: Response,
    ninja_new: NinjaNew,
    providers: Providers = Depends(get_providers)
):
    """
    Insert new ninja
    """
    try:
        ninja = await providers.pgdal.create_ninja(ninja_new)
        response.status_code = 200
        return ninja
    except Exception:
        response.status_code = 500
        return {}


@router.put("/{id}")
async def update_ninja(
    response: Response,
    id: str,
    ninja_updates: NinjaUpdates,
    providers: Providers = Depends(get_providers)
):
    """
    Update existing ninja
    """
    if not isinstance(id, str):
        response.status_code = 400
        return {}
    try:
        ninja = await providers.pgdal.update_ninja(UUID(id), ninja_updates)
        response.status_code = 200
        return ninja
    except Exception:
        response.status_code = 500
        return {}


@router.delete("/{id}")
async def delete_ninja(
    response: Response,
    id: str,
    providers: Providers = Depends(get_providers)
):
    """
    Delete existing ninja
    """
    if not isinstance(id, str):
        response.status_code = 400
        return {}
    try:
        ninja = await providers.pgdal.delete_ninja(UUID(id))
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
    providers: Providers = Depends(get_providers)
):
    """
    Associate ninja and jutsu
    """
    if not isinstance(ninja_id, str) and isinstance(jutsu_id, str):
        response.status_code = 400
        return {}
    try:
        await providers.pgdal.associate_ninja_and_jutsu(UUID(ninja_id), UUID(jutsu_id))
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
    providers: Providers = Depends(get_providers)
):
    """
    Dissociate ninja and jutsu
    """
    if not isinstance(ninja_id, str) and isinstance(jutsu_id, str):
        response.status_code = 400
        return {}
    try:
        await providers.pgdal.dissociate_ninja_and_jutsu(UUID(ninja_id), UUID(jutsu_id))
        response.status_code = 200
        return {}
    except Exception:
        response.status_code = 500
        return {}


@router.get("/{id}/jutsus")
async def get_ninja_with_jutsus(
    response: Response,
    id: str,
    providers: Providers = Depends(get_providers)
):
    """
    Get ninja with jutsus
    """
    if not isinstance(id, str):
        response.status_code = 400
        return {}
    try:
        ninja = await providers.pgdal.get_ninja_with_jutsus(UUID(id))
        response.status_code = 200
        return ninja
    except Exception:
        response.status_code = 500
        return {}
