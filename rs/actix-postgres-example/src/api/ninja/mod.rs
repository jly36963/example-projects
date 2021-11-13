use super::super::providers::Providers;
use super::super::types;
use actix_web::{delete, get, post, put, web, HttpResponse};
use uuid::Uuid;

#[get("/api/ninja/{id}/")]
pub async fn get_ninja(providers: web::Data<Providers>, path: web::Path<String>) -> HttpResponse {
    let id = path.into_inner();
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return HttpResponse::BadRequest().finish(),
    };
    let ninja = match providers.pgdal.get_ninja(uuid).await {
        Ok(n) => match n {
            Some(n) => n,
            None => return HttpResponse::NotFound().finish(),
        },
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    HttpResponse::Ok().json(ninja)
}

#[post("/api/ninja/")]
pub async fn insert_ninja(
    providers: web::Data<Providers>,
    ninja_new: web::Json<types::NinjaNew>,
) -> HttpResponse {
    let ninja = match providers
        .pgdal
        .create_ninja(types::NinjaNew {
            first_name: ninja_new.first_name.clone(),
            last_name: ninja_new.last_name.clone(),
            age: ninja_new.age.clone(),
        })
        .await
    {
        Ok(n) => match n {
            Some(n) => n,
            None => return HttpResponse::NotFound().finish(),
        },
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    HttpResponse::Ok().json(ninja)
}

#[put("/api/ninja/{id}/")]
pub async fn update_ninja(
    providers: web::Data<Providers>,
    path: web::Path<String>,
    ninja_updates: web::Json<types::NinjaUpdates>,
) -> HttpResponse {
    let id = path.into_inner();
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return HttpResponse::BadRequest().finish(),
    };
    let ninja = match providers
        .pgdal
        .update_ninja(
            uuid,
            types::NinjaUpdates {
                first_name: ninja_updates.first_name.clone(),
                last_name: ninja_updates.last_name.clone(),
                age: ninja_updates.age.clone(),
            },
        )
        .await
    {
        Ok(n) => match n {
            Some(n) => n,
            None => return HttpResponse::NotFound().finish(),
        },
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    HttpResponse::Ok().json(ninja)
}

#[delete("/api/ninja/{id}/")]
pub async fn delete_ninja(
    providers: web::Data<Providers>,
    path: web::Path<String>,
) -> HttpResponse {
    let id = path.into_inner();
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return HttpResponse::BadRequest().finish(),
    };
    let ninja = match providers.pgdal.delete_ninja(uuid).await {
        Ok(n) => match n {
            Some(n) => n,
            None => return HttpResponse::NotFound().finish(),
        },
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    HttpResponse::Ok().json(ninja)
}

#[get("/api/ninja/{id}/jutsus/")]
pub async fn get_ninja_with_jutsus(
    providers: web::Data<Providers>,
    path: web::Path<String>,
) -> HttpResponse {
    let id = path.into_inner();
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return HttpResponse::BadRequest().finish(),
    };
    let ninja = match providers.pgdal.get_ninja_with_jutsus(uuid).await {
        Ok(n) => match n {
            Some(n) => n,
            None => return HttpResponse::NotFound().finish(),
        },
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    HttpResponse::Ok().json(ninja)
}

#[post("/api/ninja-jutsu/{ninja_id}/{jutsu_id}/")]
pub async fn associate_ninja_and_jutsu(
    providers: web::Data<Providers>,
    path: web::Path<(String, String)>,
) -> HttpResponse {
    let (ninja_id, jutsu_id) = path.into_inner();
    let ninja_uuid = match Uuid::parse_str(&ninja_id) {
        Ok(u) => u,
        Err(_) => return HttpResponse::BadRequest().finish(),
    };
    let jutsu_uuid = match Uuid::parse_str(&jutsu_id) {
        Ok(u) => u,
        Err(_) => return HttpResponse::BadRequest().finish(),
    };
    if let Err(_) = providers
        .pgdal
        .associate_ninja_and_jutsu(ninja_uuid, jutsu_uuid)
        .await
    {
        return HttpResponse::InternalServerError().finish();
    }

    HttpResponse::Ok().finish()
}

#[delete("/api/ninja-jutsu/{ninja_id}/{jutsu_id}/")]
pub async fn dissociate_ninja_and_jutsu(
    providers: web::Data<Providers>,
    path: web::Path<(String, String)>,
) -> HttpResponse {
    let (ninja_id, jutsu_id) = path.into_inner();
    let ninja_uuid = match Uuid::parse_str(&ninja_id) {
        Ok(u) => u,
        Err(_) => return HttpResponse::BadRequest().finish(),
    };
    let jutsu_uuid = match Uuid::parse_str(&jutsu_id) {
        Ok(u) => u,
        Err(_) => return HttpResponse::BadRequest().finish(),
    };
    if let Err(_) = providers
        .pgdal
        .dissociate_ninja_and_jutsu(ninja_uuid, jutsu_uuid)
        .await
    {
        return HttpResponse::InternalServerError().finish();
    }

    HttpResponse::Ok().finish()
}
