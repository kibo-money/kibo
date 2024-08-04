use std::{fmt::Debug, path::Path};

use axum::response::{IntoResponse, Json, Response};
use bincode::Decode;
use parser::{Date, SerializedBTreeMap, SerializedVec};
use serde::de::DeserializeOwned;
use serde::Serialize;

use crate::{
    chunk::Chunk,
    headers::{add_cache_control_to_headers, add_cors_to_headers, add_json_type_to_headers},
    kind::Kind,
    routes::Route,
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
    route: &Route,
    chunk: Option<Chunk>,
) -> color_eyre::Result<Response>
where
    T: Serialize + Debug + DeserializeOwned + Decode,
{
    Ok(match kind {
        Kind::Date => dataset_to_response(
            route
                .serialization
                .import::<SerializedBTreeMap<Date, T>>(Path::new(&route.file_path))?,
            chunk.unwrap(),
        ),
        Kind::Height => dataset_to_response(
            route
                .serialization
                .import::<SerializedVec<T>>(Path::new(&route.file_path))?,
            chunk.unwrap(),
        ),
        Kind::Last => value_to_response(
            route
                .serialization
                .import::<T>(Path::new(&route.file_path))?,
        ),
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
