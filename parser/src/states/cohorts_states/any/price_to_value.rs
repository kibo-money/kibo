use std::{
    collections::BTreeMap,
    fmt::Debug,
    ops::{AddAssign, SubAssign},
};

use allocative::Allocative;
use color_eyre::eyre::eyre;
use derive_deref::{Deref, DerefMut};

use crate::structs::{Price, SplitByLiquidity, WAmount};

#[derive(Deref, DerefMut, Default, Debug, Allocative)]
pub struct PriceToValue<T>(BTreeMap<u32, T>);

impl<T> PriceToValue<T>
where
    T: Default
        + Debug
        + AddAssign
        + SubAssign
        + CanSubtract
        + Default
        + Copy
        + Clone
        + PartialEq
        + IsZero,
{
    pub fn increment(&mut self, price: Price, value: T) {
        *self.entry(price.to_cent() as u32).or_default() += value;
    }

    pub fn decrement(&mut self, price: Price, value: T) -> color_eyre::Result<()> {
        let cent = price.to_cent() as u32;

        let delete = {
            let self_value = self.get_mut(&cent);

            if self_value.is_none() {
                dbg!(&self.0, price, value);
                return Err(eyre!("self_value is none"));
            }

            let self_value = self_value.unwrap();

            if !self_value.can_subtract(&value) {
                dbg!(*self_value, &self.0, price, value);
                return Err(eyre!("self value < value"));
            }

            *self_value -= value;

            self_value.is_zero()?
        };

        if delete {
            self.remove(&cent).unwrap();
        }

        Ok(())
    }

    pub fn iterate(&self, supply: T, mut iterate: impl FnMut(Price, T)) {
        let mut processed = T::default();

        self.iter().for_each(|(cent, value)| {
            let value = *value;

            processed += value;

            iterate(Price::from_cent(*cent as u64), value)
        });

        if processed != supply {
            dbg!(processed, supply);
            panic!("processed_amount isn't equal to supply")
        }
    }
}

pub trait CanSubtract {
    fn can_subtract(&self, other: &Self) -> bool;
}

impl CanSubtract for WAmount {
    fn can_subtract(&self, other: &Self) -> bool {
        self >= other
    }
}

impl CanSubtract for SplitByLiquidity<WAmount> {
    fn can_subtract(&self, other: &Self) -> bool {
        self.all >= other.all
            && self.illiquid >= other.illiquid
            && self.liquid >= other.liquid
            && self.highly_liquid >= other.highly_liquid
    }
}

pub trait IsZero {
    fn is_zero(&self) -> color_eyre::Result<bool>;
}

impl IsZero for WAmount {
    fn is_zero(&self) -> color_eyre::Result<bool> {
        Ok(*self == WAmount::ZERO)
    }
}

impl IsZero for SplitByLiquidity<WAmount> {
    fn is_zero(&self) -> color_eyre::Result<bool> {
        if self.all == WAmount::ZERO
            && (self.illiquid != WAmount::ZERO
                || self.liquid != WAmount::ZERO
                || self.highly_liquid != WAmount::ZERO)
        {
            dbg!(&self);
            Err(eyre!("Bad split"))
        } else {
            Ok(self.all == WAmount::ZERO)
        }
    }
}
