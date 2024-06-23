use axum::http::{header, HeaderMap};

const STALE_IF_ERROR: u64 = 604800; // 1 Week

pub fn add_cors_to_headers(headers: &mut HeaderMap) {
    headers.insert(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
    headers.insert(header::ACCESS_CONTROL_ALLOW_HEADERS, "*".parse().unwrap());
}

pub fn add_json_type_to_headers(headers: &mut HeaderMap) {
    headers.insert(header::CONTENT_TYPE, "application/json".parse().unwrap());
}

pub fn add_cache_control_to_headers(
    headers: &mut HeaderMap,
    max_age: u64,
    stale_while_revalidate: u64,
) {
    headers.insert(
        header::CACHE_CONTROL,
        format!(
            "public, max-age={max_age}, stale-while-revalidate={stale_while_revalidate}, stale-if-error={STALE_IF_ERROR}")
        .parse()
        .unwrap(),
    );
}
