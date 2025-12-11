
from pprint import pprint
import asyncio
from src.utils.net import fetch

# TODO: replace 'assert' with actual exception raising


async def main():
    base_url = 'http://localhost:3000/api'

    # create ninja
    response = await fetch(
        url=f"{base_url}/ninja/",
        method='POST',
        headers={'Content-Type': 'application/json'},
        payload={
            'first_name': "Kakashi",
            'last_name': "Hatake",
            'age': 27
        }
    )
    ninja = response['data']
    print(ninja)
    assert isinstance(ninja, dict)
    print("Ninja insert result")
    pprint(ninja)

    # get ninja
    response = await fetch(
        url=f"{base_url}/ninja/{ninja['id']}",
        method='GET',
        headers={'Content-Type': 'application/json'},
    )
    ninja = response['data']
    assert isinstance(ninja, dict)
    print("Ninja select result")
    pprint(ninja)

    # update ninja
    response = await fetch(
        url=f"{base_url}/ninja/{ninja['id']}",
        method='PUT',
        headers={'Content-Type': 'application/json'},
        payload={
            'first_name': "Kaka",
            'last_name': "Sensei",
        }
    )
    ninja = response['data']
    assert isinstance(ninja, dict)
    print("Ninja update result")
    pprint(ninja)

    # create jutsu
    response = await fetch(
        url=f"{base_url}/jutsu/",
        method='POST',
        headers={'Content-Type': 'application/json'},
        payload={
            'name': "Chidori",
            'chakra_nature': "Lightning",
            'description': "Plover / a thousand birds"
        }
    )
    jutsu = response['data']
    assert isinstance(jutsu, dict)
    print("Jutsu insert result")
    pprint(jutsu)

    # get jutsu
    response = await fetch(
        url=f"{base_url}/jutsu/{jutsu['id']}",
        method='GET',
        headers={'Content-Type': 'application/json'},
    )
    jutsu = response['data']
    assert isinstance(jutsu, dict)
    print("Jutsu select result")
    pprint(jutsu)

    # update jutsu
    response = await fetch(
        url=f"{base_url}/jutsu/{jutsu['id']}",
        method='PUT',
        headers={'Content-Type': 'application/json'},
        payload={'description': 'Lightning blade'}
    )
    jutsu = response['data']
    assert isinstance(jutsu, dict)
    print("Jutsu update result")
    pprint(jutsu)

    # associate ninja & jutsu
    await fetch(
        url=f"{base_url}/ninja/{ninja['id']}/jutsu/{jutsu['id']}",
        method='POST',
        headers={'Content-Type': 'application/json'},
    )
    print("Associate ninja & jutsu result: ok")

    # get ninja with jutsus
    response = await fetch(
        url=f"{base_url}/ninja/{ninja['id']}/jutsus",
        method='GET',
        headers={'Content-Type': 'application/json'},
    )
    ninja_with_jutsus = response['data']
    assert isinstance(ninja, dict)
    print("Ninja with jutsus result")
    pprint(ninja_with_jutsus)

    # dissociate ninja & jutsu
    await fetch(
        url=f"{base_url}/ninja/{ninja['id']}/jutsu/{jutsu['id']}",
        method='DELETE',
        headers={'Content-Type': 'application/json'},
    )
    print("Associate ninja & jutsu result: ok")

    # get ninja with jutsus (post dissociation)
    response = await fetch(
        url=f"{base_url}/ninja/{ninja['id']}/jutsus",
        method='GET',
        headers={'Content-Type': 'application/json'},
    )
    ninja_with_jutsus = response['data']
    assert isinstance(ninja, dict)
    print("Ninja with jutsus result (post dissociation)")
    pprint(ninja_with_jutsus)

    # delete ninja
    response = await fetch(
        url=f"{base_url}/ninja/{ninja['id']}",
        method='DELETE',
        headers={'Content-Type': 'application/json'},
    )
    ninja = response['data']
    assert isinstance(ninja, dict)
    print("Ninja delete result")
    pprint(ninja)

    # delete jutsu
    response = await fetch(
        url=f"{base_url}/jutsu/{jutsu['id']}",
        method='DELETE',
        headers={'Content-Type': 'application/json'},
    )
    jutsu = response['data']
    assert isinstance(jutsu, dict)
    print("Jutsu delete result")
    pprint(jutsu)


asyncio.run(main())
