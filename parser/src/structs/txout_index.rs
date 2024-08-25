use allocative::Allocative;
use bincode::{Decode, Encode};
use sanakirja::{direct_repr, Storable, UnsizedStorable};

#[derive(Debug, PartialEq, Eq, PartialOrd, Ord, Clone, Copy, Encode, Decode, Allocative)]
pub struct TxoutIndex {
    pub tx_index: u32,
    pub vout: u16,
}
direct_repr!(TxoutIndex);

impl TxoutIndex {
    #[inline(always)]
    pub fn new(tx_index: u32, vout: u16) -> Self {
        Self { tx_index, vout }
    }

    #[inline(always)]
    pub fn as_u64(&self) -> u64 {
        ((self.tx_index as u64) << 16_u64) + self.vout as u64
    }
}
