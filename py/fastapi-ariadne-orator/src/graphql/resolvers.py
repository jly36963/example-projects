from typing import Union
from ariadne import QueryType, MutationType

# ---
# query
# ---

query = QueryType()  # ObjectType("Query")


@query.field('hello')
async def resolve_hello(_, info):
    request = info.context['request']  # starlette.requests.Request
    print(
        "headers", request.headers,
        "path_params", request.path_params,
        "body", await request.body(),
        "query_params", request.query_params,
        sep='\n\n'
    )
    return "Hello friend!"


@query.field('ninja')
async def resolve_ninja(_, info, id: str) -> Union[dict, None]:
    ninja = info.context['pg_dal'].get_ninja_with_related_jutsu(id)
    return ninja


@query.field('jutsu')
async def resolve_jutsu(_, info, id: str) -> Union[dict, None]:
    jutsu = info.context['pg_dal'].get_jutsu(id)
    return jutsu

# ---
# mutation
# ---

mutation = MutationType()  # ObjectType("Mutation")


@mutation.field('insertNinja')
def resolve_insert_ninja(_, info, ninja: dict) -> Union[dict, None]:
    inserted_ninja = info.context['pg_dal'].insert_ninja(ninja)
    return inserted_ninja


@mutation.field('updateNinja')
def resolve_update_ninja(_, info, id: str, updates: dict) -> Union[dict, None]:
    updated_ninja = info.context['pg_dal'].update_ninja(id, updates)
    return updated_ninja


@mutation.field('deleteNinja')
def resolve_delete_ninja(_, info, id: str) -> Union[dict, None]:
    deleted_ninja = info.context['pg_dal'].delete_ninja(id)
    return deleted_ninja


@mutation.field('insertJutsu')
def resolve_insert_jutsu(_, info, jutsu: dict) -> Union[dict, None]:
    inserted_jutsu = info.context['pg_dal'].insert_jutsu(jutsu)
    return inserted_jutsu


@mutation.field('updateJutsu')
def resolve_update_jutsu(_, info, id: str, updates: dict) -> Union[dict, None]:
    updated_jutsu = info.context['pg_dal'].update_jutsu(id, updates)
    return updated_jutsu


@mutation.field('deleteJutsu')
def resolve_delete_jutsu(_, info, id: str) -> Union[dict, None]:
    deleted_jutsu = info.context['pg_dal'].delete_jutsu(id)
    return deleted_jutsu


@mutation.field('addKnownJutsu')
def resolve_add_known_jutsu(_, info, ninja_id: str, jutsu_id: str) -> Union[dict, None]:
    info.context['pg_dal'].add_known_jutsu(ninja_id, jutsu_id)
    ninja_with_known_jutsu = info.context['pg_dal'].get_ninja_with_related_jutsu(ninja_id)
    return ninja_with_known_jutsu


@mutation.field('removeKnownJutsu')
def resolve_remove_known_jutsu(_, info, ninja_id: str, jutsu_id: str) -> Union[dict, None]:
    info.context['pg_dal'].remove_known_jutsu(ninja_id, jutsu_id)
    ninja_with_known_jutsu = info.context['pg_dal'].get_ninja_with_related_jutsu(ninja_id)
    return ninja_with_known_jutsu
