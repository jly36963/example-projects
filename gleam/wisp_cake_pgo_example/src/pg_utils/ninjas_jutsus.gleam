import cake/delete as sql_delete
import cake/insert as sql_insert
import cake/internal/param
import cake/internal/write_query.{InsertParam, InsertRow}
import cake/where as sql_where
import gleam/dynamic
import gleam/list
import gleam/option.{Some}
import gleam/pgo
import gleam/result
import pg_utils/helpers.{
  param_to_value, replace_placeholders, write_query_to_sql,
}
import pg_utils/ninjas as pg_ninjas
import snag
import snag_utils.{snag_try}
import types/jutsu.{
  type Jutsu, Jutsu, get_jutsu_sql_decoder, jutsu_from_sql_tuple,
}
import types/ninja.{type Ninja, Ninja}

pub fn associate_ninja_jutsu(
  db: pgo.Connection,
  ninja_id: String,
  jutsu_id: String,
) -> snag.Result(Nil) {
  let #(sql, raw_params) =
    sql_insert.from_values("ninjas_jutsus", ["ninja_id", "jutsu_id"], [
      InsertRow([
        InsertParam(column: "ninja_id", param: param.StringParam(ninja_id)),
        InsertParam(column: "jutsu_id", param: param.StringParam(jutsu_id)),
      ]),
    ])
    |> sql_insert.returning(["*"])
    |> sql_insert.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)

  use _ <- snag_try(
    pgo.execute(sql, db, params, dynamic.dynamic),
    "Failed to associate ninja/jutsu",
  )
  Ok(Nil)
}

pub fn dissociate_ninja_jutsu(
  db: pgo.Connection,
  ninja_id: String,
  jutsu_id: String,
) -> snag.Result(Nil) {
  let #(sql, raw_params) =
    sql_delete.new()
    |> sql_delete.table("ninjas_jutsus")
    |> sql_delete.where(
      sql_where.col("ninja_id") |> sql_where.eq(sql_where.string(ninja_id)),
    )
    |> sql_delete.where(
      sql_where.col("jutsu_id") |> sql_where.eq(sql_where.string(jutsu_id)),
    )
    |> sql_delete.returning(["*"])
    |> sql_delete.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)

  use _ <- snag_try(
    pgo.execute(sql, db, params, dynamic.dynamic),
    "Failed to associate ninja/jutsu",
  )
  Ok(Nil)
}

pub fn get_ninja_jutsus(
  db: pgo.Connection,
  id: String,
) -> snag.Result(List(Jutsu)) {
  let sql =
    replace_placeholders(
      "SELECT * FROM jutsus WHERE jutsus.id IN (SELECT jutsu_id FROM ninjas_jutsus WHERE ninjas_jutsus.ninja_id = ?);",
    )
  let params = [pgo.text(id)]
  let decoder = get_jutsu_sql_decoder()

  use res <- snag_try(
    pgo.execute(sql, db, params, decoder),
    "Failed to query db for jutsus",
  )

  use jutsus <- result.try(
    res.rows |> list.map(jutsu_from_sql_tuple) |> result.all,
  )
  Ok(jutsus)
}

pub fn ninja_get_with_jutsus(
  db: pgo.Connection,
  id: String,
) -> snag.Result(Ninja) {
  use ninja <- result.try(pg_ninjas.get(db, id))
  use jutsus <- result.try(get_ninja_jutsus(db, id))
  Ok(Ninja(..ninja, jutsus: Some(jutsus)))
}
