use super::super::providers::Providers;
use super::super::types;
use gotham::handler::HandlerResult;
use gotham::helpers::http::response::{create_empty_response, create_response};
use gotham::hyper::{body, Body, StatusCode};
use gotham::state::{FromState, State};
use mime;
use serde::Deserialize;
use uuid::Uuid;

pub async fn get_ninja(state: State) -> HandlerResult {
    // Get id from path
    let path_params = NinjaIdPathParams::borrow_from(&state);
    let id = path_params.id;

    // Get Ninja
    let providers = Providers::borrow_from(&state);
    let ninja = match providers.pgdal.get_ninja(id).await {
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
    let body = match serde_json::to_string(&ninja) {
        Ok(b) => b,
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };
    let res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body);
    Ok((state, res))
}

pub async fn insert_ninja(mut state: State) -> HandlerResult {
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
    let ninja_new: types::NinjaNew = match serde_json::from_str(&body) {
        Ok(n) => n,
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };

    // Insert ninja
    let providers = Providers::borrow_from(&state);
    let ninja = match providers.pgdal.create_ninja(ninja_new).await {
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
    let body = match serde_json::to_string(&ninja) {
        Ok(b) => b,
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };
    let res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body);
    Ok((state, res))
}

pub async fn update_ninja(mut state: State) -> HandlerResult {
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
    let ninja_updates: types::NinjaUpdates = match serde_json::from_str(&body) {
        Ok(n) => n,
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };

    // Get id from path
    let path_params = NinjaIdPathParams::borrow_from(&state);
    let id = path_params.id;

    // Update ninja
    let providers = Providers::borrow_from(&state);
    let ninja = match providers.pgdal.update_ninja(id, ninja_updates).await {
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
    let body = match serde_json::to_string(&ninja) {
        Ok(b) => b,
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };
    let res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body);
    Ok((state, res))
}

pub async fn delete_ninja(state: State) -> HandlerResult {
    // Get id from path
    let path_params = NinjaIdPathParams::borrow_from(&state);
    let id = path_params.id;

    // Delete Ninja
    let providers = Providers::borrow_from(&state);
    let ninja = match providers.pgdal.delete_ninja(id).await {
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
    let body = match serde_json::to_string(&ninja) {
        Ok(b) => b,
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };
    let res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body);
    Ok((state, res))
}

pub async fn get_ninja_with_jutsus(state: State) -> HandlerResult {
    // Get id from path
    let path_params = NinjaIdPathParams::borrow_from(&state);
    let id = path_params.id;

    // Get Ninja
    let providers = Providers::borrow_from(&state);
    let ninja = match providers.pgdal.get_ninja_with_jutsus(id).await {
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
    let body = match serde_json::to_string(&ninja) {
        Ok(b) => b,
        Err(_) => {
            let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
            return Ok((state, res));
        }
    };
    let res = create_response(&state, StatusCode::OK, mime::APPLICATION_JSON, body);
    Ok((state, res))
}

pub async fn associate_ninja_and_jutsu(state: State) -> HandlerResult {
    // Get ids from path
    let path_params = NinjaAndJutsuIdParams::borrow_from(&state);
    let ninja_id = path_params.ninja_id;
    let jutsu_id = path_params.jutsu_id;

    // Associate ninja & jutsu
    let providers = Providers::borrow_from(&state);
    if let Err(_) = providers.pgdal.associate_ninja_and_jutsu(ninja_id, jutsu_id).await {
        let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
        return Ok((state, res));
    }

    // Response
    let res = create_empty_response(&state, StatusCode::OK);
    return Ok((state, res));
}

pub async fn dissociate_ninja_and_jutsu(state: State) -> HandlerResult {
    // Get ids from path
    let path_params = NinjaAndJutsuIdParams::borrow_from(&state);
    let ninja_id = path_params.ninja_id;
    let jutsu_id = path_params.jutsu_id;

    // Dissociate ninja & jutsu
    let providers = Providers::borrow_from(&state);
    if let Err(_) = providers.pgdal.dissociate_ninja_and_jutsu(ninja_id, jutsu_id).await {
        let res = create_empty_response(&state, StatusCode::INTERNAL_SERVER_ERROR);
        return Ok((state, res));
    }

    // Response
    let res = create_empty_response(&state, StatusCode::OK);
    return Ok((state, res));
}

#[derive(Deserialize, StateData, StaticResponseExtender)]
pub struct NinjaIdPathParams {
    id: Uuid,
}

#[derive(Deserialize, StateData, StaticResponseExtender)]
pub struct NinjaAndJutsuIdParams {
    ninja_id: Uuid,
    jutsu_id: Uuid,
}
