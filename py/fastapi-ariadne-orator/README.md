# py ariadne fastapi

## setup

- make install
- make migrate

## startup (dev)

- make dev

## startup (prod)

- make run

## todo

- make join/populate logic work
- convert db to async

## tools

- [ariadne](https://ariadnegraphql.org/)
- [starlette](https://www.starlette.io/)
- [fastapi](https://fastapi.tiangolo.com/)
- [orator](https://orator-orm.com/)
- [uvicorn](https://www.uvicorn.org/)
- [arrow](https://arrow.readthedocs.io/en/stable/)

## example queries

graphiql located at `http://localhost:8000/graphql` (or custom port if env var set)

### hello

```graphql
query Hello {
  hello
}
```

### insert ninja

```gql
mutation InsertNinja($ninja: NinjaNew!) {
  insertNinja(ninja: $ninja) {
    id
    first_name
    last_name
  }
}
```

```json
{
  "ninja": {
    "first_name": "Kakashi",
    "last_name": "Hatake"
  }
}
```

### update ninja

```gql
mutation UpdateNinja($id: ID!, $updates: NinjaUpdates!) {
  updateNinja(id: $id, updates: $updates) {
    id
    first_name
    last_name
  }
}
```

```json
{
  "id": 1,
  "updates": {
    "first_name": "Kaka",
    "last_name": "Sensei"
  }
}
```

### delete ninja

```gql
mutation DeleteNinja($id: ID!) {
  deleteNinja(id: $id) {
    id
    first_name
    last_name
  }
}
```

```json
{
  "id": 1
}
```

### insert jutsu

```gql
mutation InsertJutsu($jutsu: JutsuNew!) {
  insertJutsu(jutsu: $jutsu) {
    id
    name
    chakra_nature
    description
  }
}
```

```json
{
  "jutsu": {
    "name": "chidori",
    "chakra_nature": "lightning",
    "description": "lightning blade"
  }
}
```

### update jutsu

```gql
mutation UpdateJutsu($id: ID!, $updates: JutsuUpdates!) {
  updateJutsu(id: $id, updates: $updates) {
    id
    name
    chakra_nature
    description
  }
}
```

```json
{
  "id": 1,
  "updates": {
    "name": "Chidori",
    "chakra_nature": "Lightning",
    "description": "Lightning Blade"
  }
}
```

### delete jutsu

```gql
mutation DeleteJutsu($id: ID!) {
  deleteJutsu(id: $id) {
    id
    name
    chakra_nature
    description
  }
}
```

```json
{
  "id": 1
}
```

### add known jutsu (relation)

```gql
mutation AddKnownJutsu($ninja_id: ID!, $jutsu_id: ID!) {
  addKnownJutsu(ninja_id: $ninja_id, jutsu_id: $jutsu_id) {
    id
    first_name
    last_name
    jutsus {
      id
      name
      chakra_nature
      description
    }
  }
}
```

```json
{
  "ninja_id": 1,
  "jutsu_id": 1
}
```

### get ninja with known jutsu

```gql
query Ninja($id: ID!) {
  ninja(id: $id) {
    id
    first_name
    last_name
    jutsus {
      id
      name
      chakra_nature
      description
    }
  }
}
```

```json
{
  "id": 1
}
```
