use super::super::providers::Providers;
use super::super::types;
use async_graphql::*;
use std::convert::Infallible;
use uuid::Uuid;
use warp::Filter;

// ---
// Roots
// ---

// QueryRoot
#[derive(Clone, Copy, Debug)]
struct QueryRoot;

#[Object]
impl QueryRoot {
    // Ninja
    async fn ninja(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Ninja id")] id: String,
    ) -> FieldResult<Option<types::Ninja>> {
        let uuid = Uuid::parse_str(&id)?;
        let providers = ctx.data::<Providers>()?;
        let ninja = providers.pgdal.get_ninja_with_jutsus(uuid).await?;
        Ok(ninja)
    }
    // Jutsu
    async fn jutsu(&self, ctx: &Context<'_>, id: String) -> FieldResult<Option<types::Jutsu>> {
        let uuid = Uuid::parse_str(&id)?;
        let providers = ctx.data::<Providers>()?;
        let ninja = providers.pgdal.get_jutsu(uuid).await?;
        Ok(ninja)
    }
}

// MutationRoot
#[derive(Clone, Copy, Debug)]
pub struct MutationRoot;

#[Object]
impl MutationRoot {
    // Create ninja
    async fn create_ninja(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "A new ninja")] ninja_new: types::NinjaNew,
    ) -> FieldResult<Option<types::Ninja>> {
        let providers = ctx.data::<Providers>()?;
        let ninja = providers.pgdal.create_ninja(ninja_new).await?;
        Ok(ninja)
    }

    // Update ninja
    async fn update_ninja(
        &self,
        ctx: &Context<'_>,
        id: String,
        #[graphql(desc = "Ninja updates")] ninja_updates: types::NinjaUpdates,
    ) -> FieldResult<Option<types::Ninja>> {
        let uuid = Uuid::parse_str(&id)?;
        let providers = ctx.data::<Providers>()?;
        let ninja = providers.pgdal.update_ninja(uuid, ninja_updates).await?;
        Ok(ninja)
    }

    // Delete ninja
    async fn delete_ninja(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "A ninja id")] id: String,
    ) -> FieldResult<Option<types::Ninja>> {
        let uuid = Uuid::parse_str(&id)?;
        let providers = ctx.data::<Providers>()?;
        let ninja = providers.pgdal.delete_ninja(uuid).await?;
        Ok(ninja)
    }

    // Create jutsu
    async fn create_jutsu(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "A new jutsu")] jutsu_new: types::JutsuNew,
    ) -> FieldResult<Option<types::Jutsu>> {
        let providers = ctx.data::<Providers>()?;
        let jutsu = providers.pgdal.create_jutsu(jutsu_new).await?;
        Ok(jutsu)
    }

    // Update jutsu
    async fn update_jutsu(
        &self,
        ctx: &Context<'_>,
        id: String,
        #[graphql(desc = "Jutsu updates")] jutsu_updates: types::JutsuUpdates,
    ) -> FieldResult<Option<types::Jutsu>> {
        let uuid = Uuid::parse_str(&id)?;
        let providers = ctx.data::<Providers>()?;
        let jutsu = providers.pgdal.update_jutsu(uuid, jutsu_updates).await?;
        Ok(jutsu)
    }

    // Delete jutsu
    async fn delete_jutsu(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Jutsu id")] id: String,
    ) -> FieldResult<Option<types::Jutsu>> {
        let uuid = Uuid::parse_str(&id)?;
        let providers = ctx.data::<Providers>()?;
        let jutsu = providers.pgdal.delete_jutsu(uuid).await?;
        Ok(jutsu)
    }

    // Associate ninja & jutsu
    async fn associate_ninja_and_jutsu(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Ninja id")] ninja_id: String,
        #[graphql(desc = "Jutsu id")] jutsu_id: String,
    ) -> FieldResult<types::GraphqlSuccess> {
        let ninja_uuid = Uuid::parse_str(&ninja_id)?;
        let jutsu_uuid = Uuid::parse_str(&jutsu_id)?;
        let providers = ctx.data::<Providers>()?;
        providers
            .pgdal
            .associate_ninja_and_jutsu(ninja_uuid, jutsu_uuid)
            .await?;
        Ok(types::GraphqlSuccess { ok: true })
    }

    // Dissociate ninja & jutsu
    async fn dissociate_ninja_and_jutsu(
        &self,
        ctx: &Context<'_>,
        #[graphql(desc = "Ninja id")] ninja_id: String,
        #[graphql(desc = "Jutsu id")] jutsu_id: String,
    ) -> FieldResult<types::GraphqlSuccess> {
        let ninja_uuid = Uuid::parse_str(&ninja_id)?;
        let jutsu_uuid = Uuid::parse_str(&jutsu_id)?;
        let providers = ctx.data::<Providers>()?;
        providers
            .pgdal
            .dissociate_ninja_and_jutsu(ninja_uuid, jutsu_uuid)
            .await?;
        Ok(types::GraphqlSuccess { ok: true })
    }
}

// ---
// Schema
// ---

type GraphqlSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

fn get_schema(providers: Providers) -> GraphqlSchema {
    Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(providers.clone())
        .finish()
}

pub fn get_graphql_filter(
    providers: Providers,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    let schema = get_schema(providers.clone());
    async_graphql_warp::graphql(schema).and_then(
        |(schema, request): (GraphqlSchema, async_graphql::Request)| async move {
            // Execute query
            let response = schema.execute(request).await;
            // Return result
            Ok::<_, Infallible>(async_graphql_warp::GraphQLResponse::from(response))
        },
    )
}

pub fn get_graphiql_filter(
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("graphiql").and(warp::get()).map(|| {
        warp::http::Response::builder()
            .header("content-type", "text/html")
            .body(async_graphql::http::playground_source(
                async_graphql::http::GraphQLPlaygroundConfig::new("/"),
            ))
    })
}
