import cake/delete as sql_delete
import cake/insert as sql_insert
import cake/internal/param
import cake/internal/write_query.{InsertParam, InsertRow, UpdateParamSet}
import cake/select as sql_select
import cake/update as sql_update
import cake/where as sql_where
import gleam/list
import gleam/pgo
import gleam/result
import pg_utils/helpers.{
  maybe_append_update_param, param_to_value, query_to_sql, write_query_to_sql,
}
import snag
import snag_utils.{snag_try}
import types/ninja.{
  type Ninja, type NinjaUpdates, Ninja, NinjaUpdates, get_ninja_sql_decoder,
  ninja_from_sql_tuple,
}

pub fn get(db: pgo.Connection, id: String) -> snag.Result(Ninja) {
  let #(sql, raw_params) =
    sql_select.new()
    |> sql_select.from_table("ninjas")
    |> sql_select.select(sql_select.col("*"))
    |> sql_select.where(
      sql_where.col("id") |> sql_where.eq(sql_where.string(id)),
    )
    |> sql_select.to_query
    |> query_to_sql

  let decoder = get_ninja_sql_decoder()
  let params = list.map(raw_params, param_to_value)
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
  let #(sql, raw_params) =
    sql_insert.from_records(
      "ninjas",
      ["id", "first_name", "last_name", "age"],
      [ninja],
      fn(n) {
        InsertRow([
          InsertParam(column: "id", param: param.StringParam(n.id)),
          InsertParam(
            column: "first_name",
            param: param.StringParam(n.first_name),
          ),
          InsertParam(
            column: "last_name",
            param: param.StringParam(n.last_name),
          ),
          InsertParam(column: "age", param: param.IntParam(n.age)),
        ])
      },
    )
    |> sql_insert.returning(["*"])
    |> sql_insert.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)
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
  use update_sets <- result.try(
    []
    |> maybe_append_update_param(updates.first_name, fn(v) {
      UpdateParamSet("first_name", param.StringParam(v))
    })
    |> maybe_append_update_param(updates.last_name, fn(v) {
      UpdateParamSet("last_name", param.StringParam(v))
    })
    |> maybe_append_update_param(updates.age, fn(v) {
      UpdateParamSet("age", param.IntParam(v))
    })
    |> fn(set) {
      case list.is_empty(set) {
        True -> snag.error("No updates found")
        False -> Ok(set)
      }
    },
  )

  let #(sql, raw_params) =
    sql_update.new()
    |> sql_update.table("ninjas")
    |> sql_update.where(
      sql_where.col("id") |> sql_where.eq(sql_where.string(id)),
    )
    |> sql_update.sets(update_sets)
    |> sql_update.returning(["*"])
    |> sql_update.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)
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
  let #(sql, raw_params) =
    sql_delete.new()
    |> sql_delete.table("ninjas")
    |> sql_delete.where(
      sql_where.col("id") |> sql_where.eq(sql_where.string(id)),
    )
    |> sql_delete.returning(["*"])
    |> sql_delete.to_query
    |> write_query_to_sql

  let decoder = get_ninja_sql_decoder()
  let params = list.map(raw_params, param_to_value)
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
