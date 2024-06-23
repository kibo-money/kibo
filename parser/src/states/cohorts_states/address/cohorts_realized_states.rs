use derive_deref::{Deref, DerefMut};

use crate::{
    states::RealizedState,
    structs::{AddressRealizedData, LiquidityClassification, Price, SplitByLiquidity},
};

use super::SplitByAddressCohort;

#[derive(Deref, DerefMut, Default)]
pub struct AddressCohortsRealizedStates(SplitByAddressCohort<SplitByLiquidity<RealizedState>>);

impl AddressCohortsRealizedStates {
    pub fn iterate_realized(
        &mut self,
        realized_data: &AddressRealizedData,
        liquidity_classification: &LiquidityClassification,
    ) -> color_eyre::Result<()> {
        let profit = realized_data.profit;
        let loss = realized_data.loss;

        let split_profit = liquidity_classification.split(profit.to_cent() as f64);
        let split_loss = liquidity_classification.split(loss.to_cent() as f64);

        let iterate = move |state: &mut SplitByLiquidity<RealizedState>| -> color_eyre::Result<()> {
            state.all.iterate(profit, loss);

            state.illiquid.iterate(
                Price::from_cent(split_profit.illiquid as u64),
                Price::from_cent(split_loss.illiquid as u64),
            );

            state.liquid.iterate(
                Price::from_cent(split_profit.liquid as u64),
                Price::from_cent(split_loss.liquid as u64),
            );

            state.highly_liquid.iterate(
                Price::from_cent(split_profit.highly_liquid as u64),
                Price::from_cent(split_loss.highly_liquid as u64),
            );

            Ok(())
        };

        self.iterate(&realized_data.initial_address_data, iterate)
    }
}
