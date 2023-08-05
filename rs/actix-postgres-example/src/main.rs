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
    let providers = providers::setup_providers().await;
    api::start(providers).await
}
