"""Types."""

import datetime
from typing import TypedDict
from uuid import UUID


class NinjaNew(TypedDict):
    """TODO."""

    first_name: str
    last_name: str
    age: int


class NinjaUpdates(TypedDict, total=False):
    """TODO."""

    first_name: str
    last_name: str
    age: int


class Ninja(TypedDict):
    """TODO."""

    id: UUID
    first_name: str
    last_name: str
    age: int
    created_at: datetime.datetime
    updated_at: datetime.datetime | None
    jutsus: list["Jutsu"] | None


class JutsuNew(TypedDict):
    """TODO."""

    name: str
    description: str
    chakra_nature: str


class JutsuUpdates(TypedDict, total=False):
    """TODO."""

    name: str
    description: str
    chakra_nature: str


class Jutsu(TypedDict):
    """TODO."""

    id: UUID
    name: str
    description: str
    chakra_nature: str
    created_at: datetime.datetime
    updated_at: datetime.datetime | None
