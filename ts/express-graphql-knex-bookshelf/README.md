# Express

A simple express-graphql app with examples of basic usage, written in TS.

## Setup

- populate `.env` file. template in `dev.env`
- `make install`

## Migrations (dev)

- `make migrate`

## Startup (dev)

- `make dev`

## Startup (prod)

- `make build`
- `make run`

## Useful Notes

- [knex](<https://github.com/jly36963/notes/blob/master/js--db/postgres(knex).js>)
- [ts](https://github.com/jly36963/notes/blob/master/ts/typescript-basics.ts)
- [express-graphql](https://marmelab.com/blog/2017/09/06/dive-into-graphql-part-iii-building-a-graphql-server-with-nodejs.html)

## Example Queries

## graphiql

Go to `localhost:5000/graphql`. (port 5000 is default, can be changed in `.env`)

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
