import gleam/hackney
import gleam/http
import gleam/http/request
import gleam/http/response
import gleam/int
import gleam/io
import gleam/json
import gleam/option.{None, Some}
import gleam/order
import gleam/result
import gleam/string.{inspect}
import snag
import snag_utils.{snag_try}
import types/jutsu.{Jutsu, JutsuUpdates, jutsu_json_encode}
import types/ninja.{Ninja, NinjaUpdates, ninja_json_encode}
import youid/uuid

const base_url = "http://localhost:3000/api"

pub fn fetch(method method, url url, query query, payload payload) {
  use request <- snag_try(request.to(url), "idk")
  use response <- snag_try(
    request
      |> request.prepend_header("Content-Type", "application/json")
      |> request.set_method(method)
      |> fn(r) {
        case payload {
          Some(v) -> request.set_body(r, v)
          None -> r
        }
      }
      |> fn(r) {
        case query {
          Some(v) -> request.set_query(r, v)
          None -> r
        }
      }
      |> hackney.send,
    "Failed to fetch",
  )
  Ok(response)
}

pub fn raise_for_status(response: response.Response(a)) {
  case int.compare(response.status, 400) {
    order.Gt | order.Eq -> {
      let message =
        "Response failed with status "
        <> int.to_string(response.status)
        <> "\n"
        <> inspect(response.body)
      Error(snag.new(message))
    }
    order.Lt -> Ok(response)
  }
}

pub fn run_examples() {
  // Create ninja
  use ninja_new <- result.try({
    use response <- snag_try(
      fetch(
        method: http.Post,
        url: base_url <> "/ninja",
        query: None,
        payload: Some(
          Ninja(
            id: uuid.v4_string(),
            first_name: "Kakashi",
            last_name: "Hatake",
            age: 27,
            jutsus: None,
            created_at: None,
            updated_at: None,
          )
          |> ninja_json_encode
          |> json.to_string,
        ),
      ),
      "Failed to create ninja",
    )
    use _ <- result.try(raise_for_status(response))
    use ninja <- snag_try(
      ninja.ninja_json_decode(response.body),
      "Couldn't parse ninja",
    )
    Ok(ninja)
  })
  io.println("\n")
  io.println("ninja_new: " <> ninja_new |> ninja_json_encode |> json.to_string)

  // Get ninja
  use ninja <- result.try({
    use response <- snag_try(
      fetch(
        method: http.Get,
        url: base_url <> "/ninja/" <> ninja_new.id,
        query: None,
        payload: None,
      ),
      "Failed to get ninja",
    )
    use _ <- result.try(raise_for_status(response))
    use ninja <- snag_try(
      ninja.ninja_json_decode(response.body),
      "Couldn't parse ninja",
    )
    Ok(ninja)
  })
  io.println("\n")
  io.println("ninja: " <> ninja |> ninja_json_encode |> json.to_string)

  // Update ninja
  use ninja_updated <- result.try({
    use response <- snag_try(
      fetch(
        method: http.Put,
        url: base_url <> "/ninja/" <> ninja_new.id,
        query: None,
        payload: Some(
          NinjaUpdates(
            first_name: Some("Kaka"),
            last_name: Some("Sensei"),
            age: None,
          )
          |> ninja.ninja_update_json_encode
          |> json.to_string,
        ),
      ),
      "Failed to update ninja",
    )
    use _ <- result.try(raise_for_status(response))
    use ninja <- snag_try(
      ninja.ninja_json_decode(response.body),
      "Couldn't parse ninja",
    )
    Ok(ninja)
  })
  io.println("\n")
  io.println(
    "ninja_updated: " <> ninja_updated |> ninja_json_encode |> json.to_string,
  )
  // Create jutsu
  use jutsu_new <- result.try({
    use response <- snag_try(
      fetch(
        method: http.Post,
        url: base_url <> "/jutsu",
        query: None,
        payload: Some(
          Jutsu(
            id: uuid.v4_string(),
            name: "Chidori",
            chakra_nature: "Lightning",
            description: "Plover / One thousand birds",
            created_at: None,
            updated_at: None,
          )
          |> jutsu_json_encode
          |> json.to_string,
        ),
      ),
      "Failed to create jutsu",
    )
    use _ <- result.try(raise_for_status(response))
    use jutsu <- snag_try(
      jutsu.jutsu_json_decode(response.body),
      "Couldn't parse jutsu",
    )
    Ok(jutsu)
  })
  io.println("\n")
  io.println("jutsu_new: " <> jutsu_new |> jutsu_json_encode |> json.to_string)

  // Get jutsu
  use jutsu <- result.try({
    use response <- snag_try(
      fetch(
        method: http.Get,
        url: base_url <> "/jutsu/" <> jutsu_new.id,
        query: None,
        payload: None,
      ),
      "Failed to get jutsu",
    )
    use _ <- result.try(raise_for_status(response))
    use jutsu <- snag_try(
      jutsu.jutsu_json_decode(response.body),
      "Couldn't parse jutsu",
    )
    Ok(jutsu)
  })
  io.println("\n")
  io.println("jutsu: " <> jutsu |> jutsu_json_encode |> json.to_string)

  // Update jutsu
  use jutsu_updated <- result.try({
    use response <- snag_try(
      fetch(
        method: http.Put,
        url: base_url <> "/jutsu/" <> jutsu_new.id,
        query: None,
        payload: Some(
          JutsuUpdates(
            name: None,
            chakra_nature: None,
            description: Some("Lightning blade"),
          )
          |> jutsu.jutsu_update_json_encode
          |> json.to_string,
        ),
      ),
      "Failed to update jutsu",
    )
    use _ <- result.try(raise_for_status(response))
    use jutsu <- snag_try(
      jutsu.jutsu_json_decode(response.body),
      "Couldn't parse jutsu",
    )
    Ok(jutsu)
  })
  io.println("\n")
  io.println(
    "jutsu_updated: " <> jutsu_updated |> jutsu_json_encode |> json.to_string,
  )

  // Associate ninja/jutsu
  use _ <- result.try({
    use response <- snag_try(
      fetch(
        method: http.Post,
        url: base_url <> "/ninja/" <> ninja.id <> "/jutsu/" <> jutsu.id,
        query: None,
        payload: None,
      ),
      "Failed to associate ninja/jutsu",
    )
    use _ <- result.try(raise_for_status(response))
    Ok(Nil)
  })
  io.println("\n")
  io.println("ninja_add_jutsu result: Success")

  // Get ninja with jutsus
  use ninja_with_jutsus <- result.try({
    use response <- snag_try(
      fetch(
        method: http.Get,
        url: base_url <> "/ninja/" <> ninja_new.id <> "/jutsus",
        query: None,
        payload: None,
      ),
      "Failed to get ninja",
    )
    use _ <- result.try(raise_for_status(response))
    use ninja <- snag_try(
      ninja.ninja_json_decode(response.body),
      "Couldn't parse ninja",
    )
    Ok(ninja)
  })
  io.println("\n")
  io.println(
    "ninja_with_jutsus (after association): "
    <> ninja_with_jutsus |> ninja_json_encode |> json.to_string,
  )

  // Dissociate ninja/jutsu
  use _ <- result.try({
    use response <- snag_try(
      fetch(
        method: http.Delete,
        url: base_url <> "/ninja/" <> ninja.id <> "/jutsu/" <> jutsu.id,
        query: None,
        payload: None,
      ),
      "Failed to dissociate ninja/jutsu",
    )
    use _ <- result.try(raise_for_status(response))
    Ok(Nil)
  })
  io.println("\n")
  io.println("ninja_remove_jutsu result: Success")

  // Get ninja with jutsus
  use ninja_with_jutsus <- result.try({
    use response <- snag_try(
      fetch(
        method: http.Get,
        url: base_url <> "/ninja/" <> ninja_new.id <> "/jutsus",
        query: None,
        payload: None,
      ),
      "Failed to get ninja",
    )
    use _ <- result.try(raise_for_status(response))
    use ninja <- snag_try(
      ninja.ninja_json_decode(response.body),
      "Couldn't parse ninja",
    )
    Ok(ninja)
  })
  io.println("\n")
  io.println(
    "ninja_with_jutsus (after dissociation): "
    <> ninja_with_jutsus |> ninja_json_encode |> json.to_string,
  )

  // Delete jutsu
  use jutsu_deleted <- result.try({
    use response <- snag_try(
      fetch(
        method: http.Delete,
        url: base_url <> "/jutsu/" <> jutsu.id,
        query: None,
        payload: None,
      ),
      "Failed to delete jutsu",
    )
    use _ <- result.try(raise_for_status(response))
    use jutsu <- snag_try(
      jutsu.jutsu_json_decode(response.body),
      "Couldn't parse jutsu",
    )
    Ok(jutsu)
  })
  io.println("\n")
  io.println(
    "jutsu_deleted: " <> jutsu_deleted |> jutsu_json_encode |> json.to_string,
  )

  // Delete ninja
  use ninja_deleted <- result.try({
    use response <- snag_try(
      fetch(
        method: http.Delete,
        url: base_url <> "/ninja/" <> ninja.id,
        query: None,
        payload: None,
      ),
      "Failed to delete ninja",
    )
    use _ <- result.try(raise_for_status(response))
    use ninja <- snag_try(
      ninja.ninja_json_decode(response.body),
      "Couldn't parse ninja",
    )
    Ok(ninja)
  })
  io.println("\n")
  io.println(
    "ninja_deleted: " <> ninja_deleted |> ninja_json_encode |> json.to_string,
  )

  Ok(Nil)
}

pub fn main() {
  let res = run_examples()
  case res {
    Ok(_) -> io.println("Success")
    Error(e) -> e |> string.inspect |> io.println
  }
}
