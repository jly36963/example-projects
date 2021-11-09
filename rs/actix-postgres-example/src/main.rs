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

// // tokio main (doesn't work) (v3)
// #[tokio::main]
// async fn main() -> std::io::Result<()> {
//     // Set up actix
//     let local = tokio::task::LocalSet::new();
//     // let sys = actix_rt::System::run_in_tokio("server", &local);
//     let sys = actix_web::rt::System::run_in_tokio("server", &local);

//     // Start server
//     let providers = providers::setup_providers().await;
//     let server = api::start(providers).await?;
//     sys.await
// }
