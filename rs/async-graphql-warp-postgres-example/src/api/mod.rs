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
    let port = 3000;
    println!("Serving on {}:{}", ip, port);

    // Logger
    let log = warp::log("dev");

    // Graphql filters
    let graphql_filter = graphql::get_graphql_filter(providers.clone());
    let graphiql_filter = graphql::get_graphiql_filter();

    // Server
    let routes =
        // graphql
        graphiql_filter
        .or(graphql_filter)
        // rest
        .or(ninja::get_ninja(providers.clone()))
        .or(jutsu::get_jutsu(providers.clone()))
        // log
        .with(log);

    warp::serve(routes).run((ip, port)).await;
}
