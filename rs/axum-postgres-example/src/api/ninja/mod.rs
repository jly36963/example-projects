use crate::providers::Providers;
use crate::types;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use uuid::Uuid;

pub async fn get_ninja(
    State(providers): State<Providers>,
    Path(id): Path<String>,
) -> Result<Json<types::Ninja>, (StatusCode, String)> {
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return Err((StatusCode::BAD_REQUEST, format!("Could not parse uuid: '{}'", id))),
    };
    let ninja = match providers.pgdal.get_ninja(uuid).await {
        Ok(n) => match n {
            Some(n) => n,
            None => return Err((StatusCode::NOT_FOUND, format!("Could not find ninja with id '{}'", id))),
        },
        Err(_) => return Err((StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error".into())),
    };

    Ok(Json(ninja))
}

pub async fn insert_ninja(
    State(providers): State<Providers>,
    Json(ninja_new): Json<types::NinjaNew>,
) -> Result<Json<types::Ninja>, (StatusCode, String)> {
    let ninja = match providers.pgdal.create_ninja(ninja_new).await {
        Ok(n) => match n {
            Some(n) => n,
            None => {
                return Err((
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Error while retrieving newly inserted ninja".into(),
                ))
            }
        },
        Err(_) => return Err((StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error".into())),
    };

    Ok(Json(ninja))
}

pub async fn update_ninja(
    State(providers): State<Providers>,
    Path(id): Path<String>,
    Json(ninja_updates): Json<types::NinjaUpdates>,
) -> Result<Json<types::Ninja>, (StatusCode, String)> {
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return Err((StatusCode::BAD_REQUEST, format!("Could not parse uuid: '{}'", id))),
    };
    let ninja = match providers.pgdal.update_ninja(uuid, ninja_updates).await {
        Ok(n) => match n {
            Some(n) => n,
            None => {
                return Err((
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Error while retrieving updated ninja".into(),
                ))
            }
        },
        Err(_) => return Err((StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error".into())),
    };

    Ok(Json(ninja))
}

pub async fn delete_ninja(
    State(providers): State<Providers>,
    Path(id): Path<String>,
) -> Result<Json<types::Ninja>, (StatusCode, String)> {
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return Err((StatusCode::BAD_REQUEST, format!("Could not parse uuid: '{}'", id))),
    };
    let ninja = match providers.pgdal.delete_ninja(uuid).await {
        Ok(n) => match n {
            Some(n) => n,
            None => {
                return Err((
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Error while retrieving deleted ninja".into(),
                ))
            }
        },
        Err(_) => return Err((StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error".into())),
    };

    Ok(Json(ninja))
}

pub async fn get_ninja_with_jutsus(
    State(providers): State<Providers>,
    Path(id): Path<String>,
) -> Result<Json<types::Ninja>, (StatusCode, String)> {
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return Err((StatusCode::BAD_REQUEST, format!("Could not parse uuid: '{}'", id))),
    };
    let ninja = match providers.pgdal.get_ninja_with_jutsus(uuid).await {
        Ok(n) => match n {
            Some(n) => n,
            None => return Err((StatusCode::NOT_FOUND, format!("Could not find ninja with id '{}'", id))),
        },
        Err(_) => return Err((StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error".into())),
    };

    Ok(Json(ninja))
}

pub async fn associate_ninja_and_jutsu(
    State(providers): State<Providers>,
    Path((ninja_id, jutsu_id)): Path<(String, String)>,
) -> Result<StatusCode, (StatusCode, String)> {
    let ninja_uuid = match Uuid::parse_str(&ninja_id) {
        Ok(u) => u,
        Err(_) => return Err((StatusCode::BAD_REQUEST, format!("Could not parse uuid: '{}'", ninja_id))),
    };
    let jutsu_uuid = match Uuid::parse_str(&jutsu_id) {
        Ok(u) => u,
        Err(_) => return Err((StatusCode::BAD_REQUEST, format!("Could not parse uuid: '{}'", jutsu_id))),
    };
    match providers.pgdal.associate_ninja_and_jutsu(ninja_uuid, jutsu_uuid).await {
        Ok(_) => return Ok(StatusCode::OK),
        Err(_) => return Err((StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error".into())),
    }
}

pub async fn dissociate_ninja_and_jutsu(
    State(providers): State<Providers>,
    Path((ninja_id, jutsu_id)): Path<(String, String)>,
) -> Result<StatusCode, (StatusCode, String)> {
    let ninja_uuid = match Uuid::parse_str(&ninja_id) {
        Ok(u) => u,
        Err(_) => return Err((StatusCode::BAD_REQUEST, format!("Could not parse uuid: '{}'", ninja_id))),
    };
    let jutsu_uuid = match Uuid::parse_str(&jutsu_id) {
        Ok(u) => u,
        Err(_) => return Err((StatusCode::BAD_REQUEST, format!("Could not parse uuid: '{}'", jutsu_id))),
    };
    match providers.pgdal.dissociate_ninja_and_jutsu(ninja_uuid, jutsu_uuid).await {
        Ok(_) => return Ok(StatusCode::OK),
        Err(_) => return Err((StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error".into())),
    }
}
