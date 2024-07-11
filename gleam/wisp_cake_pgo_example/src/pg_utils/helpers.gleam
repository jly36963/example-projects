import cake
import cake/dialect/postgres_dialect
import cake/internal/param
import cake/internal/query
import cake/internal/write_query.{type UpdateSet}
import gleam/int
import gleam/list
import gleam/option.{None, Some}
import gleam/pgo
import gleam/string

// ---
// Cake
// ---

/// Convert select query to sql/params
pub fn query_to_sql(query: query.Query) -> #(String, List(param.Param)) {
  let ps = postgres_dialect.query_to_prepared_statement(query)
  let sql = cake.get_sql(ps)
  let params = cake.get_params(ps)
  #(sql, params)
}

/// Convert write query to sql/params
pub fn write_query_to_sql(
  wq: write_query.WriteQuery(t),
) -> #(String, List(param.Param)) {
  let ps = postgres_dialect.write_query_to_prepared_statement(wq)
  let sql = cake.get_sql(ps)
  let params = cake.get_params(ps)
  #(sql, params)
}

/// Convert cake param to pgo value
pub fn param_to_value(param: param.Param) -> pgo.Value {
  case param {
    param.BoolParam(b) -> pgo.bool(b)
    param.IntParam(i) -> pgo.int(i)
    param.FloatParam(f) -> pgo.float(f)
    param.StringParam(s) -> pgo.text(s)
    param.NullParam -> pgo.null()
  }
}

/// For an optional input, append to List(UpdateSet) if is_some
pub fn maybe_append_update_param(
  update_sets: List(UpdateSet),
  maybe_input: option.Option(a),
  to_update_set: fn(a) -> UpdateSet,
) -> List(UpdateSet) {
  case maybe_input {
    Some(v) -> list.append(update_sets, [to_update_set(v)])
    None -> update_sets
  }
}

// ---
// pgo
// ---

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
