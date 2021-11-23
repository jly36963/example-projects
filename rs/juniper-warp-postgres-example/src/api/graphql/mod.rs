use super::super::providers::Providers;
use super::super::types;
use juniper::{EmptySubscription, FieldResult, RootNode};
use uuid::Uuid;
use warp::Filter;

// ---
// Roots
// ---

// QueryRoot
#[derive(Clone, Copy, Debug)]
struct QueryRoot;

#[juniper::graphql_object(context = types::graphql::Context)]
impl QueryRoot {
    // Ninja
    #[graphql(description = "Get a ninja by its id")]
    async fn ninja(
        id: String,
        context: &types::graphql::Context,
    ) -> FieldResult<Option<types::Ninja>> {
        let uuid = Uuid::parse_str(&id)?;
        let ninja = context.providers.pgdal.get_ninja_with_jutsus(uuid).await?;
        Ok(ninja)
    }
    // Jutsu
    #[graphql(description = "Get a jutsu by its id")]
    async fn jutsu(
        id: String,
        context: &types::graphql::Context,
    ) -> FieldResult<Option<types::Jutsu>> {
        let uuid = Uuid::parse_str(&id)?;
        let jutsu = context.providers.pgdal.get_jutsu(uuid).await?;
        Ok(jutsu)
    }
}

// MutationRoot
#[derive(Clone, Copy, Debug)]
pub struct MutationRoot;

#[juniper::graphql_object(context = types::graphql::Context)]
impl MutationRoot {
    // Create ninja
    #[graphql(description = "Create a new ninja")]
    async fn create_ninja<'ctx>(
        ninja_new: types::NinjaNew,
        context: &'ctx types::graphql::Context,
    ) -> FieldResult<Option<types::Ninja>> {
        let ninja = context.providers.pgdal.create_ninja(ninja_new).await?;
        Ok(ninja)
    }

    // Update ninja
    #[graphql(description = "Update an existing ninja")]
    async fn update_ninja<'ctx>(
        id: String,
        ninja_updates: types::NinjaUpdates,
        context: &'ctx types::graphql::Context,
    ) -> FieldResult<Option<types::Ninja>> {
        let uuid = Uuid::parse_str(&id)?;
        let ninja = context
            .providers
            .pgdal
            .update_ninja(uuid, ninja_updates)
            .await?;
        Ok(ninja)
    }

    // Delete ninja
    #[graphql(description = "Delete an existing ninja")]
    async fn delete_ninja<'ctx>(
        id: String,
        context: &'ctx types::graphql::Context,
    ) -> FieldResult<Option<types::Ninja>> {
        let uuid = Uuid::parse_str(&id)?;
        let ninja = context.providers.pgdal.delete_ninja(uuid).await?;
        Ok(ninja)
    }

    // Create jutsu
    #[graphql(description = "Create a new jutsu")]
    async fn create_jutsu<'ctx>(
        jutsu_new: types::JutsuNew,
        context: &'ctx types::graphql::Context,
    ) -> FieldResult<Option<types::Jutsu>> {
        let jutsu = context.providers.pgdal.create_jutsu(jutsu_new).await?;
        Ok(jutsu)
    }

    // Update jutsu
    #[graphql(description = "Update an existing jutsu")]
    async fn update_jutsu<'ctx>(
        id: String,
        jutsu_updates: types::JutsuUpdates,
        context: &'ctx types::graphql::Context,
    ) -> FieldResult<Option<types::Jutsu>> {
        let uuid = Uuid::parse_str(&id)?;
        let jutsu = context
            .providers
            .pgdal
            .update_jutsu(uuid, jutsu_updates)
            .await?;
        Ok(jutsu)
    }

    // Delete jutsu
    #[graphql(description = "Delete an existing jutsu")]
    async fn delete_jutsu<'ctx>(
        id: String,
        context: &'ctx types::graphql::Context,
    ) -> FieldResult<Option<types::Jutsu>> {
        let uuid = Uuid::parse_str(&id)?;
        let jutsu = context.providers.pgdal.delete_jutsu(uuid).await?;
        Ok(jutsu)
    }

    // Associate ninja & jutsu
    #[graphql(description = "Associate a ninja and jutsu")]
    async fn associate_ninja_and_jutsu<'ctx>(
        ninja_id: String,
        jutsu_id: String,
        context: &'ctx types::graphql::Context,
    ) -> FieldResult<types::graphql::GraphqlSuccess> {
        let ninja_uuid = Uuid::parse_str(&ninja_id)?;
        let jutsu_uuid = Uuid::parse_str(&jutsu_id)?;
        context
            .providers
            .pgdal
            .associate_ninja_and_jutsu(ninja_uuid, jutsu_uuid)
            .await?;
        Ok(types::graphql::GraphqlSuccess { ok: true })
    }

    // Dissociate ninja & jutsu
    #[graphql(description = "Dissociate a ninja and jutsu")]
    async fn dissociate_ninja_and_jutsu<'ctx>(
        ninja_id: String,
        jutsu_id: String,
        context: &'ctx types::graphql::Context,
    ) -> FieldResult<types::graphql::GraphqlSuccess> {
        let ninja_uuid = Uuid::parse_str(&ninja_id)?;
        let jutsu_uuid = Uuid::parse_str(&jutsu_id)?;
        context
            .providers
            .pgdal
            .dissociate_ninja_and_jutsu(ninja_uuid, jutsu_uuid)
            .await?;
        Ok(types::graphql::GraphqlSuccess { ok: true })
    }
}

// ---
// Schema
// ---

type Schema =
    RootNode<'static, QueryRoot, MutationRoot, EmptySubscription<types::graphql::Context>>;

fn get_schema() -> Schema {
    Schema::new(
        QueryRoot,
        MutationRoot, // EmptyMutationRoot::<types::graphql::Context>::new(),
        EmptySubscription::<types::graphql::Context>::new(),
    )
}

pub fn get_graphql_filter(
    providers: Providers,
) -> warp::filters::BoxedFilter<(warp::http::Response<std::vec::Vec<u8>>,)> {
    let state = warp::any().map(move || types::graphql::Context {
        providers: providers.clone(),
    });
    let schema = get_schema();
    let graphql_filter = juniper_warp::make_graphql_filter(schema, state.boxed());
    return graphql_filter;
}
