from uuid import UUID
from sanic import Blueprint, Request, json
from sanic.response import empty
from sanic_ext import validate
from ...types.types import NinjaNew, NinjaUpdates

router = Blueprint('ninja', url_prefix="/api/ninja")


@router.get("/<id:uuid>")
async def get_ninja(
    request: Request,
    id: UUID,
):
    """
    Get ninja
    """
    try:
        ninja = await request.app.ctx.providers.pgdal.get_ninja(id)
        return json(ninja, status=200)
    except Exception:
        return empty(status=500)


@router.post("/")
@validate(json=NinjaNew)
async def create_ninja(request: Request):
    """
    Insert new ninja
    """
    try:
        ninja_new: NinjaNew = request.json
        ninja = await request.app.ctx.providers.pgdal.create_ninja(ninja_new)
        return json(ninja, status=200)
    except Exception:
        return empty(status=500)


@router.put("/<id:uuid>")
@validate(json=NinjaUpdates)
async def update_ninja(
    request: Request,
    id: UUID,
):
    """
    Update existing ninja
    """
    try:
        ninja_updates: NinjaUpdates = request.json
        ninja = await request.app.ctx.providers.pgdal.update_ninja(id, ninja_updates)
        return json(ninja, status=200)
    except Exception:
        return empty(status=500)


@router.delete("/<id:uuid>")
async def delete_ninja(
    request: Request,
    id: UUID,
):
    """
    Delete existing ninja
    """
    try:
        ninja = await request.app.ctx.providers.pgdal.delete_ninja(id)
        return json(ninja, status=200)
    except Exception:
        return empty(status=500)


@router.post("/<ninja_id:uuid>/jutsu/<jutsu_id:uuid>")
async def associate_ninja_and_jutsu(
    request: Request,
    ninja_id: UUID,
    jutsu_id: UUID,
):
    """
    Associate ninja and jutsu
    """
    try:
        await request.app.ctx.providers.pgdal.associate_ninja_and_jutsu(ninja_id, jutsu_id)
        return empty(status=200)
    except Exception:
        return empty(status=500)


@router.delete("/<ninja_id:uuid>/jutsu/<jutsu_id:uuid>")
async def dissociate_ninja_and_jutsu(
    request: Request,
    ninja_id: UUID,
    jutsu_id: UUID,
):
    """
    Dissociate ninja and jutsu
    """
    try:
        await request.app.ctx.providers.pgdal.dissociate_ninja_and_jutsu(ninja_id, jutsu_id)
        return empty(status=200)
    except Exception:
        return empty(status=500)


@router.get("/<id:uuid>/jutsus")
async def get_ninja_with_jutsus(
    request: Request,
    id: UUID,
):
    """
    Get ninja with jutsus
    """
    try:
        ninja = await request.app.ctx.providers.pgdal.get_ninja_with_jutsus(id)
        return json(ninja, status=200)
    except Exception:
        return empty(status=500)
