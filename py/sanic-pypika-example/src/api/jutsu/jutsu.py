from uuid import UUID
from sanic import Blueprint, Request, json
from sanic.response import empty
from sanic_ext import validate
from ...types.types import JutsuNew, JutsuUpdates

router = Blueprint('jutsu', url_prefix="/api/jutsu")


@router.get("/<id:uuid>")
async def get_jutsu(request: Request, id: UUID):
    """Get jutsu"""
    try:
        jutsu = await request.app.ctx.providers.pgdal.get_jutsu(id)
        return json(jutsu, status=200)
    except Exception:
        return empty(status=500)


@router.post("/")
@validate(json=JutsuNew)
async def create_jutsu(request: Request):
    """Insert new jutsu"""
    try:
        jutsu_new: JutsuNew = request.json
        jutsu = await request.app.ctx.providers.pgdal.create_jutsu(jutsu_new)
        return json(jutsu, status=200)
    except Exception:
        return empty(status=500)


@router.put("/<id:uuid>")
@validate(json=JutsuUpdates)
async def update_jutsu(request: Request, id: UUID,):
    """Update existing jutsu"""
    try:
        jutsu_updates: JutsuUpdates = request.json
        jutsu = await request.app.ctx.providers.pgdal.update_jutsu(id, jutsu_updates)
        return json(jutsu, status=200)
    except Exception:
        return empty(status=500)


@router.delete("/<id:uuid>")
async def delete_jutsu(request: Request, id: UUID,):
    """Delete existing jutsu"""
    try:
        jutsu = await request.app.ctx.providers.pgdal.delete_jutsu(id)
        return json(jutsu, status=200)
    except Exception:
        return empty(status=500)
