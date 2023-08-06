use crate::providers::Providers;
use crate::types;
use actix_web::{delete, get, post, put, web, HttpResponse};
use uuid::Uuid;

#[get("/api/jutsu/{id}/")]
pub async fn get_jutsu(providers: web::Data<Providers>, path: web::Path<String>) -> HttpResponse {
    let id = path.into_inner();
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return HttpResponse::BadRequest().finish(),
    };
    let jutsu = match providers.pgdal.get_jutsu(uuid).await {
        Ok(n) => match n {
            Some(n) => n,
            None => return HttpResponse::NotFound().finish(),
        },
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    HttpResponse::Ok().json(jutsu)
}

#[post("/api/jutsu/")]
pub async fn insert_jutsu(providers: web::Data<Providers>, jutsu_new: web::Json<types::JutsuNew>) -> HttpResponse {
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
            None => return HttpResponse::NotFound().finish(),
        },
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    HttpResponse::Ok().json(jutsu)
}

#[put("/api/jutsu/{id}/")]
pub async fn update_jutsu(providers: web::Data<Providers>, path: web::Path<String>, jutsu_updates: web::Json<types::JutsuUpdates>) -> HttpResponse {
    let id = path.into_inner();
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return HttpResponse::BadRequest().finish(),
    };
    let jutsu = match providers
        .pgdal
        .update_jutsu(
            uuid,
            types::JutsuUpdates {
                name: jutsu_updates.name.clone(),
                description: jutsu_updates.description.clone(),
                chakra_nature: jutsu_updates.chakra_nature.clone(),
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

    HttpResponse::Ok().json(jutsu)
}

#[delete("/api/jutsu/{id}/")]
pub async fn delete_jutsu(providers: web::Data<Providers>, path: web::Path<String>) -> HttpResponse {
    let id = path.into_inner();
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return HttpResponse::BadRequest().finish(),
    };
    let jutsu = match providers.pgdal.delete_jutsu(uuid).await {
        Ok(n) => match n {
            Some(n) => n,
            None => return HttpResponse::NotFound().finish(),
        },
        Err(_) => return HttpResponse::InternalServerError().finish(),
    };

    HttpResponse::Ok().json(jutsu)
}
