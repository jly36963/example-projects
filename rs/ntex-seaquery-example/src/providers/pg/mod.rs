use crate::types::jutsu::{Jutsu, JutsuNew, JutsuSql, JutsuUpdates};
use crate::types::ninja::{Ninja, NinjaNew, NinjaSql, NinjaUpdates};
use crate::types::ninja_jutsu::{NinjaJutsu, NinjaJutsuSql};
use anyhow;
use async_trait::async_trait;
use sea_query::{Expr, PostgresQueryBuilder, Query, SimpleExpr};
use sea_query_binder::SqlxBinder;
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};
use uuid::Uuid;

pub async fn get_pg_pool(url: &str) -> Pool<Postgres> {
    PgPoolOptions::new()
        .max_connections(10)
        .connect(url)
        .await
        .expect("Could not create pg pool")
}
pub struct PostgresDAL {
    pub pool: Pool<Postgres>,
}

#[async_trait]
pub trait TPostgresDAL {
    // ninjas
    async fn create_ninja(&self, ninja_new: NinjaNew) -> anyhow::Result<Option<Ninja>>;
    async fn get_ninja(&self, id: Uuid) -> anyhow::Result<Option<Ninja>>;
    async fn update_ninja(
        &self,
        id: Uuid,
        ninja_updates: NinjaUpdates,
    ) -> anyhow::Result<Option<Ninja>>;
    async fn delete_ninja(&self, id: Uuid) -> anyhow::Result<Option<Ninja>>;
    // jutsus
    async fn create_jutsu(&self, jutsu_new: JutsuNew) -> anyhow::Result<Option<Jutsu>>;
    async fn get_jutsu(&self, id: Uuid) -> anyhow::Result<Option<Jutsu>>;
    async fn update_jutsu(
        &self,
        id: Uuid,
        jutsu_updates: JutsuUpdates,
    ) -> anyhow::Result<Option<Jutsu>>;
    async fn delete_jutsu(&self, id: Uuid) -> anyhow::Result<Option<Jutsu>>;
    // ninjas_jutsus
    async fn associate_ninja_and_jutsu(
        &self,
        ninja_id: Uuid,
        jutsu_id: Uuid,
    ) -> anyhow::Result<Option<NinjaJutsu>>;

    async fn dissociate_ninja_and_jutsu(
        &self,
        ninja_id: Uuid,
        jutsu_id: Uuid,
    ) -> anyhow::Result<Option<NinjaJutsu>>;
    async fn get_ninja_jutsus(&self, id: Uuid) -> anyhow::Result<Vec<Jutsu>>;
    async fn get_ninja_and_jutsus(&self, id: Uuid) -> anyhow::Result<Option<Ninja>>;
}

#[async_trait]
impl TPostgresDAL for PostgresDAL {
    // ninjas
    async fn create_ninja(&self, ninja_new: NinjaNew) -> anyhow::Result<Option<Ninja>> {
        let (sql, values) = Query::insert()
            .into_table(NinjaSql::Table)
            .columns([
                NinjaSql::Id,
                NinjaSql::FirstName,
                NinjaSql::LastName,
                NinjaSql::Age,
            ])
            .values_panic([
                Uuid::new_v4().into(),
                ninja_new.first_name.into(),
                ninja_new.last_name.into(),
                ninja_new.age.into(),
            ])
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let ninja = sqlx::query_as_with::<_, Ninja, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(ninja))
    }

    async fn get_ninja(&self, id: Uuid) -> anyhow::Result<Option<Ninja>> {
        let (sql, values) = Query::select()
            .from(NinjaSql::Table)
            .columns([
                NinjaSql::Id,
                NinjaSql::FirstName,
                NinjaSql::LastName,
                NinjaSql::Age,
                NinjaSql::CreatedAt,
                NinjaSql::UpdatedAt,
            ])
            .and_where(Expr::col(NinjaSql::Id).eq(id))
            .build_sqlx(PostgresQueryBuilder);

        let ninja = sqlx::query_as_with::<_, Ninja, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(ninja))
    }

    async fn update_ninja(
        &self,
        id: Uuid,
        ninja_updates: NinjaUpdates,
    ) -> anyhow::Result<Option<Ninja>> {
        let mut updates: Vec<(NinjaSql, SimpleExpr)> = Vec::new();
        if ninja_updates.first_name.is_some() {
            updates.push((NinjaSql::FirstName, ninja_updates.first_name.into()));
        }
        if ninja_updates.last_name.is_some() {
            updates.push((NinjaSql::LastName, ninja_updates.last_name.into()));
        }
        if ninja_updates.age.is_some() {
            updates.push((NinjaSql::Age, ninja_updates.age.into()));
        }

        let (sql, values) = Query::update()
            .table(NinjaSql::Table)
            .values(updates)
            .and_where(Expr::col(NinjaSql::Id).eq(id))
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let ninja = sqlx::query_as_with::<_, Ninja, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(ninja))
    }

    async fn delete_ninja(&self, id: Uuid) -> anyhow::Result<Option<Ninja>> {
        let (sql, values) = Query::delete()
            .from_table(NinjaSql::Table)
            .and_where(Expr::col(NinjaSql::Id).eq(id))
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let ninja = sqlx::query_as_with::<_, Ninja, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(ninja))
    }

    // jutsu
    async fn create_jutsu(&self, jutsu_new: JutsuNew) -> anyhow::Result<Option<Jutsu>> {
        let (sql, values) = Query::insert()
            .into_table(JutsuSql::Table)
            .columns([
                JutsuSql::Id,
                JutsuSql::Name,
                JutsuSql::ChakraNature,
                JutsuSql::Description,
            ])
            .values_panic([
                Uuid::new_v4().into(),
                jutsu_new.name.into(),
                jutsu_new.chakra_nature.into(),
                jutsu_new.description.into(),
            ])
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let jutsu = sqlx::query_as_with::<_, Jutsu, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(jutsu))
    }
    async fn get_jutsu(&self, id: Uuid) -> anyhow::Result<Option<Jutsu>> {
        let (sql, values) = Query::select()
            .from(JutsuSql::Table)
            .columns([
                JutsuSql::Id,
                JutsuSql::Name,
                JutsuSql::ChakraNature,
                JutsuSql::Description,
                JutsuSql::CreatedAt,
                JutsuSql::UpdatedAt,
            ])
            .and_where(Expr::col(JutsuSql::Id).eq(id))
            .build_sqlx(PostgresQueryBuilder);

        let jutsu = sqlx::query_as_with::<_, Jutsu, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(jutsu))
    }
    async fn update_jutsu(
        &self,
        id: Uuid,
        jutsu_updates: JutsuUpdates,
    ) -> anyhow::Result<Option<Jutsu>> {
        let mut updates: Vec<(JutsuSql, SimpleExpr)> = Vec::new();
        if jutsu_updates.name.is_some() {
            updates.push((JutsuSql::Name, jutsu_updates.name.into()));
        }
        if jutsu_updates.chakra_nature.is_some() {
            updates.push((JutsuSql::ChakraNature, jutsu_updates.chakra_nature.into()));
        }
        if jutsu_updates.description.is_some() {
            updates.push((JutsuSql::Description, jutsu_updates.description.into()));
        }

        let (sql, values) = Query::update()
            .table(JutsuSql::Table)
            .values(updates)
            .and_where(Expr::col(JutsuSql::Id).eq(id))
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let jutsu = sqlx::query_as_with::<_, Jutsu, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(jutsu))
    }

    async fn delete_jutsu(&self, id: Uuid) -> anyhow::Result<Option<Jutsu>> {
        let (sql, values) = Query::delete()
            .from_table(JutsuSql::Table)
            .and_where(Expr::col(JutsuSql::Id).eq(id))
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let jutsu = sqlx::query_as_with::<_, Jutsu, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(jutsu))
    }

    // ninjas_jutsus
    async fn associate_ninja_and_jutsu(
        &self,
        ninja_id: Uuid,
        jutsu_id: Uuid,
    ) -> anyhow::Result<Option<NinjaJutsu>> {
        let (sql, values) = Query::insert()
            .into_table(NinjaJutsuSql::Table)
            .columns([
                NinjaJutsuSql::Id,
                NinjaJutsuSql::NinjaId,
                NinjaJutsuSql::JutsuId,
            ])
            .values_panic([Uuid::new_v4().into(), ninja_id.into(), jutsu_id.into()])
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let nj = sqlx::query_as_with::<_, NinjaJutsu, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(nj))
    }

    async fn dissociate_ninja_and_jutsu(
        &self,
        nid: Uuid,
        jid: Uuid,
    ) -> anyhow::Result<Option<NinjaJutsu>> {
        let (sql, values) = Query::delete()
            .from_table(NinjaJutsuSql::Table)
            .and_where(Expr::col(NinjaJutsuSql::NinjaId).eq(nid))
            .and_where(Expr::col(NinjaJutsuSql::JutsuId).eq(jid))
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let nj = sqlx::query_as_with::<_, NinjaJutsu, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(nj))
    }

    async fn get_ninja_jutsus(&self, id: Uuid) -> anyhow::Result<Vec<Jutsu>> {
        let (sql, values) = Query::select()
            .from(JutsuSql::Table)
            .columns([
                JutsuSql::Id,
                JutsuSql::Name,
                JutsuSql::ChakraNature,
                JutsuSql::Description,
                JutsuSql::CreatedAt,
                JutsuSql::UpdatedAt,
            ])
            .and_where(
                Expr::col(JutsuSql::Id).in_subquery(
                    Query::select()
                        .from(NinjaJutsuSql::Table)
                        .columns([NinjaJutsuSql::JutsuId])
                        .and_where(Expr::col(NinjaJutsuSql::NinjaId).eq(id))
                        .take(),
                ),
            )
            .build_sqlx(PostgresQueryBuilder);

        let jutsus = sqlx::query_as_with::<_, Jutsu, _>(&sql, values)
            .fetch_all(&self.pool)
            .await?;

        Ok(jutsus)
    }

    async fn get_ninja_and_jutsus(&self, id: Uuid) -> anyhow::Result<Option<Ninja>> {
        let maybe_ninja = self.get_ninja(id).await?;
        match maybe_ninja {
            Some(mut ninja) => {
                let jutsus = self.get_ninja_jutsus(id).await?;
                ninja.jutsus = Some(jutsus);
                return Ok(Some(ninja));
            }
            None => return Ok(None),
        }
    }
}

// pub mod helpers;

// use crate::types;
// use anyhow;
// use async_trait::async_trait;
// use postgres::types::ToSql;
// use uuid::Uuid;

// pub struct PostgresDAL {
//     pub pg_pool: bb8::Pool<bb8_postgres::PostgresConnectionManager<tokio_postgres::NoTls>>,
// }

// impl Clone for PostgresDAL {
//     fn clone(&self) -> PostgresDAL {
//         PostgresDAL { pg_pool: self.pg_pool.clone() }
//     }
// }

// #[async_trait]
// pub trait TPostgresDAL: Sync {
//     // Ninjas
//     async fn create_ninja(&self, ninja_new: types::NinjaNew) -> anyhow::Result<Option<types::Ninja>>;
//     async fn get_ninja(&self, id: Uuid) -> anyhow::Result<Option<types::Ninja>>;
//     async fn update_ninja(&self, id: Uuid, ninja_updates: types::NinjaUpdates) -> anyhow::Result<Option<types::Ninja>>;
//     async fn delete_ninja(&self, id: Uuid) -> anyhow::Result<Option<types::Ninja>>;

//     // Jutsus
//     async fn create_jutsu(&self, jutsu_new: types::JutsuNew) -> anyhow::Result<Option<types::Jutsu>>;
//     async fn get_jutsu(&self, id: Uuid) -> anyhow::Result<Option<types::Jutsu>>;
//     async fn update_jutsu(&self, id: Uuid, jutsu_updates: types::JutsuUpdates) -> anyhow::Result<Option<types::Jutsu>>;
//     async fn delete_jutsu(&self, id: Uuid) -> anyhow::Result<Option<types::Jutsu>>;

//     // Ninjas_jutsus
//     async fn associate_ninja_and_jutsu(&self, ninja_id: Uuid, jutsu_id: Uuid) -> anyhow::Result<()>;
//     async fn dissociate_ninja_and_jutsu(&self, ninja_id: Uuid, jutsu_id: Uuid) -> anyhow::Result<()>;
//     async fn get_ninja_jutsus(&self, id: Uuid) -> anyhow::Result<Vec<types::Jutsu>>;
//     async fn get_ninja_with_jutsus(&self, id: Uuid) -> anyhow::Result<Option<types::Ninja>>;
// }

// #[async_trait]
// impl TPostgresDAL for PostgresDAL {
//     // ninjas
//     async fn create_ninja(&self, ninja_new: types::NinjaNew) -> anyhow::Result<Option<types::Ninja>> {
//         let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

//         let sql = helpers::replace_placeholders(String::from("INSERT INTO ninjas (first_name, last_name, age) VALUES ( ?, ?, ? ) RETURNING *;"));
//         let args: Vec<&(dyn ToSql + Sync)> = vec![&ninja_new.first_name, &ninja_new.last_name, &ninja_new.age];

//         let rows = conn.query(&sql, &args).await?; // postgres::error::Error
//         let row = match rows.get(0) {
//             Some(r) => r,
//             None => return Ok(None),
//         };

//         Ok(Some(types::Ninja {
//             id: row.get(0),
//             first_name: row.get(1),
//             last_name: row.get(2),
//             age: row.get(3),
//             created_at: row.get(4),
//             updated_at: row.get(5),
//             jutsus: None,
//         }))
//     }

//     async fn get_ninja(&self, id: Uuid) -> anyhow::Result<Option<types::Ninja>> {
//         let conn = self.pg_pool.get().await.unwrap();

//         let sql = helpers::replace_placeholders(String::from("SELECT * FROM ninjas WHERE id = ?"));
//         let args: Vec<&(dyn ToSql + Sync)> = vec![&id];

//         let rows = conn.query(&sql, &args).await?; // postgres::error::Error
//         let row = match rows.get(0) {
//             Some(r) => r,
//             None => return Ok(None),
//         };

//         Ok(Some(types::Ninja {
//             id: row.get(0),
//             first_name: row.get(1),
//             last_name: row.get(2),
//             age: row.get(3),
//             created_at: row.get(4),
//             updated_at: row.get(5),
//             jutsus: None,
//         }))
//     }

//     async fn update_ninja(&self, id: Uuid, ninja_updates: types::NinjaUpdates) -> anyhow::Result<Option<types::Ninja>> {
//         let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

//         // placeholders and args
//         let mut update_clause = String::from("SET ");
//         let mut args: Vec<&(dyn ToSql + Sync)> = vec![];
//         // update fields
//         let first_name = ninja_updates.first_name;
//         let last_name = ninja_updates.last_name;
//         let age = ninja_updates.age;
//         // only include if some
//         let mut update_fields: Vec<String> = Vec::new();
//         if first_name.is_some() {
//             update_fields.push("first_name = ?".to_string());
//             args.push(&first_name);
//         }
//         if last_name.is_some() {
//             update_fields.push("last_name = ?".to_string());
//             args.push(&last_name);
//         }
//         if age.is_some() {
//             update_fields.push("age = ?".to_string());
//             args.push(&age);
//         }
//         // Check if at least one field is being updated
//         if update_fields.len() == 0 {
//             // TODO: handle no update fields (no-op)
//         }
//         args.push(&id);
//         update_clause.push_str(&update_fields.join(", "));
//         let sql = helpers::replace_placeholders(String::from(format!("UPDATE ninjas {} WHERE id = ? RETURNING *;", update_clause)));

//         let rows = conn.query(&sql, &args).await?; // postgres::error::Error
//         let row = match rows.get(0) {
//             Some(r) => r,
//             None => return Ok(None),
//         };
//         Ok(Some(types::Ninja {
//             id: row.get(0),
//             first_name: row.get(1),
//             last_name: row.get(2),
//             age: row.get(3),
//             created_at: row.get(4),
//             updated_at: row.get(5),
//             jutsus: None,
//         }))
//     }

//     async fn delete_ninja(&self, id: Uuid) -> anyhow::Result<Option<types::Ninja>> {
//         let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

//         let sql = helpers::replace_placeholders(String::from("DELETE FROM ninjas WHERE id = ? RETURNING *;"));
//         let args: Vec<&(dyn ToSql + Sync)> = vec![&id];

//         let rows = conn.query(&sql, &args).await?; // postgres::error::Error
//         let row = match rows.get(0) {
//             Some(r) => r,
//             None => return Ok(None),
//         };
//         Ok(Some(types::Ninja {
//             id: row.get(0),
//             first_name: row.get(1),
//             last_name: row.get(2),
//             age: row.get(3),
//             created_at: row.get(4),
//             updated_at: row.get(5),
//             jutsus: None,
//         }))
//     }

//     // jutsu
//     async fn create_jutsu(&self, jutsu_new: types::JutsuNew) -> anyhow::Result<Option<types::Jutsu>> {
//         let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

//         let sql = helpers::replace_placeholders(String::from(
//             "INSERT INTO jutsus (name, description, chakra_nature) VALUES ( ?, ?, ? ) RETURNING *;",
//         ));
//         let args: Vec<&(dyn ToSql + Sync)> = vec![&jutsu_new.name, &jutsu_new.description, &jutsu_new.chakra_nature];

//         let rows = conn.query(&sql, &args).await?; // postgres::error::Error
//         let row = match rows.get(0) {
//             Some(r) => r,
//             None => return Ok(None),
//         };
//         Ok(Some(types::Jutsu {
//             id: row.get(0),
//             name: row.get(1),
//             description: row.get(2),
//             chakra_nature: row.get(3),
//             created_at: row.get(4),
//             updated_at: row.get(5),
//             ninjas: None,
//         }))
//     }
//     async fn get_jutsu(&self, id: Uuid) -> anyhow::Result<Option<types::Jutsu>> {
//         let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

//         let sql = helpers::replace_placeholders(String::from("SELECT * FROM jutsus WHERE id = ?"));
//         let args: Vec<&(dyn ToSql + Sync)> = vec![&id];

//         let rows = conn.query(&sql, &args).await?; // postgres::error::Error
//         let row = match rows.get(0) {
//             Some(r) => r,
//             None => return Ok(None),
//         };
//         Ok(Some(types::Jutsu {
//             id: row.get(0),
//             name: row.get(1),
//             description: row.get(2),
//             chakra_nature: row.get(3),
//             created_at: row.get(4),
//             updated_at: row.get(5),
//             ninjas: None,
//         }))
//     }
//     async fn update_jutsu(&self, id: Uuid, jutsu_updates: types::JutsuUpdates) -> anyhow::Result<Option<types::Jutsu>> {
//         let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

//         // placeholders and args
//         let mut update_clause = String::from("SET ");
//         let mut args: Vec<&(dyn ToSql + Sync)> = vec![];
//         // update fields
//         let name = jutsu_updates.name;
//         let description = jutsu_updates.description;
//         let chakra_nature = jutsu_updates.chakra_nature;
//         // only include if some
//         let mut update_fields: Vec<String> = Vec::new();
//         if name.is_some() {
//             update_fields.push("name = ?".to_string());
//             args.push(&name);
//         }
//         if description.is_some() {
//             update_fields.push("description = ?".to_string());
//             args.push(&description);
//         }
//         if chakra_nature.is_some() {
//             update_fields.push("chakra_nature = ?".to_string());
//             args.push(&chakra_nature);
//         }
//         // Check if at least one field is being updated
//         if update_fields.len() == 0 {
//             // TODO: handle no update fields (no-op)
//         }
//         args.push(&id);
//         update_clause.push_str(&update_fields.join(", "));
//         let sql = helpers::replace_placeholders(String::from(format!("UPDATE jutsus {} WHERE id = ? RETURNING *;", update_clause)));

//         let rows = conn.query(&sql, &args).await?; // postgres::error::Error
//         let row = match rows.get(0) {
//             Some(r) => r,
//             None => return Ok(None),
//         };
//         Ok(Some(types::Jutsu {
//             id: row.get(0),
//             name: row.get(1),
//             description: row.get(2),
//             chakra_nature: row.get(3),
//             created_at: row.get(4),
//             updated_at: row.get(5),
//             ninjas: None,
//         }))
//     }

//     async fn delete_jutsu(&self, id: Uuid) -> anyhow::Result<Option<types::Jutsu>> {
//         let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

//         let sql = helpers::replace_placeholders(String::from("DELETE FROM jutsus WHERE id = ? RETURNING *;"));
//         let args: Vec<&(dyn ToSql + Sync)> = vec![&id];

//         let rows = conn.query(&sql, &args).await?; // postgres::error::Error
//         let row = match rows.get(0) {
//             Some(r) => r,
//             None => return Ok(None),
//         };
//         Ok(Some(types::Jutsu {
//             id: row.get(0),
//             name: row.get(1),
//             description: row.get(2),
//             chakra_nature: row.get(3),
//             created_at: row.get(4),
//             updated_at: row.get(5),
//             ninjas: None,
//         }))
//     }

//     // ninjas_jutsus
//     async fn associate_ninja_and_jutsu(&self, ninja_id: Uuid, jutsu_id: Uuid) -> anyhow::Result<()> {
//         let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

//         let sql = helpers::replace_placeholders(String::from("INSERT INTO ninjas_jutsus (ninja_id, jutsu_id) VALUES ( ?, ? ) RETURNING *;"));
//         let args: Vec<&(dyn ToSql + Sync)> = vec![&ninja_id, &jutsu_id];

//         conn.execute(&sql, &args).await?; // postgres::error::Error

//         Ok(())
//     }

//     async fn dissociate_ninja_and_jutsu(&self, ninja_id: Uuid, jutsu_id: Uuid) -> anyhow::Result<()> {
//         let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

//         let sql = helpers::replace_placeholders(String::from("DELETE FROM ninjas_jutsus WHERE (ninja_id = ? AND jutsu_id = ?) RETURNING *;"));
//         let args: Vec<&(dyn ToSql + Sync)> = vec![&ninja_id, &jutsu_id];

//         conn.execute(&sql, &args).await?; // postgres::error::Error

//         Ok(())
//     }

//     async fn get_ninja_jutsus(&self, id: Uuid) -> anyhow::Result<Vec<types::Jutsu>> {
//         let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

//         let sql = helpers::replace_placeholders(String::from(
//             "SELECT * FROM jutsus WHERE jutsus.id IN (SELECT jutsu_id FROM ninjas_jutsus WHERE ninjas_jutsus.ninja_id = ?);",
//         ));
//         let args: Vec<&(dyn ToSql + Sync)> = vec![&id];

//         let rows = conn.query(&sql, &args).await?; // postgres::error::Error

//         let mut jutsus: Vec<types::Jutsu> = Vec::new();
//         for row in rows {
//             jutsus.push(types::Jutsu {
//                 id: row.get(0),
//                 name: row.get(1),
//                 description: row.get(2),
//                 chakra_nature: row.get(3),
//                 created_at: row.get(4),
//                 updated_at: row.get(5),
//                 ninjas: None,
//             });
//         }
//         Ok(jutsus)
//     }

//     async fn get_ninja_with_jutsus(&self, id: Uuid) -> anyhow::Result<Option<types::Ninja>> {
//         let mut ninja = match self.get_ninja(id.clone()).await? {
//             Some(n) => n,
//             None => return Ok(None),
//         };
//         let jutsus = self.get_ninja_jutsus(id).await?;
//         ninja.jutsus = Some(jutsus);
//         Ok(Some(ninja))
//     }
// }
