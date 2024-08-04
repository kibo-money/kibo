use std::{fmt::Debug, fs, io, path::Path};

use bincode::{Decode, Encode};
use serde::{de::DeserializeOwned, Serialize};

use crate::{io::OUTPUTS_FOLDER_PATH, Serialization};

// https://github.com/djkoloski/rust_serialization_benchmark
pub trait AnyState
where
    Self: Debug + Encode + Decode + Serialize + DeserializeOwned,
{
    fn name<'a>() -> &'a str;

    fn create_dir_all() -> color_eyre::Result<(), io::Error> {
        fs::create_dir_all(Self::folder_path())
    }

    fn folder_path() -> String {
        format!("{OUTPUTS_FOLDER_PATH}/states")
    }

    fn full_path() -> String {
        let name = Self::name();

        let folder_path = Self::folder_path();

        format!("{folder_path}/{name}")
    }

    fn reset(&mut self) -> color_eyre::Result<(), io::Error> {
        self.clear();

        fs::remove_file(Self::full_path())
    }

    fn import() -> color_eyre::Result<Self> {
        Self::create_dir_all()?;

        Serialization::Binary.import(Path::new(&Self::full_path()))
    }

    fn export(&self) -> color_eyre::Result<()> {
        Serialization::Binary.export(Path::new(&Self::full_path()), self)
    }

    fn clear(&mut self);
}
