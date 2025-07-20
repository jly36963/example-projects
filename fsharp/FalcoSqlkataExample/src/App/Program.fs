module BasicRestApi

open Falco
open Microsoft.AspNetCore.Builder
open Microsoft.Extensions.DependencyInjection
open FSharpPlus
open Npgsql
open SqlKata.Compilers
open SqlKata.Execution
open Microsoft.AspNetCore.Http
open Microsoft.AspNetCore.Hosting

open Types
open Utils
open Providers

module fr = Falco.Routing

// ---
// Constants
// ---

let PG_URL = "postgresql://postgres:postgres@localhost:5432/practice"

// ---
// App
// ---

module FmtRes =
    let ok (ctx: HttpContext) =
        ctx |> Response.withStatusCode 200 |> Response.ofJson {| message = "Ok" |}

    let badRequest (ctx: HttpContext) (message: string) =
        ctx |> Response.withStatusCode 404 |> Response.ofJson {| message = message |}

    let notFound (ctx: HttpContext) =
        ctx
        |> Response.withStatusCode 404
        |> Response.ofJson {| message = "Not Found" |}

    let internalError (ctx: HttpContext) (ex: System.Exception) =
        printfn "Internal Error:\n%A" ex

        ctx
        |> Response.withStatusCode 500
        |> Response.ofJson {| message = "Not Found" |}


module ErrorMiddleware =
    let notFound: HttpHandler =
        Response.withStatusCode 404 >> Response.ofJson {| message = "Not Found" |}

    let serverException: HttpHandler =
        Response.withStatusCode 500 >> Response.ofJson {| message = "Server Error" |}

module NinjaHandlers =
    let create: HttpHandler =
        fun ctx ->
            task {
                let db = ctx.RequestServices.GetService<QueryFactory>()
                let! input = Request.getJson<NinjaCreateInput> ctx

                let res =
                    input
                    |> ninjaCreate db
                    |> Result.map (fun ninjaId -> ctx |> Response.ofJson {| id = ninjaId |})
                    |> Result.mapError (FmtRes.internalError ctx)

                return res
            }

    let get: HttpHandler =
        fun ctx ->
            task {
                let db = ctx.RequestServices.GetService<QueryFactory>()
                let route = Request.getRoute ctx
                let ninjaId = route?ninjaId.AsString() |> parseGuid

                let res =
                    ninjaId
                    |> Option.toResult
                    |> Result.mapError (fun _ -> FmtRes.badRequest ctx "Could not parse uuid")
                    |> Result.bind (fun nid ->
                        nid
                        |> ninjaGet db
                        |> Result.mapError (fun ex -> FmtRes.internalError ctx ex))
                    |> Result.bind (fun mn ->
                        mn |> Option.toResult |> Result.mapError (fun _ -> FmtRes.notFound ctx))
                    |> Result.map (fun n -> ctx |> Response.ofJson n)

                return res
            }

    let update: HttpHandler =
        fun ctx ->
            task {
                let db = ctx.RequestServices.GetService<QueryFactory>()
                let route = Request.getRoute ctx
                let ninjaId = route?ninjaId.AsString() |> parseGuid
                let! input = Request.getJson<NinjaUpdateInput> ctx

                let res =
                    ninjaId
                    |> Option.toResult
                    |> Result.mapError (fun _ -> FmtRes.badRequest ctx "Could not parse uuid")
                    |> Result.bind (fun nid ->
                        ninjaUpdate db nid input
                        |> Result.mapError (fun ex -> FmtRes.internalError ctx ex))
                    |> Result.map (fun _ -> FmtRes.ok ctx)

                return res
            }

    let delete: HttpHandler =
        fun ctx ->
            task {
                let db = ctx.RequestServices.GetService<QueryFactory>()
                let route = Request.getRoute ctx
                let ninjaId = route?ninjaId.AsString() |> parseGuid

                let res =
                    ninjaId
                    |> Option.toResult
                    |> Result.mapError (fun _ -> FmtRes.badRequest ctx "Could not parse uuid")
                    |> Result.bind (fun nid ->
                        nid
                        |> ninjaDelete db
                        |> Result.mapError (fun ex -> FmtRes.internalError ctx ex))
                    |> Result.map (fun _ -> FmtRes.ok ctx)

                return res
            }

module JutsuHandlers =
    let create: HttpHandler =
        fun ctx ->
            task {
                let db = ctx.RequestServices.GetService<QueryFactory>()
                let! input = Request.getJson<JutsuCreateInput> ctx

                let res =
                    input
                    |> jutsuCreate db
                    |> Result.mapError (fun ex -> FmtRes.internalError ctx ex)
                    |> Result.map (fun jid -> ctx |> Response.ofJson {| id = jid |})

                return res
            }

    let get: HttpHandler =
        fun ctx ->
            task {
                let db = ctx.RequestServices.GetService<QueryFactory>()
                let route = Request.getRoute ctx
                let jutsuId = route?jutsuId.AsString() |> parseGuid

                let res =
                    jutsuId
                    |> Option.toResult
                    |> Result.mapError (fun _ -> FmtRes.badRequest ctx "Could not parse uuid")
                    |> Result.bind (fun jid ->
                        jid
                        |> jutsuGet db
                        |> Result.mapError (fun ex -> FmtRes.internalError ctx ex))
                    |> Result.bind (fun mj ->
                        mj |> Option.toResult |> Result.mapError (fun _ -> FmtRes.notFound ctx))
                    |> Result.map (fun j -> ctx |> Response.ofJson j)

                return res
            }

    let update: HttpHandler =
        fun ctx ->
            task {
                let db = ctx.RequestServices.GetService<QueryFactory>()
                let route = Request.getRoute ctx
                let jutsuId = route?jutsuId.AsString() |> parseGuid
                let! input = Request.getJson<JutsuUpdateInput> ctx

                let res =
                    jutsuId
                    |> Option.toResult
                    |> Result.mapError (fun _ -> FmtRes.badRequest ctx "Could not parse uuid")
                    |> Result.bind (fun jid ->
                        jutsuUpdate db jid input
                        |> Result.mapError (fun ex -> FmtRes.internalError ctx ex))
                    |> Result.map (fun _ -> FmtRes.ok ctx)

                return res
            }

    let delete: HttpHandler =
        fun ctx ->
            task {
                let db = ctx.RequestServices.GetService<QueryFactory>()
                let route = Request.getRoute ctx
                let jutsuId = route?jutsuId.AsString() |> parseGuid

                let res =
                    jutsuId
                    |> Option.toResult
                    |> Result.mapError (fun _ -> FmtRes.badRequest ctx "Could not parse uuid")
                    |> Result.bind (fun jid ->
                        jid
                        |> jutsuDelete db
                        |> Result.mapError (fun ex -> FmtRes.internalError ctx ex))
                    |> Result.map (fun _ -> FmtRes.ok ctx)

                return res
            }

module NinjaJutsuHandlers =

    let get: HttpHandler =
        fun ctx ->
            task {
                let db = ctx.RequestServices.GetService<QueryFactory>()
                let route = Request.getRoute ctx
                let ninjaId = route?ninjaId.AsString() |> parseGuid

                let res =
                    ninjaId
                    |> Option.toResult
                    |> Result.mapError (fun _ -> FmtRes.badRequest ctx "Could not parse uuid")
                    |> Result.bind (fun jid ->
                        jid
                        |> ninjaJutsusGet db
                        |> Result.mapError (fun ex -> FmtRes.internalError ctx ex))
                    |> Result.bind (fun mn ->
                        mn |> Option.toResult |> Result.mapError (fun _ -> FmtRes.notFound ctx))
                    |> Result.map (fun n -> ctx |> Response.ofJson n)

                return res
            }

    let create: HttpHandler =
        fun ctx ->
            task {
                let db = ctx.RequestServices.GetService<QueryFactory>()
                let route = Request.getRoute ctx
                let ninjaId = route?ninjaId.AsString() |> parseGuid
                let jutsuId = route?jutsuId.AsString() |> parseGuid

                let res =
                    (ninjaId, jutsuId)
                    |> fun (nid, jid) -> Option.zip nid jid
                    |> Option.toResult
                    |> Result.mapError (fun _ -> FmtRes.badRequest ctx "Could not parse uuid")
                    |> Result.bind (fun (nid, jid) ->
                        ninjaJutsuAssociate db nid jid
                        |> Result.mapError (fun ex -> FmtRes.internalError ctx ex))
                    |> Result.map (fun jid -> ctx |> Response.ofJson {| id = jid |})

                return res
            }




    let delete: HttpHandler =
        fun ctx ->
            task {
                let db = ctx.RequestServices.GetService<QueryFactory>()
                let route = Request.getRoute ctx
                let ninjaId = route?ninjaId.AsString() |> parseGuid
                let jutsuId = route?jutsuId.AsString() |> parseGuid

                let res =
                    (ninjaId, jutsuId)
                    |> fun (nid, jid) -> Option.zip nid jid
                    |> Option.toResult
                    |> Result.mapError (fun _ -> FmtRes.badRequest ctx "Could not parse uuid")
                    |> Result.bind (fun (nid, jid) ->
                        ninjaJutsuDissociate db nid jid
                        |> Result.mapError (fun ex -> FmtRes.internalError ctx ex))
                    |> Result.map (fun _ -> FmtRes.ok ctx)

                return res
            }


module App =
    let endpoints =
        [
            fr.post "/ninjas" NinjaHandlers.create
            fr.get "/ninjas/{ninjaId}" NinjaHandlers.get
            fr.patch "/ninjas/{ninjaId}" NinjaHandlers.update
            fr.delete "/ninjas/{ninjaId}" NinjaHandlers.delete

            fr.post "/jutsus" JutsuHandlers.create
            fr.get "/jutsus/{jutsuId}" JutsuHandlers.get
            fr.patch "/jutsus/{jutsuId}" JutsuHandlers.update
            fr.delete "/jutsus/{jutsuId}" JutsuHandlers.delete

            fr.post "/ninjas/{ninjaId}/jutsus/{jutsuId}" NinjaJutsuHandlers.create
            fr.delete "/ninjas/{ninjaId}/jutsus/{jutsuId}" NinjaJutsuHandlers.delete
            fr.get "/ninjas/{ninjaId}/with-jutsus" NinjaJutsuHandlers.get

        ]

// ---
// Main
// ---

[<EntryPoint>]
let main args =
    let connString = convertUrlConnString PG_URL
    let connection = new NpgsqlConnection(connString)
    let compiler = new PostgresCompiler()
    let db = new QueryFactory(connection, compiler)

    let bldr = WebApplication.CreateBuilder(args)
    bldr.Services.AddAntiforgery().AddSingleton<QueryFactory>(db) |> ignore

    bldr.WebHost.ConfigureKestrel(fun options ->
        options.ListenAnyIP(3000) // Change to whatever port you want
        ())
    |> ignore

    let wapp = bldr.Build()
    let isDevelopment = wapp.Environment.EnvironmentName = "Development"

    wapp
        .UseIf(isDevelopment, DeveloperExceptionPageExtensions.UseDeveloperExceptionPage)
        .UseIf(
            not (isDevelopment),
            FalcoExtensions.UseFalcoExceptionHandler ErrorMiddleware.serverException
        )
        .UseRouting()
        .UseFalco(App.endpoints)
        .Run(ErrorMiddleware.notFound)

    0
