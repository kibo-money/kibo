use std::fmt::Debug;

use allocative::Allocative;
use bincode::{Decode, Encode};
use serde::{de::DeserializeOwned, Serialize};

use crate::io::{Binary, Json};

#[derive(PartialEq, PartialOrd, Ord, Eq, Debug, Clone, Copy, Default, Allocative)]
pub enum Serialization {
    #[default]
    Binary,
    Json,
}

impl Serialization {
    pub fn to_extension(&self) -> &str {
        match self {
            Self::Binary => "bin",
            Self::Json => "json",
        }
    }

    pub fn from_extension(extension: &str) -> Self {
        match extension {
            "bin" => Self::Binary,
            "json" => Self::Json,
            _ => panic!("Extension \"{extension}\" isn't supported"),
        }
    }

    pub fn append_extension(&self, path: &str) -> String {
        format!("{path}.{}", self.to_extension())
    }

    pub fn import<T>(&self, path: &str) -> color_eyre::Result<T>
    where
        T: Debug + DeserializeOwned + Decode,
    {
        match self {
            Serialization::Binary => Binary::import(path),
            Serialization::Json => Json::import(path),
        }
    }

    pub fn export<T>(&self, path: &str, value: &T) -> color_eyre::Result<()>
    where
        T: Debug + Serialize + Encode,
    {
        match self {
            Serialization::Binary => Binary::export(path, value),
            Serialization::Json => Json::export(path, value),
        }
    }
}
