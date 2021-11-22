use super::super::providers::Providers;
use super::super::types;
use juniper::graphql_object;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// ---
// Context
// ---

// https://graphql-rust.github.io/juniper/master/types/objects/using_contexts.html

#[derive(Debug)]
pub struct Context {
    pub providers: Providers,
}
impl juniper::Context for Context {}

impl Clone for Context {
    fn clone(&self) -> Context {
        Context {
            providers: self.providers.clone(),
        }
    }
}

// ---
// IntoResolvable
// ---

// Ninja
#[graphql_object(context = Context)]
impl types::Ninja {
    fn id(&self) -> Uuid {
        self.id
    }
    fn first_name(&self) -> &str {
        &self.first_name
    }
    fn last_name(&self) -> &str {
        &self.last_name
    }
    fn age(&self) -> i32 {
        self.age
    }
    fn created_at(&self) -> chrono::NaiveDateTime {
        self.created_at
    }
    fn updated_at(&self) -> Option<chrono::NaiveDateTime> {
        self.updated_at
    }
    fn jutsus(&self) -> Option<&Vec<types::Jutsu>> {
        self.jutsus.as_ref()
    }
}

// Jutsu
#[graphql_object(context = Context)]
impl types::Jutsu {
    fn id(&self) -> Uuid {
        self.id
    }
    fn name(&self) -> &str {
        &self.name
    }
    fn description(&self) -> &str {
        &self.description
    }
    fn chakra_nature(&self) -> &str {
        &self.chakra_nature
    }
    fn created_at(&self) -> chrono::NaiveDateTime {
        self.created_at
    }
    fn updated_at(&self) -> Option<chrono::NaiveDateTime> {
        self.updated_at
    }
    fn ninjas(&self) -> Option<&Vec<types::Ninja>> {
        self.ninjas.as_ref()
    }
}

// ---
// misc
// ---

#[derive(Serialize, Deserialize, Debug)]
pub struct GraphqlSuccess {
    pub ok: bool,
}

#[graphql_object(context = Context)]
impl GraphqlSuccess {
    fn ok(&self) -> bool {
        self.ok
    }
}
