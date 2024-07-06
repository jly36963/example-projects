import gleam/list
import gleam/pgo
import gleam/result
import gleam/string
import pg_utils/helpers.{maybe_append_param, replace_placeholders}
import snag
import snag_utils.{snag_try}
import types/jutsu.{
  type Jutsu, type JutsuUpdates, Jutsu, get_jutsu_sql_decoder,
  jutsu_from_sql_tuple,
}

pub fn get(db: pgo.Connection, id: String) -> snag.Result(Jutsu) {
  let sql = replace_placeholders("SELECT * FROM jutsus WHERE id = ?;")
  let params = [pgo.text(id)]
  let decoder = get_jutsu_sql_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsu",
  )
  use jutsus <- result.try(
    res.rows |> list.map(jutsu_from_sql_tuple) |> result.all,
  )
  use jutsu <- snag_try(list.first(jutsus), "No jutsu found")
  Ok(jutsu)
}

pub fn insert(db: pgo.Connection, jutsu: Jutsu) -> snag.Result(Jutsu) {
  let sql =
    replace_placeholders(
      "INSERT INTO jutsus (id, name, chakra_nature, description) VALUES (?, ?, ?, ?) RETURNING *;",
    )
  let params = [
    pgo.text(jutsu.id),
    pgo.text(jutsu.name),
    pgo.text(jutsu.chakra_nature),
    pgo.text(jutsu.description),
  ]
  let decoder = get_jutsu_sql_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsu",
  )
  use jutsus <- result.try(
    res.rows |> list.map(jutsu_from_sql_tuple) |> result.all,
  )
  use jutsu <- snag_try(list.first(jutsus), "No jutsu found")
  Ok(jutsu)
}

pub fn update(
  db: pgo.Connection,
  id: String,
  updates: JutsuUpdates,
) -> snag.Result(Jutsu) {
  use set_params_and_clauses <- result.try(
    []
    |> maybe_append_param(updates.name, "name", pgo.text)
    |> maybe_append_param(updates.chakra_nature, "chakra_nature", pgo.text)
    |> maybe_append_param(updates.description, "description", pgo.text)
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
      "UPDATE jutsus SET " <> set_placeholders <> " WHERE id = ? RETURNING *;",
    )
  let params = list.concat([set_params, [pgo.text(id)]])
  let decoder = get_jutsu_sql_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsu",
  )
  use jutsus <- result.try(
    res.rows |> list.map(jutsu_from_sql_tuple) |> result.all,
  )
  use jutsu <- snag_try(list.first(jutsus), "No jutsu found")
  Ok(jutsu)
}

pub fn delete(db: pgo.Connection, id: String) -> snag.Result(Jutsu) {
  let sql = replace_placeholders("DELETE FROM jutsus WHERE id = ? RETURNING *;")
  let params = [pgo.text(id)]
  let decoder = get_jutsu_sql_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsu",
  )
  use jutsus <- result.try(
    res.rows |> list.map(jutsu_from_sql_tuple) |> result.all,
  )
  use jutsu <- snag_try(list.first(jutsus), "No jutsu found")
  Ok(jutsu)
}
