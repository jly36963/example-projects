pub mod pg;

use std::sync::Arc;

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

pub async fn setup_providers() -> Providers {
    let providers = Providers {
        pgdal: Arc::new(pg::PostgresDAL {
            pg_pool: pg::helpers::get_pg_pool().await,
        }),
    };
    return providers;
}
