use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use warp::Filter;

#[tokio::main]
async fn main() {
    let routes = get_routes();
    warp::serve(routes).run(([127, 0, 0, 1], 5000)).await;
}

// Routing
// https://github.com/seanmonstar/warp/blob/master/examples/routing.rs

fn get_routes() -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    // GET /
    // return String
    let hello_world = warp::path::end().map(|| "Hello, World at root!");

    // GET /api
    // return json
    let get_api = warp::path!("api").map(|| {
        #[derive(Serialize, Deserialize)]
        struct Data {
            message: String,
        };
        let data = Data {
            message: "Hello!".to_string(),
        };
        warp::reply::json(&data)
    });

    // GET /api/health
    // return status code
    let get_api_health = warp::path!("api" / "health").map(|| warp::http::StatusCode::OK);

    // GET /api/store/search
    // return query params
    // https://github.com/seanmonstar/warp/blob/master/examples/query_string.rs
    let get_api_store_search = warp::path!("api" / "store" / "search")
        .and(warp::query::<HashMap<String, String>>())
        .map(|p: HashMap<String, String>| {
            let q = p.get("q").unwrap_or(&String::from(""));
            #[derive(Serialize, Deserialize)]
            struct Data {
                q: String,
            };
            let data = Data {
                q: "Hello!".to_string(),
            };
            warp::reply::json(&data)
        });

    // GET /api/user/:id
    // return (mock) user
    let get_api_user_id = warp::path!("api" / "user" / String).map(|id| {
        #[derive(Serialize, Deserialize)]
        struct User {
            id: String,
            first_name: String,
            last_name: String,
        };
        let user = User {
            id,
            first_name: String::from("Kakashi"),
            last_name: String::from("Hatake"),
        };
        warp::reply::json(&user)
    });

    // POST /api/user
    // (pretend) create new user
    // TODO

    // Catch all
    // TODO

    // return routes
    let routes = warp::get()
        .and(hello_world)
        .or(get_api)
        .or(get_api_health)
        .or(get_api_store_search)
        .or(get_api_user_id);
    return routes;
}
