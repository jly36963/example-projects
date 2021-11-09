mod jutsu;
mod ninja;

use super::providers::Providers;
use actix_web::middleware::Logger;
use actix_web::web::Data;
use actix_web::{web, App, HttpServer};

pub async fn start(providers: Providers) -> std::io::Result<()> {
    // Config
    let addr = "127.0.0.1:5000";
    println!("Serving on {}", addr);

    // Server
    HttpServer::new(move || {
        App::new()
            // logger middleware
            .wrap(Logger::default())
            // .wrap(Logger::new("%a %r %s %b %{Referer}i %{User-Agent}i %T"))
            // limit size of payload (global config)
            .app_data(Data::new(web::JsonConfig::default().limit(4096)))
            // dependencies
            .app_data(Data::new(providers.clone()))
            // routes
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

// // v3
// pub async fn start(providers: Providers) -> std::io::Result<()> {
//     // Config
//     let addr = "127.0.0.1:5000";
//     println!("Serving on {}", addr);

//     // Server
//     HttpServer::new(move || {
//         App::new()
//             // logger middleware
//             .wrap(actix_middleware::Logger::default())
//             // limit size of payload (global config)
//             .data(web::JsonConfig::default().limit(4096))
//             // dependencies
//             .data(providers.clone())
//             // routes
//             .service(ninja::get_ninja)
//             .service(ninja::insert_ninja)
//             .service(ninja::update_ninja)
//             .service(ninja::delete_ninja)
//             .service(ninja::get_ninja_with_jutsus)
//             .service(ninja::associate_ninja_and_jutsu)
//             .service(ninja::dissociate_ninja_and_jutsu)
//             .service(jutsu::get_jutsu)
//             .service(jutsu::insert_jutsu)
//             .service(jutsu::update_jutsu)
//             .service(jutsu::delete_jutsu)
//     })
//     .bind(addr)?
//     .run()
//     .await
// }
