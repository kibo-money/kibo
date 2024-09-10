use axum::{routing::get, Router};
use handlers::{dataset_handler, fallback};

use crate::AppState;

mod handlers;
pub mod structs;

pub trait ApiRoutes {
    fn add_api_routes(self) -> Self;
}

impl ApiRoutes for Router<AppState> {
    fn add_api_routes(self) -> Self {
        self.route("/api/*path", get(dataset_handler))
            .route("/api/", get(fallback))
            .route("/api", get(fallback))
    }
}
