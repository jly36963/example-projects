import gleam/int
import gleam/list
import gleam/option.{None, Some}
import gleam/pgo
import gleam/string

/// Recursively replace "?" placeholders
fn rp_inner(
  sql_iter: List(String),
  current_placeholder: Int,
  result: String,
) -> String {
  case sql_iter {
    [current, next, ..rest] -> {
      case current, next {
        // Escape "??" to "?"
        "?", "?" -> rp_inner(rest, current_placeholder, result <> "?")
        // Convert "?" to dollar placeholder (eg: "$1")
        "?", v1 ->
          rp_inner(
            rest,
            current_placeholder + 1,
            result <> "$" <> int.to_string(current_placeholder) <> v1,
          )
        v1, "?" ->
          rp_inner(
            rest,
            current_placeholder + 1,
            result <> v1 <> "$" <> int.to_string(current_placeholder),
          )
        v1, v2 -> rp_inner(rest, current_placeholder, result <> v1 <> v2)
      }
    }
    [current, ..rest] -> {
      case current {
        "?" ->
          rp_inner(
            rest,
            current_placeholder + 1,
            result <> "$" <> int.to_string(current_placeholder),
          )
        v -> rp_inner(rest, current_placeholder, result <> v)
      }
    }
    [] -> result
  }
}

/// Replace "?" placeholder with dollar placeholder (eg: "$1")
pub fn replace_placeholders(sql: String) -> String {
  let sql_iter = string.to_graphemes(sql)
  rp_inner(sql_iter, 1, "")
}

/// Create pgo client
pub fn get_client(
  host host: String,
  port port: Int,
  user user: String,
  password password: String,
  database database: String,
) -> pgo.Connection {
  pgo.connect(
    pgo.Config(
      ..pgo.default_config(),
      host: host,
      port: port,
      database: database,
      user: user,
      password: Some(password),
      pool_size: 10,
    ),
  )
}

/// For an optional input, append to param/placeholder lists if is_some
pub fn maybe_append_param(
  params: List(#(pgo.Value, String)),
  maybe_input: option.Option(a),
  name: String,
  to_value: fn(a) -> pgo.Value,
) -> List(#(pgo.Value, String)) {
  case maybe_input {
    Some(v) -> list.append(params, [#(to_value(v), name <> " = ?")])
    None -> params
  }
}
