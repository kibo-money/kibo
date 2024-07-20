use std::sync::Arc;

use axum::{extract::State, http::HeaderMap, response::Response, routing::get, serve, Router};
use parser::log;
use reqwest::header::HOST;
use response::generic_to_reponse;
use routes::Routes;
use serde::Serialize;
use tokio::net::TcpListener;
use tower_http::compression::CompressionLayer;

mod chunk;
mod handler;
mod headers;
mod imports;
mod kind;
mod paths;
mod response;
mod routes;

use handler::file_handler;

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

    let routes = Routes::build();

    routes.generate_front_end_files();

    let state = AppState {
        routes: Arc::new(routes),
    };

    let compression_layer = CompressionLayer::new()
        .br(true)
        .deflate(true)
        .gzip(true)
        .zstd(true);

    let router = Router::new()
        .route("/*path", get(file_handler))
        .route("/", get(fallback))
        .with_state(state)
        .layer(compression_layer);

    let port = 3111;

    log(&format!("Starting server on port {port}..."));

    let listener = TcpListener::bind(format!("0.0.0.0:{port}")).await?;

    serve(listener, router).await?;

    Ok(())
}

pub async fn fallback(headers: HeaderMap, State(app_state): State<AppState>) -> Response {
    generic_to_reponse(
        app_state
            .routes
            .to_full_paths(headers[HOST].to_str().unwrap().to_string()),
        None,
        60,
    )
}
