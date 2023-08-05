mod jutsu;
mod ninja;

use super::providers::Providers;
use actix_web::middleware::Logger;
use actix_web::web::Data;
use actix_web::{web, App, HttpServer};

pub async fn start(providers: Providers) -> std::io::Result<()> {
    // Config
    let addr = "127.0.0.1:3000";
    println!("Serving on {}", addr);

    // Server
    HttpServer::new(move || {
        App::new()
            // Logger middleware
            .wrap(Logger::default())
            // Limit size of payload (global config)
            .app_data(Data::new(web::JsonConfig::default().limit(4096)))
            // Dependencies
            .app_data(Data::new(providers.clone()))
            // Routes
            .service(ninja::get_ninja)
            .service(ninja::insert_ninja)
            .service(ninja::update_ninja)
            .service(ninja::delete_ninja)
            .service(ninja::get_ninja_with_jutsus)
            .service(ninja::associate_ninja_and_jutsu)
            .service(ninja::dissociate_ninja_and_jutsu)
            .service(jutsu::get_jutsu)
            .service(jutsu::insert_jutsu)
            .service(jutsu::update_jutsu)
            .service(jutsu::delete_jutsu)
    })
    .bind(addr)?
    .run()
    .await
}
