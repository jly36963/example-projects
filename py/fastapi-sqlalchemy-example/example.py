"""Run CRUD examples."""

import asyncio

from src.utils.net import fetch


async def main():
    base_url = "http://localhost:3000/api"

    # create ninja
    response = await fetch(
        url=f"{base_url}/ninja/",
        method="POST",
        headers={"Content-Type": "application/json"},
        payload={"first_name": "Kakashi", "last_name": "Hatake", "age": 27},
    )
    ninja = response["data"]
    if not isinstance(ninja, dict):
        raise RuntimeError()
    print("Ninja insert result:", ninja)

    # get ninja
    response = await fetch(
        url=f"{base_url}/ninja/{ninja['id']}",
        method="GET",
        headers={"Content-Type": "application/json"},
    )
    ninja = response["data"]
    if not isinstance(ninja, dict):
        raise RuntimeError()
    print("Ninja select result:", ninja)

    # update ninja
    response = await fetch(
        url=f"{base_url}/ninja/{ninja['id']}",
        method="PUT",
        headers={"Content-Type": "application/json"},
        payload={
            "first_name": "Kaka",
            "last_name": "Sensei",
        },
    )
    ninja = response["data"]
    if not isinstance(ninja, dict):
        raise RuntimeError()
    print("Ninja update result:", ninja)

    # create jutsu
    response = await fetch(
        url=f"{base_url}/jutsu/",
        method="POST",
        headers={"Content-Type": "application/json"},
        payload={
            "name": "Chidori",
            "chakra_nature": "Lightning",
            "description": "Plover / a thousand birds",
        },
    )
    jutsu = response["data"]
    if not isinstance(jutsu, dict):
        raise RuntimeError()
    print("Jutsu insert result:", jutsu)

    # get jutsu
    response = await fetch(
        url=f"{base_url}/jutsu/{jutsu['id']}",
        method="GET",
        headers={"Content-Type": "application/json"},
    )
    jutsu = response["data"]
    if not isinstance(jutsu, dict):
        raise RuntimeError()
    print("Jutsu select result:", jutsu)

    # update jutsu
    response = await fetch(
        url=f"{base_url}/jutsu/{jutsu['id']}",
        method="PUT",
        headers={"Content-Type": "application/json"},
        payload={"description": "Lightning blade"},
    )
    jutsu = response["data"]
    if not isinstance(jutsu, dict):
        raise RuntimeError()
    print("Jutsu update result:", jutsu)

    # associate ninja & jutsu
    await fetch(
        url=f"{base_url}/ninja/{ninja['id']}/jutsu/{jutsu['id']}",
        method="POST",
        headers={"Content-Type": "application/json"},
    )
    print("Associate ninja & jutsu result: ok")

    # get ninja with jutsus
    response = await fetch(
        url=f"{base_url}/ninja/{ninja['id']}/jutsus",
        method="GET",
        headers={"Content-Type": "application/json"},
    )
    ninja_with_jutsus = response["data"]
    if not isinstance(ninja, dict):
        raise RuntimeError()
    print("Ninja with jutsus result:", ninja_with_jutsus)

    # dissociate ninja & jutsu
    await fetch(
        url=f"{base_url}/ninja/{ninja['id']}/jutsu/{jutsu['id']}",
        method="DELETE",
        headers={"Content-Type": "application/json"},
    )
    print("Associate ninja & jutsu result: ok")

    # get ninja with jutsus (post dissociation)
    response = await fetch(
        url=f"{base_url}/ninja/{ninja['id']}/jutsus",
        method="GET",
        headers={"Content-Type": "application/json"},
    )
    ninja_with_jutsus = response["data"]
    if not isinstance(ninja, dict):
        raise RuntimeError()
    print("Ninja with jutsus result (post dissociation):", ninja_with_jutsus)

    # delete ninja
    response = await fetch(
        url=f"{base_url}/ninja/{ninja['id']}",
        method="DELETE",
        headers={"Content-Type": "application/json"},
    )
    ninja = response["data"]
    if not isinstance(ninja, dict):
        raise RuntimeError()
    print("Ninja delete result:", ninja)

    # delete jutsu
    response = await fetch(
        url=f"{base_url}/jutsu/{jutsu['id']}",
        method="DELETE",
        headers={"Content-Type": "application/json"},
    )
    jutsu = response["data"]
    if not isinstance(jutsu, dict):
        raise RuntimeError()
    print("Jutsu delete result:", jutsu)


asyncio.run(main())
