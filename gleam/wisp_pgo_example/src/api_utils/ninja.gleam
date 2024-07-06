import gleam/http
import gleam/json
import pg_utils/ninjas as pg_ninjas
import pg_utils/ninjas_jutsus as pg_ninjas_jutsus
import snag_utils.{snag_try}
import types/ninja as types_ninja
import wisp.{type Request}

pub fn use_ninja_router(req: Request, db, path_segments) {
  // req.method: gleam/http.{type Method}
  case path_segments, req.method {
    [], http.Post -> ninja_insert_handler(req, db)
    [id], http.Get -> ninja_get_handler(req, db, id)
    [id], http.Put -> ninja_update_handler(req, db, id)
    [id], http.Delete -> ninja_delete_handler(req, db, id)
    [id, "jutsus"], http.Get -> get_ninja_with_jutsus_handler(req, db, id)
    [ninja_id, "jutsu", jutsu_id], http.Post ->
      ninja_associate_jutsu_handler(req, db, ninja_id, jutsu_id)
    [ninja_id, "jutsu", jutsu_id], http.Delete ->
      ninja_dissociate_jutsu_handler(req, db, ninja_id, jutsu_id)
    _, _ -> wisp.not_found()
  }
}

pub fn ninja_insert_handler(req, db) {
  use json_data <- wisp.require_json(req)
  let result = {
    let decoder = types_ninja.get_ninja_json_decoder()
    use ninja_new <- snag_try(decoder(json_data), "Couldn't parse json")
    use ninja <- snag_try(
      pg_ninjas.insert(db, ninja_new),
      "Error while inserting ninja",
    )
    Ok(json.to_string_builder(types_ninja.ninja_json_encode(ninja)))
  }
  case result {
    Ok(data) -> wisp.json_response(data, 200)
    Error(_) -> wisp.bad_request()
  }
}

pub fn ninja_get_handler(_req, db, id) {
  let result = {
    use ninja <- snag_try(pg_ninjas.get(db, id), "Error while getting ninja")
    Ok(json.to_string_builder(types_ninja.ninja_json_encode(ninja)))
  }
  case result {
    Ok(data) -> wisp.json_response(data, 200)
    Error(_) -> wisp.bad_request()
  }
}

pub fn ninja_update_handler(req, db, id) {
  use json_data <- wisp.require_json(req)
  let result = {
    let decoder = types_ninja.get_ninja_update_json_decoder()
    use ninja_new <- snag_try(decoder(json_data), "Couldn't parse json")
    use ninja <- snag_try(
      pg_ninjas.update(db, id, ninja_new),
      "Error while updating ninja",
    )
    Ok(json.to_string_builder(types_ninja.ninja_json_encode(ninja)))
  }
  case result {
    Ok(data) -> wisp.json_response(data, 200)
    Error(_) -> wisp.bad_request()
  }
}

pub fn ninja_delete_handler(_req, db, id) {
  let result = {
    use ninja <- snag_try(
      pg_ninjas.delete(db, id),
      "Error while deleting ninja",
    )
    Ok(json.to_string_builder(types_ninja.ninja_json_encode(ninja)))
  }
  case result {
    Ok(data) -> wisp.json_response(data, 200)
    Error(_) -> wisp.bad_request()
  }
}

pub fn get_ninja_with_jutsus_handler(_req, db, id) {
  let result = {
    use ninja <- snag_try(
      pg_ninjas_jutsus.ninja_get_with_jutsus(db, id),
      "Error while getting ninja",
    )
    Ok(json.to_string_builder(types_ninja.ninja_json_encode(ninja)))
  }
  case result {
    Ok(data) -> wisp.json_response(data, 200)
    Error(_) -> wisp.bad_request()
  }
}

pub fn ninja_associate_jutsu_handler(_req, db, ninja_id, jutsu_id) {
  let result = {
    use _ <- snag_try(
      pg_ninjas_jutsus.associate_ninja_jutsu(db, ninja_id, jutsu_id),
      "Error while associating ninja/jutsu",
    )
    Ok(Nil)
  }
  case result {
    Ok(_) -> wisp.no_content()
    Error(_) -> wisp.bad_request()
  }
}

pub fn ninja_dissociate_jutsu_handler(_req, db, ninja_id, jutsu_id) {
  let result = {
    use _ <- snag_try(
      pg_ninjas_jutsus.dissociate_ninja_jutsu(db, ninja_id, jutsu_id),
      "Error while dissociating ninja/jutsu",
    )
    Ok(Nil)
  }
  case result {
    Ok(_) -> wisp.no_content()
    Error(_) -> wisp.bad_request()
  }
}
