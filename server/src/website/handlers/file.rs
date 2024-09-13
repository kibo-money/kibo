use std::{
    fs::{self},
    path::{Path, PathBuf},
};

use axum::{
    body::Body,
    extract,
    http::HeaderMap,
    response::{IntoResponse, Response},
};
use chrono::{DateTime, Utc};
use parser::log;
use reqwest::StatusCode;

use crate::header_map::HeaderMapUtils;

use super::minify_js;

const WEBSITE_PATH: &str = "../website";

pub async fn file_handler(headers: HeaderMap, path: extract::Path<String>) -> Response {
    let path = path.0.replace("..", "").replace("\\", "");
    let mut path = str_to_path(&path);

    if !path.exists() {
        if path.extension().is_some() {
            let mut response: Response<Body> = (
                StatusCode::INTERNAL_SERVER_ERROR,
                "File doesn't exist".to_string(),
            )
                .into_response();

            response.headers_mut().insert_cors();

            return response;
        } else {
            path = str_to_path("index.html");
        }
    }

    path_to_response(headers, &path)
}

pub async fn index_handler(headers: HeaderMap) -> Response {
    path_to_response(headers, &str_to_path("index.html"))
}

fn path_to_response(headers: HeaderMap, path: &Path) -> Response {
    let mut response;

    let time = path.metadata().unwrap().modified().unwrap();
    let date: DateTime<Utc> = time.into();

    let is_localhost = headers.check_if_host_is_localhost();

    if !is_localhost && path.extension().unwrap() == "js" {
        let content = minify_js(path);

        response = Response::new(content.into());
    } else {
        let content = fs::read(path).unwrap_or_else(|error| {
            log(&error.to_string());
            let path = path.to_str().unwrap();
            log(&format!("Can't read file {path}"));
            panic!("")
        });

        response = Response::new(content.into());
    }

    let headers = response.headers_mut();
    headers.insert_cors();
    headers.insert_content_type(path);

    if !is_localhost {
        headers.insert_cache_control(10, 50);
    }

    headers.insert_last_modified(date);

    response
}

fn str_to_path(path: &str) -> PathBuf {
    PathBuf::from(&format!("{WEBSITE_PATH}/{path}"))
}
