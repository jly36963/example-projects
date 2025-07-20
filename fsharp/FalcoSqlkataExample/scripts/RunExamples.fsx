#r @"nuget: Newtonsoft.Json"
#r @"nuget: FSharpPlus"
#r @"nuget: System.Text.Json"
#r @"nuget: Flurl.Http"

// ---
// Needed by underlying modules
#r @"nuget: Npgsql"

open Npgsql
// ---

#load "../src/App/Types.fs"
#load "../src/App/Utils.fs"

open System
open Flurl.Http

open Utils
open Types

module NinjaRequests =
    let getNinja (ninjaId: Guid) : Ninja =
        $"http://localhost:3000/ninjas/{ninjaId}" |> _.GetJsonAsync<Ninja>() |> _.Result

    let createNinja (input: NinjaCreateInput) : Guid =
        "http://localhost:3000/ninjas"
        |> _.PostJsonAsync(input)
        |> _.ReceiveJson<{| id: Guid |}>()
        |> _.Result
        |> _.id

    let updateNinja (ninjaId: Guid) (input: NinjaUpdateInput) : unit =
        $"http://localhost:3000/ninjas/{ninjaId}"
        |> _.PatchJsonAsync(input)
        |> _.ReceiveJson<{| message: string |}>()
        |> _.Result
        |> ignore

    let deleteNinja (ninjaId: Guid) : unit =
        $"http://localhost:3000/ninjas/{ninjaId}"
        |> _.DeleteAsync()
        |> _.Result
        |> ignore

module JutsuRequests =
    let getJutsu (jutsuId: Guid) : Jutsu =
        $"http://localhost:3000/jutsus/{jutsuId}" |> _.GetJsonAsync<Jutsu>() |> _.Result

    let createJutsu (input: JutsuCreateInput) : Guid =
        "http://localhost:3000/jutsus"
        |> _.PostJsonAsync(input)
        |> _.ReceiveJson<{| id: Guid |}>()
        |> _.Result
        |> _.id

    let updateJutsu (jutsuId: Guid) (input: JutsuUpdateInput) : unit =
        $"http://localhost:3000/jutsus/{jutsuId}"
        |> _.PatchJsonAsync(input)
        |> _.ReceiveJson<{| message: string |}>()
        |> _.Result
        |> ignore

    let deleteJutsu (jutsuId: Guid) : unit =
        $"http://localhost:3000/jutsus/{jutsuId}"
        |> _.DeleteAsync()
        |> _.Result
        |> ignore


module NinjaJutsuRequests =
    // fr.post "/ninjas/{ninjaId}/jutsus/{jutsuId}" NinjaJutsuHandlers.create
    // fr.delete "/ninjas/{ninjaId}/jutsus/{jutsuId}" NinjaJutsuHandlers.delete
    // fr.get "/ninjas/{ninjaId}/with-jutsus" NinjaJutsuHandlers.get

    let getNinjaWithJutsus (ninjaId: Guid) : NinjaWithJutsus =
        $"http://localhost:3000/ninjas/{ninjaId}/with-jutsus"
        |> _.GetJsonAsync<NinjaWithJutsus>()
        |> _.Result

    let associateNinjaJutsu (ninjaId: Guid) (jutsuId: Guid) : unit =
        $"http://localhost:3000/ninjas/{ninjaId}/jutsus/{jutsuId}"
        |> _.PostJsonAsync({| |})
        |> _.ReceiveJson<{| message: string |}>()
        |> _.Result
        |> ignore

    let dissociateNinjaJutsu (ninjaId: Guid) (jutsuId: Guid) : unit =
        $"http://localhost:3000/ninjas/{ninjaId}/jutsus/{jutsuId}"
        |> _.DeleteAsync()
        |> _.ReceiveJson<{| message: string |}>()
        |> _.Result
        |> ignore


let main () =
    let ninjaId =
        NinjaRequests.createNinja
            {
                first_name = "Kakashi"
                last_name = "Hatake"
                age = 27
            }

    printfn "created ninja"

    let ninja = NinjaRequests.getNinja ninjaId

    printfn "got ninja"

    let ninjaUpdates =
        {
            first_name = Some "Kaka"
            last_name = Some "Sensei"
            age = None
        }

    NinjaRequests.updateNinja ninjaId ninjaUpdates

    printfn "updated ninja"

    let updatedNinja = NinjaRequests.getNinja ninjaId

    printfn "got the updated ninja"

    let jutsuId =
        JutsuRequests.createJutsu
            {
                name = "Chidori"
                chakra_nature = "Lightning"
                description = "Plover / a thousand birds"
            }

    printfn "created jutsu"

    let jutsu = JutsuRequests.getJutsu jutsuId

    printfn "got jutsu"

    let jutsuUpdates =
        {
            name = None
            chakra_nature = None
            description = Some "Lightning blade"
        }

    JutsuRequests.updateJutsu jutsuId jutsuUpdates

    printfn "updated jutsu"

    let updatedJutsu = JutsuRequests.getJutsu jutsuId

    printfn "got the updated jutsu"

    NinjaJutsuRequests.associateNinjaJutsu ninjaId jutsuId
    printfn "associated ninja/jutsu"
    let ninjaWithJutsus = NinjaJutsuRequests.getNinjaWithJutsus ninjaId
    printfn "got ninja with jutsus (after association)"

    NinjaJutsuRequests.dissociateNinjaJutsu ninjaId jutsuId
    printfn "dissociated ninja/jutsu"

    let ninjaWithJutsus2 = NinjaJutsuRequests.getNinjaWithJutsus ninjaId
    printfn "got ninja with jutsus (after dissociation)"

    JutsuRequests.deleteJutsu jutsuId

    printfn "deleted the jutsu"

    NinjaRequests.deleteNinja ninjaId

    printfn "deleted the ninja"

    let results: (string * obj) list =
        [
            "ninjaId", ninjaId
            "ninja", ninja
            "updatedNinja", updatedNinja

            "jutsuId", jutsuId
            "jutsu", jutsu
            "updatedJutsu", updatedJutsu

            "ninjaWithJutsus", ninjaWithJutsus
            "ninjaWithJutsus2", ninjaWithJutsus2

        ]

    printResults results


main ()
