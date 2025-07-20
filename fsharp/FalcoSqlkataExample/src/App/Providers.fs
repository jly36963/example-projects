module Providers

open SqlKata
open SqlKata.Execution
open System

open Types
open Utils

// ---
// Providers
// ---

let ninjaCreate (db: QueryFactory) (input: NinjaCreateInput) : Result<Guid, Exception> =
    try
        let id = Guid.NewGuid()
        {| input with id = id |} |> db.Query("ninjas").Insert |> ignore
        Ok id
    with ex ->
        Error ex


let ninjaGet (db: QueryFactory) (ninjaId: Guid) : Result<Option<Ninja>, Exception> =
    try
        db.Query("ninjas").Where("id", "=", ninjaId).Get<Ninja>() |> Seq.tryHead |> Ok
    with ex ->
        Error ex

let ninjaUpdate (db: QueryFactory) (id: Guid) (input: NinjaUpdateInput) : Result<int, Exception> =
    try
        let updates: Map<string, objnull> =
            Map.empty
            |> fun m -> maybeAdd "first_name" (Option.map box input.first_name) m
            |> fun m -> maybeAdd "last_name" (Option.map box input.last_name) m
            |> fun m -> maybeAdd "age" (Option.map box input.age) m

        let updateCount = db.Query("ninjas").Where("id", "=", id).Update(updates)
        Ok updateCount
    with ex ->
        Error ex

let ninjaDelete (db: QueryFactory) (id: Guid) : Result<int, Exception> =
    try
        let count = db.Query("ninjas").Where("id", "=", id).Delete()
        Ok count
    with ex ->
        Error ex

let jutsuCreate (db: QueryFactory) (input: JutsuCreateInput) : Result<Guid, Exception> =
    try
        let id = Guid.NewGuid()
        {| input with id = id |} |> db.Query("jutsus").Insert |> ignore
        Ok id
    with ex ->
        Error ex


let jutsuGet (db: QueryFactory) (jutsuId: Guid) : Result<Option<Jutsu>, Exception> =
    try
        db.Query("jutsus").Where("id", "=", jutsuId).Get<Jutsu>() |> Seq.tryHead |> Ok
    with ex ->
        Error ex

let jutsuUpdate (db: QueryFactory) (id: Guid) (input: JutsuUpdateInput) : Result<int, Exception> =
    try
        let updates: Map<string, objnull> =
            Map.empty
            |> fun m -> maybeAdd "name" (Option.map box input.name) m
            |> fun m -> maybeAdd "description" (Option.map box input.description) m
            |> fun m -> maybeAdd "chakra_nature" (Option.map box input.chakra_nature) m

        let count = db.Query("jutsus").Where("id", "=", id).Update(updates)
        Ok count
    with ex ->
        Error ex

let jutsuDelete (db: QueryFactory) (id: Guid) : Result<int, Exception> =
    try
        let count = db.Query("jutsus").Where("id", "=", id).Delete()
        Ok count
    with ex ->
        Error ex

let ninjaJutsuAssociate
    (db: QueryFactory)
    (ninjaId: Guid)
    (jutsuId: Guid)
    : Result<unit, Exception> =
    try
        let row =
            {|
                id = Guid.NewGuid()
                ninja_id = ninjaId
                jutsu_id = jutsuId
            |}

        row |> db.Query("ninjas_jutsus").Insert |> ignore
        Ok()
    with ex ->
        Error ex

let ninjaJutsuDissociate
    (db: QueryFactory)
    (ninjaId: Guid)
    (jutsuId: Guid)
    : Result<unit, Exception> =
    try
        db
            .Query("ninjas_jutsus")
            .Where("ninja_id", "=", ninjaId)
            .Where("jutsu_id", "=", jutsuId)
            .Delete()
        |> ignore

        Ok()
    with ex ->
        Error ex


let ninjaJutsusGet (db: QueryFactory) (ninjaId: Guid) : Result<Option<NinjaWithJutsus>, Exception> =
    try
        db.Query("ninjas").Where("id", "=", ninjaId).Get<NinjaWithJutsus>()
        |> Seq.tryHead
        |> Option.map (fun n ->
            let qb = Query("ninjas_jutsus").Select("jutsu_id").Where("ninja_id", ninjaId)
            let jutsus = db.Query("jutsus").WhereIn("id", qb).Get<Jutsu>() |> Seq.toList
            { n with jutsus = Some jutsus })
        |> Ok
    with ex ->
        Error ex
