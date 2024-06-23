use allocative::Allocative;
use color_eyre::eyre::eyre;

use crate::structs::WAmount;

#[derive(Debug, Default, Allocative)]
pub struct SupplyState {
    pub supply: WAmount,
}

impl SupplyState {
    pub fn increment(&mut self, amount: WAmount) {
        self.supply += amount;
    }

    pub fn decrement(&mut self, amount: WAmount) -> color_eyre::Result<()> {
        if self.supply < amount {
            dbg!(self.supply, amount);

            return Err(eyre!("supply smaller than supply"));
        }

        self.supply -= amount;

        Ok(())
    }
}
