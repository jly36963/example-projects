use gotham::helpers::http::response::create_empty_response;
use gotham::helpers::http::response::create_permanent_redirect;
use gotham::helpers::http::response::create_response;
use gotham::hyper::{Body, Response, StatusCode};
use gotham::router::builder::*;
use gotham::router::response::extender::StaticResponseExtender;
use gotham::router::Router;
use gotham::state::{FromState, State, StateData};
use mime;
use serde::{Deserialize, Serialize};

// ---
// Main
// ---

fn main() {
    let addr = "127.0.0.1:5000";
    println!("Serving on {}", addr);
    gotham::start(addr, || Ok(get_router()));
}

// ---
// Router
// ---

fn get_router() -> Router {
    build_simple_router(|route| {
        route.get("/").to(get_root);
        route.scope("/api", |route| {
            route.get("/").to(get_api);
            route.get("/health").to(get_api_health);
            route.get("/health-check").to(get_api_health_check);
            // route
            //     .get("/store/search")
            //     .with_query_string_extractor::<StoreSearchQuery>()
            //     .to(get_api_store_search);
            route.scope("/user", |route| {
                route.get("{id}").to(get_api_user_id);
                route.post("/").to(post_api_user);
            })
        })
    })
}

// ---
// Handlers
// ---

// GET /
// return String
pub fn get_root(state: State) -> (State, &'static str) {
    (state, "Hello!")
}

// GET /api
// return json
pub fn get_api(state: State) -> (State, Response<Body>) {
    #[derive(Serialize, Deserialize)]
    struct Data {
        message: String,
    }
    let data = Data {
        message: String::from("Hello!"),
    };
    let body = serde_json::to_string(&data).unwrap();
    let res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body);
    (state, res)

    // let body = serde_json::to_string(&data);
    // let res: Response<Body>;
    // match body {
    //     Ok(body) => res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body),
    //     Err(_) => res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR),
    // }
    // (state, res)
}

// GET /api/health
// return status code
pub fn get_api_health(state: State) -> (State, Response<Body>) {
    let res = create_empty_response(&state, StatusCode::OK);
    (state, res)
}

// GET /api/health-check
// redirect to /api/health
pub fn get_api_health_check(state: State) -> (State, Response<Body>) {
    let res = create_permanent_redirect(&state, "/api/health");
    (state, res)
}

// // GET /api/store/search
// // return query params
// // not working: https://github.com/gotham-rs/gotham/blob/master/examples/query_string/introduction/src/main.rs
// pub fn get_api_store_search(mut state: State) -> (State, Response<Body>) {
//     let query = StoreSearchQuery::take_from(&mut state);
//     #[derive(Serialize, Deserialize)]
//     struct Data {
//         q: String,
//     }
//     let data = Data { q: query.q };
//     let body = serde_json::to_string(&data).unwrap();
//     let res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body);
//     (state, res)
// }

// GET /api/user/:id
// return (mock) user
pub fn get_api_user_id(state: State) -> (State, &'static str) {
    (state, "Hello!") // TODO: replace me
}

// POST /api/user
// (pretend) create new user
pub fn post_api_user(state: State) -> (State, &'static str) {
    (state, "Hello!") // TODO: replace me
}

// ---
// Structs
// ---

#[derive(Serialize, Deserialize)]
struct User {
    id: String,
    first_name: String,
    last_name: String,
}

#[derive(Serialize, Deserialize)]
struct UserNew {
    first_name: String,
    last_name: String,
}

// #[derive(Deserialize, StateData, StaticResponseExtender)]
// struct StoreSearchQuery {
//     q: String,
// }
