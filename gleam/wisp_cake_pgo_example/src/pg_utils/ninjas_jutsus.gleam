import cake/delete as cd
import cake/insert as ci
import cake/param as cp
import cake/where as cw
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
    ci.from_values("ninjas_jutsus", ["ninja_id", "jutsu_id"], [
      ci.row([
        ci.param("ninja_id", cp.StringParam(ninja_id)),
        ci.param("jutsu_id", cp.StringParam(jutsu_id)),
      ]),
    ])
    |> ci.returning(["*"])
    |> ci.to_query
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
    cd.new()
    |> cd.table("ninjas_jutsus")
    |> cd.where(cw.col("ninja_id") |> cw.eq(cw.string(ninja_id)))
    |> cd.where(cw.col("jutsu_id") |> cw.eq(cw.string(jutsu_id)))
    |> cd.returning(["*"])
    |> cd.to_query
    |> write_query_to_sql

  let params = list.map(raw_params, param_to_value)

  use _ <- snag_try(
    pgo.execute(sql, db, params, dynamic.dynamic),
    "Failed to associate ninja/jutsu",
  )
  Ok(Nil)
}

// TODO: replace raw sql with cake (select with subquery)

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
