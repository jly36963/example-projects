pub mod api;
pub mod providers;
pub mod types;

use env_logger::Env;

#[tokio::main]
async fn main() {
    let pg_url = "postgresql://postgres:postgres@localhost:5432/practice";
    // Logger
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();
    // Server
    let providers = providers::setup_providers(pg_url).await;
    api::start(providers).await
}
