use derive_deref::{Deref, DerefMut};

use crate::{
    states::InputState,
    structs::{AddressRealizedData, LiquidityClassification, SplitByLiquidity, WAmount},
};

use super::SplitByAddressCohort;

#[derive(Deref, DerefMut, Default)]
pub struct AddressCohortsInputStates(SplitByAddressCohort<SplitByLiquidity<InputState>>);

impl AddressCohortsInputStates {
    pub fn iterate_input(
        &mut self,
        realized_data: &AddressRealizedData,
        liquidity_classification: &LiquidityClassification,
    ) -> color_eyre::Result<()> {
        let count = realized_data.utxos_destroyed as f64;
        let sent = realized_data.sent;

        let split_count = liquidity_classification.split(count);
        let split_volume = liquidity_classification.split(sent.to_sat() as f64);

        let iterate = move |state: &mut SplitByLiquidity<InputState>| -> color_eyre::Result<()> {
            state.all.iterate(count, sent);

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
