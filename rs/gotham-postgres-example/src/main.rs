#[macro_use]
extern crate gotham_derive;

mod api;
mod providers;
mod types;

use env_logger::Env;

fn main() {
    // Logger
    env_logger::Builder::from_env(Env::default().default_filter_or("info")).init();
    // Server
    api::start();
}
