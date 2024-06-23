use std::fmt::Debug;

use axum::response::{IntoResponse, Json, Response};
use bincode::Decode;
use serde::de::DeserializeOwned;
use serde::Serialize;

use crate::{
    chunk::Chunk,
    headers::{add_cache_control_to_headers, add_cors_to_headers, add_json_type_to_headers},
    imports::{import_map, import_value, import_vec},
    kind::Kind,
};

#[derive(Serialize)]
struct WrappedDataset<'a, T>
where
    T: Serialize,
{
    source: &'a str,
    chunk: Chunk,
    dataset: T,
}

pub fn typed_value_to_response<T>(
    kind: Kind,
    relative_path: &str,
    chunk: Option<Chunk>,
) -> color_eyre::Result<Response>
where
    T: Serialize + Debug + DeserializeOwned + Decode,
{
    Ok(match kind {
        Kind::Date => dataset_to_response(import_map::<T>(relative_path)?, chunk.unwrap()),
        Kind::Height => dataset_to_response(import_vec::<T>(relative_path)?, chunk.unwrap()),
        Kind::Last => value_to_response(import_value::<T>(relative_path)?),
    })
}

fn value_to_response<T>(value: T) -> Response
where
    T: Serialize,
{
    generic_to_reponse(value, None, 5)
}

fn dataset_to_response<T>(dataset: T, chunk: Chunk) -> Response
where
    T: Serialize,
{
    generic_to_reponse(dataset, Some(chunk), 60)
}

pub fn generic_to_reponse<T>(generic: T, chunk: Option<Chunk>, cache_time: u64) -> Response
where
    T: Serialize,
{
    let mut response = {
        if let Some(chunk) = chunk {
            Json(WrappedDataset {
                source: "https://satonomics.xyz",
                chunk,
                dataset: generic,
            })
            .into_response()
        } else {
            Json(generic).into_response()
        }
    };

    let headers = response.headers_mut();

    let max_age = cache_time;
    let stale_while_revalidate = 2 * max_age;

    add_cors_to_headers(headers);
    add_json_type_to_headers(headers);
    add_cache_control_to_headers(headers, max_age, stale_while_revalidate);

    response
}
