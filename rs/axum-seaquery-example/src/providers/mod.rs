pub mod pg;

use pg::get_pg_pool;
use std::sync::Arc;

pub struct Providers {
    pub pgdal: Arc<dyn pg::TPostgresDAL + Send + Sync>,
}

impl Clone for Providers {
    fn clone(&self) -> Providers {
        Providers {
            pgdal: self.pgdal.clone(),
        }
    }
}

pub async fn setup_providers(pg_url: &str) -> Providers {
    let providers = Providers {
        pgdal: Arc::new(pg::PostgresDAL {
            pool: get_pg_pool(pg_url).await,
        }),
    };
    return providers;
}
