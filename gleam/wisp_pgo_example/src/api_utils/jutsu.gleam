import gleam/http
import gleam/json
import pg_utils/jutsus as pg_jutsus
import snag_utils.{snag_try}
import types/jutsu as types_jutsu
import wisp.{type Request}

pub fn use_jutsu_router(req: Request, db, path_segments) {
  case path_segments, req.method {
    [], http.Post -> jutsu_insert_handler(req, db)
    [id], http.Get -> jutsu_get_handler(req, db, id)
    [id], http.Put -> jutsu_update_handler(req, db, id)
    [id], http.Delete -> jutsu_delete_handler(req, db, id)
    _, _ -> wisp.not_found()
  }
}

pub fn jutsu_insert_handler(req, db) {
  use json_data <- wisp.require_json(req)
  let result = {
    let decoder = types_jutsu.get_jutsu_json_decoder()
    use jutsu_new <- snag_try(decoder(json_data), "Couldn't parse json")
    use jutsu <- snag_try(
      pg_jutsus.insert(db, jutsu_new),
      "Error while inserting jutsu",
    )
    Ok(json.to_string_builder(types_jutsu.jutsu_json_encode(jutsu)))
  }
  case result {
    Ok(data) -> wisp.json_response(data, 200)
    Error(_) -> wisp.bad_request()
  }
}

pub fn jutsu_get_handler(_req, db, id) {
  let result = {
    use jutsu <- snag_try(pg_jutsus.get(db, id), "Error while getting jutsu")
    Ok(json.to_string_builder(types_jutsu.jutsu_json_encode(jutsu)))
  }
  case result {
    Ok(data) -> wisp.json_response(data, 200)
    Error(_) -> wisp.bad_request()
  }
}

pub fn jutsu_update_handler(req, db, id) {
  use json_data <- wisp.require_json(req)
  let result = {
    let decoder = types_jutsu.get_jutsu_update_json_decoder()
    use jutsu_new <- snag_try(decoder(json_data), "Couldn't parse json")
    use jutsu <- snag_try(
      pg_jutsus.update(db, id, jutsu_new),
      "Error while updating jutsu",
    )
    Ok(json.to_string_builder(types_jutsu.jutsu_json_encode(jutsu)))
  }
  case result {
    Ok(data) -> wisp.json_response(data, 200)
    Error(_) -> wisp.bad_request()
  }
}

pub fn jutsu_delete_handler(_req, db, id) {
  let result = {
    use jutsu <- snag_try(
      pg_jutsus.delete(db, id),
      "Error while deleting jutsu",
    )
    Ok(json.to_string_builder(types_jutsu.jutsu_json_encode(jutsu)))
  }
  case result {
    Ok(data) -> wisp.json_response(data, 200)
    Error(_) -> wisp.bad_request()
  }
}
