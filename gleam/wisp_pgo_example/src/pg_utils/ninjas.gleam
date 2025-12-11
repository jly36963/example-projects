import gleam/list
import gleam/pgo
import gleam/result
import gleam/string
import pg_utils/helpers.{maybe_append_param, replace_placeholders}
import snag
import snag_utils.{snag_try}
import types/ninja.{
  type Ninja, type NinjaUpdates, Ninja, NinjaUpdates, get_ninja_sql_decoder,
  ninja_from_sql_tuple,
}

// ---
// Ninja
// ---

pub fn get(db: pgo.Connection, id: String) -> snag.Result(Ninja) {
  let sql = replace_placeholders("SELECT * FROM ninjas WHERE id = ?;")
  let params = [pgo.text(id)]
  let decoder = get_ninja_sql_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for ninja",
  )
  use ninjas <- result.try(
    res.rows |> list.map(ninja_from_sql_tuple) |> result.all,
  )
  use ninja <- snag_try(list.first(ninjas), "No ninja found")
  Ok(ninja)
}

pub fn insert(db: pgo.Connection, ninja: Ninja) -> snag.Result(Ninja) {
  let sql =
    replace_placeholders(
      "INSERT INTO ninjas (id, first_name, last_name, age) VALUES (?, ?, ?, ?) RETURNING *;",
    )
  let params = [
    pgo.text(ninja.id),
    pgo.text(ninja.first_name),
    pgo.text(ninja.last_name),
    pgo.int(ninja.age),
  ]
  let decoder = get_ninja_sql_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for ninja",
  )
  use ninjas <- result.try(
    res.rows |> list.map(ninja_from_sql_tuple) |> result.all,
  )
  use ninja <- snag_try(list.first(ninjas), "No ninja found")
  Ok(ninja)
}

pub fn update(
  db: pgo.Connection,
  id: String,
  updates: NinjaUpdates,
) -> snag.Result(Ninja) {
  use set_params_and_clauses <- result.try(
    []
    |> maybe_append_param(updates.first_name, "first_name", pgo.text)
    |> maybe_append_param(updates.last_name, "last_name", pgo.text)
    |> maybe_append_param(updates.age, "age", pgo.int)
    |> fn(p) {
      case list.is_empty(p) {
        True -> snag.error("No updates found")
        False -> Ok(p)
      }
    },
  )
  let #(set_params, set_clauses) = list.unzip(set_params_and_clauses)
  let set_placeholders = string.join(set_clauses, ", ")

  let sql =
    replace_placeholders(
      "UPDATE ninjas SET " <> set_placeholders <> " WHERE id = ? RETURNING *;",
    )
  let params = list.concat([set_params, [pgo.text(id)]])
  let decoder = get_ninja_sql_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for ninja",
  )
  use ninjas <- result.try(
    res.rows |> list.map(ninja_from_sql_tuple) |> result.all,
  )
  use ninja <- snag_try(list.first(ninjas), "No ninja found")
  Ok(ninja)
}

pub fn delete(db: pgo.Connection, id: String) -> snag.Result(Ninja) {
  let sql = replace_placeholders("DELETE FROM ninjas WHERE id = ? RETURNING *;")
  let params = [pgo.text(id)]
  let decoder = get_ninja_sql_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for ninja",
  )
  use ninjas <- result.try(
    res.rows |> list.map(ninja_from_sql_tuple) |> result.all,
  )
  use ninja <- snag_try(list.first(ninjas), "No ninja found")
  Ok(ninja)
}
