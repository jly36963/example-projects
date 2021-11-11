pub mod pg;

use warp;
use warp::Filter;

pub struct Providers {
    pub pgdal: pg::PostgresDAL,
}

impl Clone for Providers {
    fn clone(&self) -> Providers {
        Providers {
            pgdal: self.pgdal.clone(),
        }
    }
}

pub async fn setup_providers() -> Providers {
    let providers = Providers {
        pgdal: pg::PostgresDAL {
            pg_pool: pg::helpers::get_pg_pool().await,
        },
    };
    return providers;
}

pub fn with_providers(
    providers: Providers,
) -> impl Filter<Extract = (Providers,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || providers.clone())
}
