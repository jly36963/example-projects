mod api;
mod providers;
mod types;

use actix_web;
use env_logger::Env;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Logger
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();
    // Server
    let pg_url = "postgresql://postgres:postgres@localhost:5432/practice";
    let providers = providers::setup_providers(pg_url).await;
    api::start(providers).await
}
