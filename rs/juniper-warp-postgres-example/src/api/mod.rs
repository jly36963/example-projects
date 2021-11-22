mod graphql;
mod jutsu;
mod ninja;

use super::providers::Providers;
use std::net::IpAddr;
use std::str::FromStr;
use warp::Filter;

pub async fn start(providers: Providers) {
    // Config
    let host = String::from("127.0.0.1");
    let ip = IpAddr::from_str(&host).unwrap();
    let port = 5000;
    println!("Serving on {}:{}", ip, port);

    // Logger
    let log = warp::log("dev");

    // Graphql filter
    let graphql_filter = graphql::get_graphql_filter(providers.clone());

    // Server
    let routes =
        // graphql
        warp::path("graphiql")
        .and(juniper_warp::graphiql_filter("/graphql", None))
        .or(warp::path("graphql").and(graphql_filter))
        // rest
        .or(ninja::get_ninja(providers.clone()))
        .or(ninja::insert_ninja(providers.clone()))
        .or(ninja::update_ninja(providers.clone()))
        .or(ninja::delete_ninja(providers.clone()))
        .or(ninja::get_ninja_with_jutsus(providers.clone()))
        .or(ninja::associate_ninja_and_jutsu(providers.clone()))
        .or(ninja::dissociate_ninja_and_jutsu(providers.clone()))
        .or(jutsu::get_jutsu(providers.clone()))
        .or(jutsu::insert_jutsu(providers.clone()))
        .or(jutsu::update_jutsu(providers.clone()))
        .or(jutsu::delete_jutsu(providers.clone()))
        // log
        .with(log);

    warp::serve(routes).run((ip, port)).await;
}
