use std::path::Path;

use axum::http::{header, HeaderMap};
use parser::log;

const STALE_IF_ERROR: u64 = 31_536_000; // 1 Year

pub trait HeaderMapUtils {
    fn insert_cors(&mut self);

    fn insert_cache_control(&mut self, max_age: u64, stale_while_revalidate: u64);

    fn insert_content_type(&mut self, path: &Path);
    fn insert_content_type_application_javascript(&mut self);
    fn insert_content_type_application_json(&mut self);
    fn insert_content_type_text_html(&mut self);
    fn insert_content_type_text_plain(&mut self);
    fn insert_content_type_font_woff2(&mut self);
}

impl HeaderMapUtils for HeaderMap {
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

    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    fn insert_content_type(&mut self, path: &Path) {
        match path.extension().unwrap().to_str().unwrap() {
            "js" => self.insert_content_type_application_javascript(),
            "json" => self.insert_content_type_application_json(),
            "html" => self.insert_content_type_text_html(),
            "txt" => self.insert_content_type_text_plain(),
            "woff2" => self.insert_content_type_font_woff2(),
            extension => {
                log(&format!("Extension unsupported: {extension}"));
                panic!()
            }
        }
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
