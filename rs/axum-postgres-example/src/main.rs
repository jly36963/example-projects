mod api;
mod providers;
mod types;

use env_logger::Env;

#[tokio::main]
async fn main() {
    // Logger
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();
    // Server
    let providers = providers::setup_providers().await;
    api::start(providers).await
}
