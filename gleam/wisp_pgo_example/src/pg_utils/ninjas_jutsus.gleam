import gleam/dynamic
import gleam/list
import gleam/option.{Some}
import gleam/pgo
import gleam/result
import pg_utils/helpers.{replace_placeholders}
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
  let sql =
    replace_placeholders(
      "INSERT INTO ninjas_jutsus (ninja_id, jutsu_id) VALUES ( ?, ? ) RETURNING *;",
    )
  let params = [pgo.text(ninja_id), pgo.text(jutsu_id)]

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
  let sql =
    replace_placeholders(
      "DELETE FROM ninjas_jutsus WHERE (ninja_id = ? AND jutsu_id = ?) RETURNING *;",
    )
  let params = [pgo.text(ninja_id), pgo.text(jutsu_id)]

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
