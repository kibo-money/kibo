use std::{
    fs::{self},
    path::{Path, PathBuf},
};

use axum::{extract, http::HeaderMap, response::Response};
use parser::log;

use crate::header_map::HeaderMapUtils;

use super::minify_js;

const WEBSITE_PATH: &str = "../website";

pub async fn file_handler(headers: HeaderMap, path: extract::Path<String>) -> Response {
    let path = path.0.replace("..", "").replace("\\", "");
    let mut path = str_to_path(&path);
    if path.extension().is_none() && !path.exists() {
        path = str_to_path("index.html");
    }

    path_to_response(&path)
}

pub async fn index_handler(headers: HeaderMap) -> Response {
    path_to_response(&str_to_path("index.html"))
}

fn path_to_response(path: &Path) -> Response {
    let mut response;

    if path.extension().unwrap() == "js" {
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

    response
}

fn str_to_path(path: &str) -> PathBuf {
    PathBuf::from(&format!("{WEBSITE_PATH}/{path}"))
}
