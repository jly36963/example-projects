use super::super::providers::Providers;
use super::super::types;
use gotham::handler::HandlerResult;
use gotham::helpers::http::response::{create_empty_response, create_response};
use gotham::hyper::{body, Body, StatusCode};
use gotham::state::{FromState, State};
use mime;
use serde::Deserialize;
use uuid::Uuid;

pub async fn get_jutsu(state: State) -> HandlerResult {
    // Get id from path
    let path_params = JutsuIdPathParams::borrow_from(&state);
    let id = path_params.id;

    // Get Jutsu
    let providers = Providers::borrow_from(&state);
    let jutsu = match providers.pgdal.get_jutsu(id).await {
        Ok(n) => match n {
            Some(n) => n,
            None => {
                let res = create_empty_response(&state, StatusCode::NOT_FOUND);
                return Ok((state, res));
            }
        },
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };

    // Response
    let body = match serde_json::to_string(&jutsu) {
        Ok(b) => b,
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };
    let res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body);
    Ok((state, res))
}

pub async fn insert_jutsu(mut state: State) -> HandlerResult {
    // Get body
    let body: String;
    match body::to_bytes(Body::take_from(&mut state)).await {
        // TODO: how to fix this error?
        Ok(valid_body) => body = String::from_utf8(valid_body.to_vec()).unwrap(),
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    }

    // Convert body to struct
    let jutsu_new: types::JutsuNew = match serde_json::from_str(&body) {
        Ok(n) => n,
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };

    // Insert jutsu
    let providers = Providers::borrow_from(&state);
    let jutsu = match providers.pgdal.create_jutsu(jutsu_new).await {
        Ok(n) => match n {
            Some(n) => n,
            None => {
                let res = create_empty_response(&state, StatusCode::NOT_FOUND);
                return Ok((state, res));
            }
        },
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };

    // Response
    let body = match serde_json::to_string(&jutsu) {
        Ok(b) => b,
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };
    let res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body);
    Ok((state, res))
}

pub async fn update_jutsu(mut state: State) -> HandlerResult {
    // Get body
    let body: String;
    match body::to_bytes(Body::take_from(&mut state)).await {
        Ok(valid_body) => body = String::from_utf8(valid_body.to_vec()).unwrap(),
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    }

    // Convert body to struct
    let jutsu_updates: types::JutsuUpdates = match serde_json::from_str(&body) {
        Ok(n) => n,
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };

    // Get id from path
    let path_params = JutsuIdPathParams::borrow_from(&state);
    let id = path_params.id;

    // Update jutsu
    let providers = Providers::borrow_from(&state);
    let jutsu = match providers.pgdal.update_jutsu(id, jutsu_updates).await {
        Ok(n) => match n {
            Some(n) => n,
            None => {
                let res = create_empty_response(&state, StatusCode::NOT_FOUND);
                return Ok((state, res));
            }
        },
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };

    // Response
    let body = match serde_json::to_string(&jutsu) {
        Ok(b) => b,
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };
    let res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body);
    Ok((state, res))
}

pub async fn delete_jutsu(state: State) -> HandlerResult {
    // Get id from path
    let path_params = JutsuIdPathParams::borrow_from(&state);
    let id = path_params.id;

    // Delete Jutsu
    let providers = Providers::borrow_from(&state);
    let jutsu = match providers.pgdal.delete_jutsu(id).await {
        Ok(n) => match n {
            Some(n) => n,
            None => {
                let res = create_empty_response(&state, StatusCode::NOT_FOUND);
                return Ok((state, res));
            }
        },
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };

    // Response
    let body = match serde_json::to_string(&jutsu) {
        Ok(b) => b,
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };
    let res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body);
    Ok((state, res))
}

#[derive(Deserialize, StateData, StaticResponseExtender)]
pub struct JutsuIdPathParams {
    id: Uuid,
}
