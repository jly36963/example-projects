use crate::providers::Providers;
use crate::types::jutsu::{JutsuNew, JutsuUpdates};
use ntex::web::types::{Json, Path, State};
use ntex::web::{delete, get, post, put, HttpResponse, Responder};
use uuid::Uuid;

#[get("/api/jutsu/{id}/")]
pub async fn get_jutsu(providers: State<Providers>, path: Path<String>) -> impl Responder {
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

    HttpResponse::Ok().json(&jutsu)
}

#[post("/api/jutsu/")]
pub async fn insert_jutsu(
    providers: State<Providers>,
    jutsu_new: Json<JutsuNew>,
) -> impl Responder {
    let jutsu = match providers
        .pgdal
        .create_jutsu(JutsuNew {
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

    HttpResponse::Ok().json(&jutsu)
}

#[put("/api/jutsu/{id}/")]
pub async fn update_jutsu(
    providers: State<Providers>,
    path: Path<String>,
    jutsu_updates: Json<JutsuUpdates>,
) -> impl Responder {
    let id = path.into_inner();
    let uuid = match Uuid::parse_str(&id) {
        Ok(u) => u,
        Err(_) => return HttpResponse::BadRequest().finish(),
    };
    let jutsu = match providers
        .pgdal
        .update_jutsu(
            uuid,
            JutsuUpdates {
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

    HttpResponse::Ok().json(&jutsu)
}

#[delete("/api/jutsu/{id}/")]
pub async fn delete_jutsu(providers: State<Providers>, path: Path<String>) -> impl Responder {
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

    HttpResponse::Ok().json(&jutsu)
}