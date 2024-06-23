use std::{
    iter::Sum,
    ops::{Add, AddAssign, Mul, Sub, SubAssign},
};

use allocative::{Allocative, Visitor};
use bincode::{
    de::{BorrowDecoder, Decoder},
    enc::Encoder,
    error::{DecodeError, EncodeError},
    BorrowDecode, Decode, Encode,
};
use bitcoin::Amount;
use derive_deref::{Deref, DerefMut};
use sanakirja::{direct_repr, Storable, UnsizedStorable};
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
pub struct WAmount(Amount);
direct_repr!(WAmount);

impl WAmount {
    pub const ZERO: Self = Self(Amount::ZERO);
    pub const ONE_BTC_F64: f64 = 100_000_000.0;

    #[inline(always)]
    pub fn wrap(amount: Amount) -> Self {
        Self(amount)
    }

    #[inline(always)]
    pub fn from_sat(sats: u64) -> Self {
        Self(Amount::from_sat(sats))
    }
}

impl Add for WAmount {
    type Output = WAmount;

    fn add(self, rhs: WAmount) -> Self::Output {
        WAmount::from_sat(self.to_sat() + rhs.to_sat())
    }
}

impl AddAssign for WAmount {
    fn add_assign(&mut self, rhs: Self) {
        *self = WAmount::from_sat(self.to_sat() + rhs.to_sat());
    }
}

impl Sub for WAmount {
    type Output = WAmount;

    fn sub(self, rhs: WAmount) -> Self::Output {
        WAmount::from_sat(self.to_sat() - rhs.to_sat())
    }
}

impl SubAssign for WAmount {
    fn sub_assign(&mut self, rhs: Self) {
        *self = WAmount::from_sat(self.to_sat() - rhs.to_sat());
    }
}

impl Mul<WAmount> for WAmount {
    type Output = WAmount;

    fn mul(self, rhs: WAmount) -> Self::Output {
        WAmount::from_sat(self.to_sat() * rhs.to_sat())
    }
}

impl Mul<u64> for WAmount {
    type Output = WAmount;

    fn mul(self, rhs: u64) -> Self::Output {
        WAmount::from_sat(self.to_sat() * rhs)
    }
}

impl Sum for WAmount {
    fn sum<I: Iterator<Item = Self>>(iter: I) -> Self {
        let sats = iter.map(|amt| amt.to_sat()).sum();
        WAmount::from_sat(sats)
    }
}

impl Encode for WAmount {
    fn encode<E: Encoder>(&self, encoder: &mut E) -> Result<(), EncodeError> {
        Encode::encode(&self.to_sat(), encoder)
    }
}

impl Decode for WAmount {
    fn decode<D: Decoder>(decoder: &mut D) -> core::result::Result<Self, DecodeError> {
        let sats: u64 = Decode::decode(decoder)?;

        Ok(WAmount::from_sat(sats))
    }
}

impl<'de> BorrowDecode<'de> for WAmount {
    fn borrow_decode<D: BorrowDecoder<'de>>(decoder: &mut D) -> Result<Self, DecodeError> {
        let sats: u64 = BorrowDecode::borrow_decode(decoder)?;

        Ok(WAmount::from_sat(sats))
    }
}

impl Allocative for WAmount {
    fn visit<'a, 'b: 'a>(&self, visitor: &'a mut Visitor<'b>) {
        visitor.visit_simple_sized::<Self>();
    }
}
