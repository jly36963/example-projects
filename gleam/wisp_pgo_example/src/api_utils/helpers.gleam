import api_utils/jutsu as api_jutsu
import api_utils/ninja as api_ninja
import gleam/pgo
import wisp.{type Request, type Response}

pub fn handle_request(req: Request, db: pgo.Connection) -> Response {
  // No "router", just pattern matching on path
  case wisp.path_segments(req) {
    ["api", ..segments] -> use_api_controller(req, db, segments)
    _ -> wisp.not_found()
  }
}

pub fn use_api_controller(req, db, segments) {
  case segments {
    ["ninja", ..segments] -> api_ninja.use_ninja_router(req, db, segments)
    ["jutsu", ..segments] -> api_jutsu.use_jutsu_router(req, db, segments)
    _ -> wisp.not_found()
  }
}
