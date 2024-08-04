use std::{fmt::Debug, path::Path};

use bincode::Decode;
use parser::{Date, SerializedBTreeMap, SerializedVec};
use serde::{de::DeserializeOwned, Serialize};

use crate::routes::Route;

pub fn import_map<T>(route: &Route) -> color_eyre::Result
where
    T: Serialize + Debug + DeserializeOwned + Decode,
{
}

pub fn import_vec<T>(route: &Route) -> color_eyre::Result
where
    T: Serialize + Debug + DeserializeOwned + Decode,
{
}

pub fn import_value<T>(route: &Route) -> color_eyre::Result<T>
where
    T: Serialize + Debug + DeserializeOwned + Decode,
{
}
