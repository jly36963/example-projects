# gin + mongodb + graphql-go

## todo

- id in responses (ObjectID -> string) ?

## install

```bash
go get go.mongodb.org/mongo-driver/mongo
go get github.com/gin-gonic/gin
go get github.com/graphql-go/handler
go get "github.com/graphql-go/graphql"
go get github.com/mitchellh/mapstructure
# go get github.com/99designs/gqlgen
```

## startup

```bash
# run
make run
# build / run
make build; make run-build
```

## example queries

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
    firstName
    lastName
  }
}
```

```json
{
  "ninja": {
    "firstName": "Kakashi",
    "lastName": "Hatake"
  }
}
```

### update ninja

```gql
mutation UpdateNinja($id: ID!, $updates: NinjaUpdates!) {
  updateNinja(id: $id, updates: $updates) {
    id
    firstName
    lastName
  }
}
```

```json
{
  "id": 1,
  "updates": {
    "firstName": "Kaka",
    "lastName": "Sensei"
  }
}
```

### delete ninja

```gql
mutation DeleteNinja($id: ID!) {
  deleteNinja(id: $id) {
    id
    firstName
    lastName
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
    chakraNature
    description
  }
}
```

```json
{
  "jutsu": {
    "name": "chidori",
    "chakraNature": "lightning",
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
    chakraNature
    description
  }
}
```

```json
{
  "id": 1,
  "updates": {
    "name": "Chidori",
    "chakraNature": "Lightning",
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
    chakraNature
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
mutation AddKnownJutsu($ninjaId: ID!, $jutsuId: ID!) {
  addKnownJutsu(ninjaId: $ninjaId, jutsuId: $jutsuId) {
    id
    firstName
    lastName
    jutsus {
      id
      name
      chakraNature
      description
    }
  }
}
```

```json
{
  "ninjaId": 1,
  "jutsuId": 1
}
```

### get ninja

### get ninja with known jutsu

```gql
query Ninja($id: ID!) {
  ninja(id: $id) {
    id
    firstName
    lastName
  }
}
```

```json
{
  "id": 1
}
```

```gql
query NinjaWithRelatedJutsu($id: ID!) {
  ninjaWithRelatedJutsu(id: $id) {
    id
    firstName
    lastName
    jutsus {
      id
      name
      chakraNature
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
