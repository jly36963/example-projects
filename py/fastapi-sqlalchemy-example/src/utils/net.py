"""Net utils."""

from datetime import timedelta
from typing import Any, TypedDict

import httpx


class FetchResponse(TypedDict):
    data: Any
    text: str
    status: int
    headers: dict
    elapsed: timedelta


async def fetch(
    url: str,
    method: str = "GET",
    headers: dict | None = None,
    payload: dict | list | None = None,
    params: dict | None = None,
) -> FetchResponse:
    """Make request to specified url and return result."""
    async with httpx.AsyncClient() as client:
        response = await client.request(
            method, url, headers=headers, json=payload, params=params
        )

        response.raise_for_status()
        data = response.json()

        return {
            "data": data,
            "text": response.text,
            "status": response.status_code,
            "headers": dict(response.headers),
            "elapsed": response.elapsed,
        }
