use std::path::Path;

use axum::http::{header, HeaderMap};
use chrono::{DateTime, Utc};
use parser::log;
use reqwest::header::HOST;

const STALE_IF_ERROR: u64 = 30_000_000; // 1 Year ish

pub trait HeaderMapUtils {
    fn get_scheme(&self) -> &str;
    fn get_host(&self) -> &str;
    fn check_if_host_is_any_local(&self) -> bool;
    fn check_if_host_is_0000(&self) -> bool;
    fn check_if_host_is_localhost(&self) -> bool;

    fn insert_cors(&mut self);

    fn insert_cache_control(&mut self, max_age: u64, stale_while_revalidate: u64);
    fn insert_last_modified(&mut self, date: DateTime<Utc>);

    fn insert_content_type(&mut self, path: &Path);
    fn insert_content_type_image_icon(&mut self);
    fn insert_content_type_image_jpeg(&mut self);
    fn insert_content_type_image_png(&mut self);
    fn insert_content_type_application_javascript(&mut self);
    fn insert_content_type_application_json(&mut self);
    fn insert_content_type_application_manifest_json(&mut self);
    fn insert_content_type_text_css(&mut self);
    fn insert_content_type_text_html(&mut self);
    fn insert_content_type_text_plain(&mut self);
    fn insert_content_type_font_woff2(&mut self);
}

impl HeaderMapUtils for HeaderMap {
    fn get_scheme(&self) -> &str {
        if self.check_if_host_is_any_local() {
            "http"
        } else {
            "https"
        }
    }

    fn get_host(&self) -> &str {
        self[HOST].to_str().unwrap()
    }

    fn check_if_host_is_any_local(&self) -> bool {
        self.check_if_host_is_localhost() || self.check_if_host_is_0000()
    }

    fn check_if_host_is_0000(&self) -> bool {
        self.get_host().contains("0.0.0.0")
    }

    fn check_if_host_is_localhost(&self) -> bool {
        self.get_host().contains("localhost")
    }

    fn insert_cors(&mut self) {
        self.insert(header::ACCESS_CONTROL_ALLOW_ORIGIN, "*".parse().unwrap());
        self.insert(header::ACCESS_CONTROL_ALLOW_HEADERS, "*".parse().unwrap());
    }

    fn insert_cache_control(&mut self, max_age: u64, stale_while_revalidate: u64) {
        self.insert(
        header::CACHE_CONTROL,
        format!(
            "public, max-age={max_age}, stale-while-revalidate={stale_while_revalidate}, stale-if-error={STALE_IF_ERROR}")
        .parse()
        .unwrap(),
    );
    }

    fn insert_last_modified(&mut self, date: DateTime<Utc>) {
        let formatted = date.format("%a, %d %b %Y %H:%M:%S GMT").to_string();

        self.insert(header::LAST_MODIFIED, formatted.parse().unwrap());
    }

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    fn insert_content_type(&mut self, path: &Path) {
        match path.extension().unwrap().to_str().unwrap() {
            "js" => self.insert_content_type_application_javascript(),
            "json" => self.insert_content_type_application_json(),
            "html" => self.insert_content_type_text_html(),
            "css" => self.insert_content_type_text_css(),
            "txt" => self.insert_content_type_text_plain(),
            "woff2" => self.insert_content_type_font_woff2(),
            "ico" => self.insert_content_type_image_icon(),
            "jpg" | "jpeg" => self.insert_content_type_image_jpeg(),
            "png" => self.insert_content_type_image_png(),
            "webmanifest" => self.insert_content_type_application_manifest_json(),
            extension => {
                log(&format!("Extension unsupported: {extension}"));
                panic!()
            }
        }
    }

    fn insert_content_type_image_icon(&mut self) {
        self.insert(header::CONTENT_TYPE, "image/x-icon".parse().unwrap());
    }

    fn insert_content_type_image_jpeg(&mut self) {
        self.insert(header::CONTENT_TYPE, "image/jpeg".parse().unwrap());
    }

    fn insert_content_type_image_png(&mut self) {
        self.insert(header::CONTENT_TYPE, "image/png".parse().unwrap());
    }

    fn insert_content_type_application_javascript(&mut self) {
        self.insert(
            header::CONTENT_TYPE,
            "application/javascript".parse().unwrap(),
        );
    }

    fn insert_content_type_application_json(&mut self) {
        self.insert(header::CONTENT_TYPE, "application/json".parse().unwrap());
    }

    fn insert_content_type_application_manifest_json(&mut self) {
        self.insert(
            header::CONTENT_TYPE,
            "application/manifest+json".parse().unwrap(),
        );
    }

    fn insert_content_type_text_css(&mut self) {
        self.insert(header::CONTENT_TYPE, "text/css".parse().unwrap());
    }

    fn insert_content_type_text_html(&mut self) {
        self.insert(header::CONTENT_TYPE, "text/html".parse().unwrap());
    }

    fn insert_content_type_text_plain(&mut self) {
        self.insert(header::CONTENT_TYPE, "text/plain".parse().unwrap());
    }

    fn insert_content_type_font_woff2(&mut self) {
        self.insert(header::CONTENT_TYPE, "font/woff2".parse().unwrap());
    }
}
