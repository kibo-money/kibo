use std::{fmt, str::FromStr};

use allocative::{Allocative, Visitor};
use bincode::{
    de::{BorrowDecoder, Decoder},
    enc::Encoder,
    error::{DecodeError, EncodeError},
    BorrowDecode, Decode, Encode,
};
use chrono::{NaiveDate, TimeZone, Utc};
use derive_deref::{Deref, DerefMut};
use serde::{Deserialize, Serialize};

#[derive(
    Debug,
    PartialEq,
    Eq,
    PartialOrd,
    Ord,
    Clone,
    Copy,
    Deref,
    DerefMut,
    Default,
    Serialize,
    Deserialize,
)]
pub struct WNaiveDate(NaiveDate);

impl WNaiveDate {
    pub fn wrap(date: NaiveDate) -> Self {
        Self(date)
    }

    pub fn from_timestamp(timestamp: u32) -> Self {
        Self(
            Utc.timestamp_opt(i64::from(timestamp), 0)
                .unwrap()
                .date_naive(),
        )
    }
}

impl fmt::Display for WNaiveDate {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        fmt::Debug::fmt(&self.0, f)
    }
}

impl Encode for WNaiveDate {
    fn encode<E: Encoder>(&self, encoder: &mut E) -> Result<(), EncodeError> {
        Encode::encode(&self.to_string(), encoder)
    }
}

impl Decode for WNaiveDate {
    fn decode<D: Decoder>(decoder: &mut D) -> core::result::Result<Self, DecodeError> {
        let str: String = Decode::decode(decoder)?;

        Ok(Self(NaiveDate::from_str(&str).unwrap()))
    }
}

impl<'de> BorrowDecode<'de> for WNaiveDate {
    fn borrow_decode<D: BorrowDecoder<'de>>(decoder: &mut D) -> Result<Self, DecodeError> {
        let str: String = BorrowDecode::borrow_decode(decoder)?;

        Ok(Self(NaiveDate::from_str(&str).unwrap()))
    }
}

impl Allocative for WNaiveDate {
    fn visit<'a, 'b: 'a>(&self, visitor: &'a mut Visitor<'b>) {
        visitor.visit_simple_sized::<Self>();
    }
}
