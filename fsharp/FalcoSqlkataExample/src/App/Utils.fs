module Utils

open Npgsql
open System

/// Get the type name of a value
let getTypeName v : obj =
    if v = null then "<null>" else v.GetType().Name

/// Text format a (potentially-boxed) value
let pretty value =
    match tryUnbox value with
    | Some unboxed -> sprintf "%A" unboxed
    | None -> sprintf "%A" value

let printResults (results: (string * obj) list) =
    for k, v in results do
        let typeName = getTypeName v
        let value = pretty v
        System.Console.WriteLine $"{k}\n{typeName}\n{value}\n"

/// For an optional value, only set the k/v if the value is Some
let maybeAdd k v map =
    match v with
    | Some v -> Map.add k v map
    | None -> map

let parseGuid (input: string) : Guid option =
    match Guid.TryParse input with
    | true, guid -> Some guid
    | false, _ -> None

/// Given a URL connection string, convert to dotnet format
let convertUrlConnString url =
    let uri = Uri(url)
    let userInfo = uri.UserInfo.Split ':'

    let username, password =
        match userInfo with
        | [| u; p |] -> u, p
        | _ -> failwith "Url must have username and password."

    let host = uri.Host
    let port = uri.Port
    let database = uri.AbsolutePath.TrimStart '/'

    let mutable builder = new NpgsqlConnectionStringBuilder()
    builder.Host <- host
    builder.Port <- port
    builder.Username <- username
    builder.Password <- password
    builder.Database <- database

    builder.ConnectionString
