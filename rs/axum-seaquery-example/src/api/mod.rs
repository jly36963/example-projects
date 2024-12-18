use axum::{
    routing::{delete, get, post, put},
    Router,
};

mod jutsu;
mod ninja;
use crate::providers::Providers;

pub async fn start(providers: Providers) {
    let addr = "0.0.0.0:3000";
    println!("Serving on {}", addr);

    // Server
    let app = Router::new()
        // Routes
        .route("/api/ninja/:id", get(ninja::get_ninja))
        .route("/api/ninja", post(ninja::insert_ninja))
        .route("/api/ninja/:id", put(ninja::update_ninja))
        .route("/api/ninja/:id", delete(ninja::delete_ninja))
        .route("/api/ninja/:id/jutsus", get(ninja::get_ninja_with_jutsus))
        .route(
            "/api/ninja-jutsu/:ninja_id/:jutsu_id",
            post(ninja::associate_ninja_and_jutsu),
        )
        .route(
            "/api/ninja-jutsu/:ninja_id/:jutsu_id",
            delete(ninja::dissociate_ninja_and_jutsu),
        )
        .route("/api/jutsu/:id", get(jutsu::get_jutsu))
        .route("/api/jutsu", post(jutsu::insert_jutsu))
        .route("/api/jutsu/:id", put(jutsu::update_jutsu))
        .route("/api/jutsu/:id", delete(jutsu::delete_jutsu))
        // State/deps
        .with_state(providers.clone());

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
