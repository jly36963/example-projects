mod jutsu;
mod middleware;
mod ninja;

use gotham;
use gotham::middleware::logger::SimpleLogger;
use gotham::pipeline::new_pipeline;
use gotham::pipeline::single::single_pipeline;
use gotham::router::builder::*;
use log::Level;

pub fn start() -> () {
    // Config
    let addr = "127.0.0.1:3000";

    // Middleware
    let (chain, pipelines) = single_pipeline(
        new_pipeline()
            .add(SimpleLogger::new(Level::Info))
            .add(middleware::ProvidersMiddleware)
            .build(),
    );

    // Router
    let router = build_router(chain, pipelines, |r| {
        r.scope("/api/ninja", |r| {
            r.get("/:id/")
                .with_path_extractor::<ninja::NinjaIdPathParams>()
                .to_async(ninja::get_ninja);
            r.post("/").to_async(ninja::insert_ninja);
            r.put("/:id/")
                .with_path_extractor::<ninja::NinjaIdPathParams>()
                .to_async(ninja::update_ninja);
            r.delete("/:id/")
                .with_path_extractor::<ninja::NinjaIdPathParams>()
                .to_async(ninja::delete_ninja);
            r.get("/:id/jutsus")
                .with_path_extractor::<ninja::NinjaIdPathParams>()
                .to_async(ninja::get_ninja_with_jutsus);
        });
        r.scope("/api/jutsu", |r| {
            r.get("/:id/")
                .with_path_extractor::<jutsu::JutsuIdPathParams>()
                .to_async(jutsu::get_jutsu);
            r.post("/").to_async(jutsu::insert_jutsu);
            r.put("/:id/")
                .with_path_extractor::<jutsu::JutsuIdPathParams>()
                .to_async(jutsu::update_jutsu);
            r.delete("/:id/")
                .with_path_extractor::<jutsu::JutsuIdPathParams>()
                .to_async(jutsu::delete_jutsu);
        });
        r.scope("/api/ninja-jutsu", |r| {
            r.post("/:ninja_id/:jutsu_id/")
                .with_path_extractor::<ninja::NinjaAndJutsuIdParams>()
                .to_async(ninja::associate_ninja_and_jutsu);
            r.delete("/:ninja_id/:jutsu_id/")
                .with_path_extractor::<ninja::NinjaAndJutsuIdParams>()
                .to_async(ninja::dissociate_ninja_and_jutsu);
        })
    });

    // Start
    gotham::start(addr, router);
}
