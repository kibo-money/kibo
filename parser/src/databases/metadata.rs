use allocative::Allocative;
use bincode::{Decode, Encode};
use serde::{Deserialize, Serialize};
use std::{
    fmt::Debug,
    fs, io,
    ops::{Deref, DerefMut},
    path::Path,
};

use crate::{
    structs::{Counter, Date, Height},
    Serialization,
};

#[derive(Default, Debug, Encode, Decode, Allocative)]
pub struct Metadata {
    path: String,
    data: MetadataData,
}

impl Deref for Metadata {
    type Target = MetadataData;

    fn deref(&self) -> &Self::Target {
        &self.data
    }
}

impl DerefMut for Metadata {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.data
    }
}

impl Metadata {
    pub fn import(path: &str) -> Self {
        Self {
            path: path.to_owned(),
            data: MetadataData::import(path).unwrap_or_default(),
        }
    }

    pub fn export(&mut self, height: Height, date: Date) -> color_eyre::Result<()> {
        if self.last_height.unwrap_or_default() < height {
            self.last_height.replace(height);
        }

        if self.last_date.unwrap_or_default() < date {
            self.last_date.replace(date);
        }

        self.data.export(&self.path)
    }

    pub fn reset(&mut self) {
        let _ = self.data.reset(&self.path);
    }

    pub fn called_insert(&mut self) {
        self.serial += 1;
        self.len.increment();
    }

    pub fn called_remove(&mut self) {
        self.len.decrement();
    }

    pub fn check_if_in_sync(&self, other: &Self) -> bool {
        self.last_date == other.last_date && self.last_height == other.last_height
    }

    pub fn check_farer_or_in_sync(&self, other: &Self) -> bool {
        self.last_date >= other.last_date && self.last_height >= other.last_height
    }
}

#[derive(Default, Debug, Encode, Decode, Serialize, Deserialize, Allocative)]
pub struct MetadataData {
    pub serial: usize,
    pub len: Counter,
    pub last_height: Option<Height>,
    pub last_date: Option<Date>,
}

impl MetadataData {
    fn name<'a>() -> &'a str {
        "metadata"
    }

    fn full_path(folder_path: &str) -> String {
        let name = Self::name();
        format!("{folder_path}/{name}")
    }

    pub fn import(path: &str) -> color_eyre::Result<Self> {
        fs::create_dir_all(path)?;

        Serialization::Binary.import(Path::new(&Self::full_path(path)))
    }

    pub fn export(&self, path: &str) -> color_eyre::Result<()> {
        Serialization::Binary.export(Path::new(&Self::full_path(path)), self)
    }

    pub fn reset(&mut self, path: &str) -> color_eyre::Result<(), io::Error> {
        self.clear();

        fs::remove_file(Self::full_path(path))
    }

    fn clear(&mut self) {
        self.serial = 0;
        self.len.reset();
        self.last_height = None;
        self.last_date = None;
    }
}
