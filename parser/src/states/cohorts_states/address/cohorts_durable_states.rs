use allocative::Allocative;
use color_eyre::eyre::eyre;
use derive_deref::{Deref, DerefMut};
use rayon::prelude::*;

use crate::{
    databases::AddressIndexToAddressData,
    structs::{AddressData, AddressRealizedData, Price},
};

use super::{AddressCohortDurableStates, AddressCohortsOneShotStates, SplitByAddressCohort};

#[derive(Default, Deref, DerefMut, Allocative)]
pub struct AddressCohortsDurableStates(SplitByAddressCohort<AddressCohortDurableStates>);

impl AddressCohortsDurableStates {
    pub fn init(address_index_to_address_data: &mut AddressIndexToAddressData) -> Self {
        let mut s = Self::default();

        // Paralize that, different s could be added together
        address_index_to_address_data
            .iter(&mut |(_, address_data)| s.increment(address_data).unwrap());

        s
    }

    pub fn iterate(
        &mut self,
        address_realized_data: &AddressRealizedData,
        current_address_data: &AddressData,
    ) -> color_eyre::Result<()> {
        self.decrement(&address_realized_data.initial_address_data)
            .inspect_err(|report| {
                dbg!(report);
                dbg!(address_realized_data, current_address_data);
                dbg!("decrement initial address_data");
            })?;

        self.increment(current_address_data).inspect_err(|report| {
            dbg!(report);
            dbg!(address_realized_data, current_address_data);
            dbg!("increment address_data");
        })?;

        Ok(())
    }

    /// Should always increment using current address data state
    fn increment(&mut self, address_data: &AddressData) -> color_eyre::Result<()> {
        self._crement(address_data, true)
    }

    /// Should always decrement using initial address data state
    fn decrement(&mut self, address_data: &AddressData) -> color_eyre::Result<()> {
        self._crement(address_data, false)
    }

    fn _crement(&mut self, address_data: &AddressData, increment: bool) -> color_eyre::Result<()> {
        // No need to either insert or remove if empty
        if address_data.is_empty() {
            return Ok(());
        }

        let amount = address_data.amount;
        let utxo_count = address_data.outputs_len as usize;
        let realized_cap = address_data.realized_cap;

        let mean_price_paid = address_data.realized_cap / amount;

        let liquidity_classification = address_data.compute_liquidity_classification();

        let split_sat_amount = liquidity_classification.split(amount.to_sat() as f64);
        let split_utxo_count = liquidity_classification.split(utxo_count as f64);
        let split_realized_cap = liquidity_classification.split(utxo_count as f64);

        self.0
            .iterate(address_data, |state: &mut AddressCohortDurableStates| {
                if increment {
                    if let Err(report) = state.increment(
                        amount,
                        utxo_count,
                        realized_cap,
                        mean_price_paid,
                        &split_sat_amount,
                        &split_utxo_count,
                        &split_realized_cap,
                    ) {
                        dbg!(
                            report.to_string(),
                            &state,
                            &address_data,
                            &liquidity_classification
                        );
                        return Err(eyre!("increment error"));
                    }
                } else if let Err(report) = state.decrement(
                    amount,
                    utxo_count,
                    realized_cap,
                    mean_price_paid,
                    &split_sat_amount,
                    &split_utxo_count,
                    &split_realized_cap,
                ) {
                    dbg!(
                        report.to_string(),
                        &state,
                        &address_data,
                        &liquidity_classification
                    );
                    return Err(eyre!("decrement error"));
                }

                Ok(())
            })?;

        Ok(())
    }

    pub fn compute_one_shot_states(
        &mut self,
        block_price: Price,
        date_price: Option<Price>,
    ) -> AddressCohortsOneShotStates {
        let mut one_shot_states = AddressCohortsOneShotStates::default();

        self.as_vec()
            .into_par_iter()
            .map(|(states, address_cohort_id)| {
                (
                    address_cohort_id,
                    states.compute_one_shot_states(block_price, date_price),
                )
            })
            .collect::<Vec<_>>()
            .into_iter()
            .for_each(|(address_cohort_id, states)| {
                *one_shot_states.get_mut_from_id(&address_cohort_id) = states;
            });

        one_shot_states
    }
}
