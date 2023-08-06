use super::super::providers::{with_providers, Providers};
use super::super::types;
use std::convert::Infallible;
use uuid::Uuid;
use warp::http::StatusCode;
use warp::Filter;
use warp::Reply;

pub fn get_ninja(providers: Providers) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "ninja" / String)
        .and(warp::get())
        .and(with_providers(providers))
        .and_then(get_ninja_handler)
}

async fn get_ninja_handler(id: String, providers: Providers) -> Result<impl warp::Reply, Infallible> {
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

pub fn insert_ninja(providers: Providers) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "ninja")
        .and(warp::post())
        .and(warp::body::json())
        .and(with_providers(providers))
        .and_then(insert_ninja_handler)
}

async fn insert_ninja_handler(ninja_new: types::NinjaNew, providers: Providers) -> Result<impl warp::Reply, Infallible> {
    let ninja = match providers.pgdal.create_ninja(ninja_new).await {
        Ok(n) => match n {
            Some(n) => n,
            None => return Ok(StatusCode::NOT_FOUND.into_response()),
        },
        Err(_) => return Ok(StatusCode::INTERNAL_SERVER_ERROR.into_response()),
    };

    Ok(warp::reply::json(&ninja).into_response())
}

pub fn update_ninja(providers: Providers) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "ninja" / String)
        .and(warp::put())
        .and(warp::body::json())
        .and(with_providers(providers))
        .and_then(update_ninja_handler)
}

async fn update_ninja_handler(id: String, ninja_updates: types::NinjaUpdates, providers: Providers) -> Result<impl warp::Reply, Infallible> {
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return Ok(StatusCode::NOT_FOUND.into_response()),
    };
    let ninja = match providers.pgdal.update_ninja(uuid, ninja_updates).await {
        Ok(n) => match n {
            Some(n) => n,
            None => return Ok(StatusCode::NOT_FOUND.into_response()),
        },
        Err(_) => return Ok(StatusCode::INTERNAL_SERVER_ERROR.into_response()),
    };

    Ok(warp::reply::json(&ninja).into_response())
}

pub fn delete_ninja(providers: Providers) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "ninja" / String)
        .and(warp::delete())
        .and(with_providers(providers))
        .and_then(delete_ninja_handler)
}

async fn delete_ninja_handler(id: String, providers: Providers) -> Result<impl warp::Reply, Infallible> {
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return Ok(StatusCode::NOT_FOUND.into_response()),
    };
    let ninja = match providers.pgdal.delete_ninja(uuid).await {
        Ok(n) => match n {
            Some(n) => n,
            None => return Ok(StatusCode::NOT_FOUND.into_response()),
        },
        Err(_) => return Ok(StatusCode::INTERNAL_SERVER_ERROR.into_response()),
    };
    Ok(warp::reply::json(&ninja).into_response())
}

pub fn get_ninja_with_jutsus(providers: Providers) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "ninja" / String / "jutsus")
        .and(warp::get())
        .and(with_providers(providers))
        .and_then(get_ninja_with_jutsus_handler)
}

async fn get_ninja_with_jutsus_handler(id: String, providers: Providers) -> Result<impl warp::Reply, Infallible> {
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return Ok(StatusCode::NOT_FOUND.into_response()),
    };
    let ninja = match providers.pgdal.get_ninja_with_jutsus(uuid).await {
        Ok(n) => match n {
            Some(n) => n,
            None => return Ok(StatusCode::NOT_FOUND.into_response()),
        },
        Err(_) => return Ok(StatusCode::INTERNAL_SERVER_ERROR.into_response()),
    };
    Ok(warp::reply::json(&ninja).into_response())
}

pub fn associate_ninja_and_jutsu(providers: Providers) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "ninja-jutsu" / String / String)
        .and(warp::post())
        .and(with_providers(providers))
        .and_then(associate_ninja_and_jutsu_handler)
}

async fn associate_ninja_and_jutsu_handler(ninja_id: String, jutsu_id: String, providers: Providers) -> Result<impl warp::Reply, Infallible> {
    let ninja_uuid = match Uuid::parse_str(&ninja_id) {
        Ok(u) => u,
        Err(_) => return Ok(StatusCode::NOT_FOUND.into_response()),
    };
    let jutsu_uuid = match Uuid::parse_str(&jutsu_id) {
        Ok(u) => u,
        Err(_) => return Ok(StatusCode::NOT_FOUND.into_response()),
    };
    if let Err(_) = providers.pgdal.associate_ninja_and_jutsu(ninja_uuid, jutsu_uuid).await {
        return Ok(StatusCode::INTERNAL_SERVER_ERROR.into_response());
    };

    Ok(StatusCode::OK.into_response())
}

pub fn dissociate_ninja_and_jutsu(providers: Providers) -> impl Filter<Extract = impl warp::Reply, Error = warp::Rejection> + Clone {
    warp::path!("api" / "ninja-jutsu" / String / String)
        .and(warp::delete())
        .and(with_providers(providers))
        .and_then(dissociate_ninja_and_jutsu_handler)
}

async fn dissociate_ninja_and_jutsu_handler(ninja_id: String, jutsu_id: String, providers: Providers) -> Result<impl warp::Reply, Infallible> {
    let ninja_uuid = match Uuid::parse_str(&ninja_id) {
        Ok(u) => u,
        Err(_) => return Ok(StatusCode::NOT_FOUND.into_response()),
    };
    let jutsu_uuid = match Uuid::parse_str(&jutsu_id) {
        Ok(u) => u,
        Err(_) => return Ok(StatusCode::NOT_FOUND.into_response()),
    };
    if let Err(_) = providers.pgdal.dissociate_ninja_and_jutsu(ninja_uuid, jutsu_uuid).await {
        return Ok(StatusCode::INTERNAL_SERVER_ERROR.into_response());
    };

    Ok(StatusCode::OK.into_response())
}
