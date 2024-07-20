use std::fmt::Debug;

use bincode::Decode;
use parser::{Date, Serialization, SerializedBTreeMap, SerializedVec};
use serde::{de::DeserializeOwned, Serialize};

pub fn import_map<T>(relative_path: &str) -> color_eyre::Result<SerializedBTreeMap<Date, T>>
where
    T: Serialize + Debug + DeserializeOwned + Decode,
{
    Serialization::from_extension(relative_path.split('.').last().unwrap()).import(relative_path)
}

pub fn import_vec<T>(relative_path: &str) -> color_eyre::Result<SerializedVec<T>>
where
    T: Serialize + Debug + DeserializeOwned + Decode,
{
    Serialization::from_extension(relative_path.split('.').last().unwrap()).import(relative_path)
}

pub fn import_value<T>(relative_path: &str) -> color_eyre::Result<T>
where
    T: Serialize + Debug + DeserializeOwned + Decode,
{
    Serialization::from_extension(relative_path.split('.').last().unwrap())
        .import::<T>(relative_path)
}
