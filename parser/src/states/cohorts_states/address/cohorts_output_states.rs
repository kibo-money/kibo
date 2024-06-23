use derive_deref::{Deref, DerefMut};

use crate::{
    states::OutputState,
    structs::{AddressRealizedData, LiquidityClassification, SplitByLiquidity, WAmount},
};

use super::SplitByAddressCohort;

#[derive(Deref, DerefMut, Default)]
pub struct AddressCohortsOutputStates(SplitByAddressCohort<SplitByLiquidity<OutputState>>);

impl AddressCohortsOutputStates {
    pub fn iterate_output(
        &mut self,
        realized_data: &AddressRealizedData,
        liquidity_classification: &LiquidityClassification,
    ) -> color_eyre::Result<()> {
        let count = realized_data.utxos_created as f64;
        let volume = realized_data.received;

        let split_count = liquidity_classification.split(count);
        let split_volume = liquidity_classification.split(volume.to_sat() as f64);

        let iterate = move |state: &mut SplitByLiquidity<OutputState>| -> color_eyre::Result<()> {
            state.all.iterate(count, volume);

            state.illiquid.iterate(
                split_count.illiquid,
                WAmount::from_sat(split_volume.illiquid.round() as u64),
            );

            state.liquid.iterate(
                split_count.liquid,
                WAmount::from_sat(split_volume.liquid.round() as u64),
            );

            state.highly_liquid.iterate(
                split_count.highly_liquid,
                WAmount::from_sat(split_volume.highly_liquid.round() as u64),
            );

            Ok(())
        };

        self.iterate(&realized_data.initial_address_data, iterate)
    }
}
