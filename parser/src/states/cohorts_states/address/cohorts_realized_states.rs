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
        let realized_profit = realized_data.profit;
        let realized_loss = realized_data.loss;
        let value_created = realized_data.value_created;
        let value_destroyed = realized_data.value_destroyed;

        let split_realized_profit =
            liquidity_classification.split(realized_profit.to_cent() as f64);
        let split_realized_loss = liquidity_classification.split(realized_loss.to_cent() as f64);
        let split_value_created = liquidity_classification.split(value_created.to_cent() as f64);
        let split_value_destroyed =
            liquidity_classification.split(value_destroyed.to_cent() as f64);

        let iterate = move |state: &mut SplitByLiquidity<RealizedState>| -> color_eyre::Result<()> {
            state.all.iterate(
                realized_profit,
                realized_loss,
                value_created,
                value_destroyed,
            );

            state.illiquid.iterate(
                Price::from_cent(split_realized_profit.illiquid as u64),
                Price::from_cent(split_realized_loss.illiquid as u64),
                Price::from_cent(split_value_created.illiquid as u64),
                Price::from_cent(split_value_destroyed.illiquid as u64),
            );

            state.liquid.iterate(
                Price::from_cent(split_realized_profit.liquid as u64),
                Price::from_cent(split_realized_loss.liquid as u64),
                Price::from_cent(split_value_created.liquid as u64),
                Price::from_cent(split_value_destroyed.liquid as u64),
            );

            state.highly_liquid.iterate(
                Price::from_cent(split_realized_profit.highly_liquid as u64),
                Price::from_cent(split_realized_loss.highly_liquid as u64),
                Price::from_cent(split_value_created.highly_liquid as u64),
                Price::from_cent(split_value_destroyed.highly_liquid as u64),
            );

            Ok(())
        };

        self.iterate(&realized_data.initial_address_data, iterate)
    }
}
