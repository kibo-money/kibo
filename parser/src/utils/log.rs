use std::{
    fs::{self, OpenOptions},
    io::Write,
};

use chrono::Local;
use color_eyre::owo_colors::OwoColorize;

const LOG_PATH: &str = "./.log";

pub fn reset_logs() {
    let _ = fs::remove_file(LOG_PATH);
}

#[inline(always)]
pub fn log(str: &str) {
    let date_time = format!("{}", Local::now().format("%Y-%m-%d %H:%M:%S -"));

    str.lines()
        .filter(|line| !line.is_empty())
        .for_each(|line| {
            let mut file = OpenOptions::new()
                .create(true)
                .append(true)
                .open(LOG_PATH)
                .unwrap();

            if let Err(e) = writeln!(file, "{} {}", date_time, line) {
                eprintln!("Couldn't write to file: {}", e);
            }

            println!("{} {}", date_time.bright_black(), line);
        });
}
