module Types

open System

[<CLIMutable>]
type Ninja =
    {
        id: Guid
        first_name: string
        last_name: string
        age: int
        created_at: DateTime
        updated_at: DateTime option
    }

[<CLIMutable>]
type NinjaCreateInput =
    {
        first_name: string
        last_name: string
        age: int
    }

[<CLIMutable>]
type NinjaUpdateInput =
    {
        first_name: string option
        last_name: string option
        age: int option
    }

[<CLIMutable>]
type Jutsu =
    {
        id: Guid
        name: string
        chakra_nature: string
        description: string
        created_at: DateTime
        updated_at: DateTime option
    }

[<CLIMutable>]
type JutsuCreateInput =
    {
        name: string
        chakra_nature: string
        description: string
    }

[<CLIMutable>]
type JutsuUpdateInput =
    {
        name: string option
        chakra_nature: string option
        description: string option
    }

[<CLIMutable>]
type NinjaWithJutsus =
    {
        id: Guid
        first_name: string
        last_name: string
        age: int
        created_at: DateTime
        updated_at: DateTime option
        jutsus: Jutsu list option
    }
