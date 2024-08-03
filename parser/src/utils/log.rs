use std::{fs::OpenOptions, io::Write};

use chrono::Local;
use color_eyre::owo_colors::OwoColorize;

#[inline(always)]
pub fn log(str: &str) {
    let date_time = format!("{}", Local::now().format("%Y-%m-%d %H:%M:%S -"));

    str.lines()
        .filter(|line| !line.is_empty())
        .for_each(|line| {
            let mut file = OpenOptions::new()
                .create(true)
                .append(true)
                .open("./parser.log")
                .unwrap();

            if let Err(e) = writeln!(file, "{} {}", date_time, line) {
                eprintln!("Couldn't write to file: {}", e);
            }

            println!("{} {}", date_time.bright_black(), line);
        });
}
