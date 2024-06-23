use allocative::Allocative;
use bincode::{Decode, Encode};

use super::{Price, WAmount};

#[derive(Debug, Encode, Decode, Allocative)]
pub struct BlockData {
    pub height: u32,
    pub price: Price,
    pub timestamp: u32,
    pub amount: WAmount,
    pub utxos: u32,
}

impl BlockData {
    pub fn new(height: u32, price: Price, timestamp: u32) -> Self {
        Self {
            height,
            price,
            timestamp,
            amount: WAmount::ZERO,
            utxos: 0,
        }
    }

    pub fn send(&mut self, amount: WAmount) {
        self.utxos -= 1;

        if self.amount < amount {
            unreachable!();
        }

        self.amount -= amount;
    }

    pub fn receive(&mut self, amount: WAmount) {
        self.utxos += 1;

        self.amount += amount;
    }
}
