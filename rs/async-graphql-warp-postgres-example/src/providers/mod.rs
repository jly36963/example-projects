pub mod pg;

use std::sync::Arc;
use warp;
use warp::Filter;

pub struct Providers {
    pub pgdal: Arc<dyn pg::TPostgresDAL + Send>,
}

impl Clone for Providers {
    fn clone(&self) -> Providers {
        Providers {
            pgdal: self.pgdal.clone(),
        }
    }
}

impl std::fmt::Debug for Providers {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "The providers struct is used for db DI/IoC")
    }
}

// Used by main function to set up providers
pub async fn setup_providers() -> Providers {
    let providers = Providers {
        pgdal: Arc::new(pg::PostgresDAL {
            pg_pool: pg::helpers::get_pg_pool().await,
        }),
    };
    return providers;
}

// Middleware used to inject providers for route handler
pub fn with_providers(
    providers: Providers,
) -> impl Filter<Extract = (Providers,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || providers.clone())
}
