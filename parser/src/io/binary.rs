use std::{
    fmt::Debug,
    fs::File,
    io::{BufReader, BufWriter},
};

use bincode::{config, decode_from_std_read, encode_into_std_write, Decode, Encode};

pub struct Binary;

impl Binary {
    pub fn import<T>(path: &str) -> color_eyre::Result<T>
    where
        T: Decode,
    {
        let config = config::standard();

        let file = File::open(path)?;

        let mut reader = BufReader::new(file);

        let decoded = decode_from_std_read(&mut reader, config)?;

        Ok(decoded)
    }

    pub fn export<T>(path: &str, value: &T) -> color_eyre::Result<()>
    where
        T: Debug + Encode,
    {
        let config = config::standard();

        let file = File::create(path).inspect_err(|_| {
            dbg!(path, value);
        })?;

        let mut writer = BufWriter::new(file);

        encode_into_std_write(value, &mut writer, config)?;

        Ok(())
    }
}
