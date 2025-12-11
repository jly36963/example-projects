import api_utils/helpers as api_helpers
import gleam/erlang/process
import mist
import pg_utils/helpers as pg_helpers
import wisp
import wisp/wisp_mist

pub fn main() {
  wisp.configure_logger()
  let secret_key_base = wisp.random_string(64)

  let db =
    pg_helpers.get_client(
      host: "localhost",
      port: 5432,
      database: "practice",
      user: "postgres",
      password: "postgres",
    )

  let handler = api_helpers.handle_request(_, db)

  let assert Ok(_) =
    wisp_mist.handler(handler, secret_key_base)
    |> mist.new
    |> mist.port(3000)
    |> mist.start_http

  process.sleep_forever()
}
