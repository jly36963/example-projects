mod jutsu;
mod ninja;

use crate::providers::Providers;
use ntex::web::middleware::Logger;
use ntex::web::{App, HttpServer};

pub async fn start(providers: Providers) -> std::io::Result<()> {
    // Config
    let addr = "127.0.0.1:3000";
    println!("Serving on {}", addr);

    // Server
    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .state(providers.clone())
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
