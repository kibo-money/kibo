use std::{collections::BTreeMap, path::PathBuf};

use axum::{
    extract::{Path, Query, State},
    http::HeaderMap,
    response::{IntoResponse, Response},
};
use color_eyre::{eyre::eyre, owo_colors::OwoColorize};
use reqwest::{header::HOST, StatusCode};
use serde::Deserialize;

use parser::{log, Date, DateMap, Height, HeightMap, MapChunkId, HEIGHT_MAP_CHUNK_SIZE, OHLC};

use crate::{
    chunk::Chunk, headers::add_cors_to_headers, kind::Kind, response::typed_value_to_response,
    routes::Route, AppState,
};

#[derive(Deserialize)]
pub struct Params {
    chunk: Option<usize>,
}

pub async fn file_handler(
    headers: HeaderMap,
    path: Path<String>,
    query: Query<Params>,
    State(app_state): State<AppState>,
) -> Response {
    match _file_handler(headers, path, query, app_state) {
        Ok(response) => response,
        Err(error) => {
            let mut response =
                (StatusCode::INTERNAL_SERVER_ERROR, error.to_string()).into_response();

            add_cors_to_headers(response.headers_mut());

            response
        }
    }
}

fn _file_handler(
    headers: HeaderMap,
    Path(path): Path<String>,
    query: Query<Params>,
    AppState { routes }: AppState,
) -> color_eyre::Result<Response> {
    if path.contains("favicon") {
        return Err(eyre!("Don't support favicon"));
    }

    log(&format!(
        "{}{}",
        path,
        query.chunk.map_or("".to_string(), |chunk| format!(
            "{}{chunk}",
            "?chunk=".bright_black()
        ))
    ));

    let date_prefix = "date-to-";
    let height_prefix = "height-to-";

    let (kind, route) = if path.starts_with(date_prefix) {
        (
            Kind::Date,
            routes.date.get(&replace_dash_by_underscore(
                path.strip_prefix(date_prefix).unwrap(),
            )),
        )
    } else if path.starts_with(height_prefix) {
        (
            Kind::Height,
            routes.height.get(&replace_dash_by_underscore(
                path.strip_prefix(height_prefix).unwrap(),
            )),
        )
    } else {
        (
            Kind::Last,
            routes.last.get(&replace_dash_by_underscore(&path)),
        )
    };

    if route.is_none() {
        return Err(eyre!("Path error"));
    }

    let mut route = route.unwrap().to_owned();

    let mut chunk = None;

    if kind != Kind::Last {
        match kind {
            Kind::Date => {
                let datasets = DateMap::<usize>::_read_dir(&route.file_path, &route.serialization);
                process_datasets(headers, kind, &mut chunk, &mut route, query, datasets)?;
            }
            Kind::Height => {
                let datasets =
                    HeightMap::<usize>::_read_dir(&route.file_path, &route.serialization);
                process_datasets(headers, kind, &mut chunk, &mut route, query, datasets)?;
            }
            _ => panic!(),
        };
    }

    let type_name = route.values_type.split("::").last().unwrap();

    let value = match type_name {
        "u8" => typed_value_to_response::<u8>(kind, &route.file_path, chunk)?,
        "u16" => typed_value_to_response::<u16>(kind, &route.file_path, chunk)?,
        "u32" => typed_value_to_response::<u32>(kind, &route.file_path, chunk)?,
        "u64" => typed_value_to_response::<u64>(kind, &route.file_path, chunk)?,
        "usize" => typed_value_to_response::<usize>(kind, &route.file_path, chunk)?,
        "f32" => typed_value_to_response::<f32>(kind, &route.file_path, chunk)?,
        "f64" => typed_value_to_response::<f64>(kind, &route.file_path, chunk)?,
        "OHLC" => typed_value_to_response::<OHLC>(kind, &route.file_path, chunk)?,
        "Date" => typed_value_to_response::<Date>(kind, &route.file_path, chunk)?,
        "Height" => typed_value_to_response::<Height>(kind, &route.file_path, chunk)?,
        _ => panic!("Incompatible type: {type_name}"),
    };

    Ok(value)
}

fn replace_dash_by_underscore(s: &str) -> String {
    s.replace('-', "_")
}

fn process_datasets<ChunkId>(
    headers: HeaderMap,
    kind: Kind,
    chunk: &mut Option<Chunk>,
    route: &mut Route,
    query: Query<Params>,
    datasets: BTreeMap<ChunkId, PathBuf>,
) -> color_eyre::Result<()>
where
    ChunkId: MapChunkId,
{
    let (last_chunk_id, _) = datasets.last_key_value().unwrap_or_else(|| {
        dbg!(&datasets, &route);
        panic!()
    });

    let chunk_id = query
        .chunk
        .map(|id| ChunkId::from_usize(id))
        .unwrap_or(*last_chunk_id);

    let path = datasets.get(&chunk_id);

    if path.is_none() {
        return Err(eyre!("Couldn't find chunk"));
    }

    route.file_path = path.unwrap().to_str().unwrap().to_string();

    let offset = match kind {
        Kind::Date => 1,
        Kind::Height => HEIGHT_MAP_CHUNK_SIZE as usize,
        _ => panic!(),
    };

    let offsetted_to_url = |offseted| {
        datasets.get(&ChunkId::from_usize(offseted)).map(|_| {
            let host = headers[HOST].to_str().unwrap();
            let scheme = if host.contains("0.0.0.0") || host.contains("localhost") {
                "http"
            } else {
                "https"
            };

            format!("{scheme}://{host}{}?chunk={offseted}", route.url_path)
        })
    };

    let chunk_id = chunk_id.to_usize();

    chunk.replace(Chunk {
        id: chunk_id,
        next: chunk_id.checked_add(offset).and_then(offsetted_to_url),
        previous: chunk_id.checked_sub(offset).and_then(offsetted_to_url),
    });

    Ok(())
}
