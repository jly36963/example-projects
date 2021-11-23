use super::super::providers::{with_providers, Providers};
use std::convert::Infallible;
use uuid::Uuid;
use warp::http::StatusCode;
use warp::Filter;
use warp::Reply;

pub fn get_ninja(
    providers: Providers,
) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "ninja" / String)
        .and(warp::get())
        .and(with_providers(providers))
        .and_then(get_ninja_handler)
}

async fn get_ninja_handler(
    id: String,
    providers: Providers,
) -> Result<impl warp::Reply, Infallible> {
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return Ok(StatusCode::NOT_FOUND.into_response()),
    };
    let ninja = match providers.pgdal.get_ninja(uuid).await {
        Ok(n) => match n {
            Some(n) => n,
            None => return Ok(StatusCode::NOT_FOUND.into_response()),
        },
        Err(_) => return Ok(StatusCode::INTERNAL_SERVER_ERROR.into_response()),
    };
    Ok(warp::reply::json(&ninja).into_response())
}
