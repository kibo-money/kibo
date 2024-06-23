pub fn format_path(path: &str) -> String {
    path.replace(['-', '_', ' '], "/")
}
