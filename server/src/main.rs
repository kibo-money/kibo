use std::sync::Arc;

use api::{structs::Routes, ApiRoutes};
use axum::{serve, Router};
use parser::{log, reset_logs};
use serde::Serialize;
use tokio::net::TcpListener;
use tower_http::compression::CompressionLayer;
use website::WebsiteRoutes;

mod api;
mod header_map;
mod response;
mod website;

#[derive(Clone, Debug, Default, Serialize)]
pub struct Grouped<T> {
    pub date: T,
    pub height: T,
    pub last: T,
}

#[derive(Clone)]
pub struct AppState {
    routes: Arc<Routes>,
}

#[tokio::main]
async fn main() -> color_eyre::Result<()> {
    color_eyre::install()?;

    reset_logs();

    let routes = Routes::build();

    routes.generate_dts_file();

    let state = AppState {
        routes: Arc::new(routes),
    };

    let compression_layer = CompressionLayer::new()
        .br(true)
        .deflate(true)
        .gzip(true)
        .zstd(true);

    let router = Router::new()
        .add_api_routes()
        .add_website_routes()
        .with_state(state)
        .layer(compression_layer);

    let mut port = 3110;

    let mut listener;
    loop {
        listener = TcpListener::bind(format!("0.0.0.0:{port}")).await;
        if listener.is_ok() {
            break;
        }
        port += 1;
    }

    log(&format!("Starting server on port {port}..."));
    let listener = listener.unwrap();

    serve(listener, router).await?;

    Ok(())
}
