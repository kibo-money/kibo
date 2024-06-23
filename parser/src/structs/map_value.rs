use std::fmt::Debug;

use bincode::{Decode, Encode};
use serde::{de::DeserializeOwned, Serialize};

use crate::datasets::OHLC;

use super::WNaiveDate;

pub trait MapValue:
    Clone + Copy + Default + Debug + Serialize + DeserializeOwned + Encode + Decode + Sync + Send
{
}

impl MapValue for u16 {}
impl MapValue for u32 {}
impl MapValue for u64 {}
impl MapValue for usize {}
impl MapValue for f32 {}
impl MapValue for f64 {}
impl MapValue for WNaiveDate {}
impl MapValue for OHLC {}
