use allocative::Allocative;
use color_eyre::eyre::eyre;
use sanakirja::{direct_repr, Storable, UnsizedStorable};

use super::{AddressType, EmptyAddressData, LiquidityClassification, Price, WAmount};

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Default, Allocative)]
pub struct AddressData {
    pub address_type: AddressType,
    pub amount: WAmount,
    pub sent: WAmount,
    pub received: WAmount,
    pub realized_cap: Price,
    pub outputs_len: u32,
}
direct_repr!(AddressData);

impl AddressData {
    pub fn new(address_type: AddressType) -> Self {
        Self {
            address_type,
            amount: WAmount::ZERO,
            sent: WAmount::ZERO,
            received: WAmount::ZERO,
            realized_cap: Price::ZERO,
            outputs_len: 0,
        }
    }

    pub fn receive(&mut self, amount: WAmount, price: Price) {
        let previous_amount = self.amount;

        let new_amount = previous_amount + amount;

        self.amount = new_amount;

        self.received += amount;

        self.outputs_len += 1;

        let received_value = price * amount;

        self.realized_cap += received_value;
    }

    pub fn send(
        &mut self,
        amount: WAmount,
        current_price: Price,
        sent_amount_price: Price,
    ) -> color_eyre::Result<ProfitOrLoss> {
        let previous_amount = self.amount;

        if previous_amount < amount {
            return Err(eyre!("previous_amount smaller than sent amount"));
        }

        let new_amount = previous_amount - amount;

        self.amount = new_amount;

        self.sent += amount;

        self.outputs_len -= 1;

        let previous_sent_dollar_value = sent_amount_price * amount;
        self.realized_cap -= previous_sent_dollar_value;

        let current_sent_dollar_value = current_price * amount;

        let profit_or_loss = if current_sent_dollar_value >= previous_sent_dollar_value {
            ProfitOrLoss::Profit(current_sent_dollar_value - previous_sent_dollar_value)
        } else {
            ProfitOrLoss::Loss(previous_sent_dollar_value - current_sent_dollar_value)
        };

        Ok(profit_or_loss)
    }

    #[inline(always)]
    pub fn is_empty(&self) -> bool {
        if self.amount == WAmount::ZERO {
            if self.outputs_len != 0 {
                unreachable!();
            }

            true
        } else {
            false
        }
    }

    pub fn from_empty(empty: &EmptyAddressData) -> Self {
        Self {
            address_type: empty.address_type,
            amount: WAmount::ZERO,
            sent: empty.transfered,
            received: empty.transfered,
            realized_cap: Price::ZERO,
            outputs_len: 0,
        }
    }

    pub fn compute_liquidity_classification(&self) -> LiquidityClassification {
        LiquidityClassification::new(self.sent, self.received)
    }
}

pub enum ProfitOrLoss {
    Profit(Price),
    Loss(Price),
}
