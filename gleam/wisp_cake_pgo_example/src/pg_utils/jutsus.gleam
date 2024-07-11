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
import types/jutsu.{
  type Jutsu, type JutsuUpdates, Jutsu, get_jutsu_sql_decoder,
  jutsu_from_sql_tuple,
}

pub fn get(db: pgo.Connection, id: String) -> snag.Result(Jutsu) {
  let #(sql, raw_params) =
    sql_select.new()
    |> sql_select.from_table("jutsus")
    |> sql_select.select(sql_select.col("*"))
    |> sql_select.where(
      sql_where.col("id") |> sql_where.eq(sql_where.string(id)),
    )
    |> sql_select.to_query
    |> query_to_sql

  let decoder = get_jutsu_sql_decoder()
  let params = list.map(raw_params, param_to_value)
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
  let #(sql, raw_params) =
    sql_insert.from_records(
      "jutsus",
      ["id", "name", "chakra_nature", "description"],
      [jutsu],
      fn(j) {
        InsertRow([
          InsertParam(column: "id", param: param.StringParam(j.id)),
          InsertParam(column: "name", param: param.StringParam(j.name)),
          InsertParam(
            column: "chakra_nature",
            param: param.StringParam(j.chakra_nature),
          ),
          InsertParam(
            column: "description",
            param: param.StringParam(j.description),
          ),
        ])
      },
    )
    |> sql_insert.returning(["*"])
    |> sql_insert.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)

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
  use update_sets <- result.try(
    []
    |> maybe_append_update_param(updates.name, fn(v) {
      UpdateParamSet("name", param.StringParam(v))
    })
    |> maybe_append_update_param(updates.chakra_nature, fn(v) {
      UpdateParamSet("chakra_nature", param.StringParam(v))
    })
    |> maybe_append_update_param(updates.description, fn(v) {
      UpdateParamSet("description", param.StringParam(v))
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
    |> sql_update.table("jutsus")
    |> sql_update.where(
      sql_where.col("id") |> sql_where.eq(sql_where.string(id)),
    )
    |> sql_update.sets(update_sets)
    |> sql_update.returning(["*"])
    |> sql_update.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)
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
  let #(sql, raw_params) =
    sql_delete.new()
    |> sql_delete.table("jutsus")
    |> sql_delete.where(
      sql_where.col("id") |> sql_where.eq(sql_where.string(id)),
    )
    |> sql_delete.returning(["*"])
    |> sql_delete.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)
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
