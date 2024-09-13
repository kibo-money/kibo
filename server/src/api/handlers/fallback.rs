use axum::{extract::State, http::HeaderMap, response::Response};
use reqwest::header::HOST;

use crate::AppState;

use super::response::generic_to_reponse;

pub async fn fallback(headers: HeaderMap, State(app_state): State<AppState>) -> Response {
    generic_to_reponse(
        app_state
            .routes
            .to_full_paths(headers[HOST].to_str().unwrap().to_string()),
        None,
        60,
    )
}
