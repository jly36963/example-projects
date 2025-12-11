use crate::providers::Providers;
use crate::types;
use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use uuid::Uuid;

pub async fn get_jutsu(
    State(providers): State<Providers>,
    Path(id): Path<String>,
) -> Result<Json<types::Jutsu>, (StatusCode, String)> {
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return Err((StatusCode::BAD_REQUEST, format!("Could not parse uuid: '{}'", id))),
    };
    let jutsu = match providers.pgdal.get_jutsu(uuid).await {
        Ok(n) => match n {
            Some(n) => n,
            None => return Err((StatusCode::NOT_FOUND, format!("Could not find jutsu with id '{}'", id))),
        },
        Err(_) => return Err((StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error".into())),
    };

    Ok(Json(jutsu))
}

pub async fn insert_jutsu(
    State(providers): State<Providers>,
    Json(jutsu_new): Json<types::JutsuNew>,
) -> Result<Json<types::Jutsu>, (StatusCode, String)> {
    let jutsu = match providers
        .pgdal
        .create_jutsu(types::JutsuNew {
            name: jutsu_new.name.clone(),
            description: jutsu_new.description.clone(),
            chakra_nature: jutsu_new.chakra_nature.clone(),
        })
        .await
    {
        Ok(n) => match n {
            Some(n) => n,
            None => {
                return Err((
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Error while retrieving inserted ninja".into(),
                ))
            }
        },
        Err(_) => return Err((StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error".into())),
    };

    Ok(Json(jutsu))
}

pub async fn update_jutsu(
    State(providers): State<Providers>,
    Path(id): Path<String>,
    Json(jutsu_updates): Json<types::JutsuUpdates>,
) -> Result<Json<types::Jutsu>, (StatusCode, String)> {
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return Err((StatusCode::BAD_REQUEST, format!("Could not parse uuid: '{}'", id))),
    };
    let jutsu = match providers.pgdal.update_jutsu(uuid, jutsu_updates).await {
        Ok(n) => match n {
            Some(n) => n,
            None => {
                return Err((
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Error while retrieving updated jutsu".into(),
                ))
            }
        },
        Err(_) => return Err((StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error".into())),
    };

    Ok(Json(jutsu))
}

pub async fn delete_jutsu(
    State(providers): State<Providers>,
    Path(id): Path<String>,
) -> Result<Json<types::Jutsu>, (StatusCode, String)> {
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return Err((StatusCode::BAD_REQUEST, format!("Could not parse uuid: '{}'", id))),
    };
    let jutsu = match providers.pgdal.delete_jutsu(uuid).await {
        Ok(n) => match n {
            Some(n) => n,
            None => {
                return Err((
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Error while retrieving deleted jutsu".into(),
                ))
            }
        },
        Err(_) => return Err((StatusCode::INTERNAL_SERVER_ERROR, "Internal Server Error".into())),
    };

    Ok(Json(jutsu))
}
