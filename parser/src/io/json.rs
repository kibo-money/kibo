use std::{
    fs::File,
    io::{BufReader, BufWriter},
};

use serde::{de::DeserializeOwned, Serialize};

pub struct Json;

impl Json {
    pub fn import<T>(path: &str) -> color_eyre::Result<T>
    where
        T: DeserializeOwned,
    {
        let file = File::open(path)?;

        let reader = BufReader::new(file);

        Ok(serde_json::from_reader(reader)?)
    }

    pub fn export<T>(path: &str, value: &T) -> color_eyre::Result<()>
    where
        T: Serialize,
    {
        let file = File::create(path).unwrap_or_else(|_| {
            dbg!(&path);
            panic!("No such file or directory")
        });

        let mut writer = BufWriter::new(file);

        serde_json::to_writer_pretty(&mut writer, value)?;

        Ok(())
    }
}
