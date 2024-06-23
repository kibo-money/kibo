use std::thread;

mod _trait;
mod cohorts_states;
mod counters;
mod date_data_vec;

pub use _trait::*;

use allocative::Allocative;
pub use cohorts_states::*;
use counters::*;
use date_data_vec::*;

use crate::{databases::AddressIndexToAddressData, datasets::AllDatasets, utils::log};

#[derive(Default, Allocative)]
pub struct States {
    pub address_counters: Counters,
    pub date_data_vec: DateDataVec,
    pub address_cohorts_durable_states: AddressCohortsDurableStates,
    pub utxo_cohorts_durable_states: UTXOCohortsDurableStates,
}

impl States {
    pub fn import(
        address_index_to_address_data: &mut AddressIndexToAddressData,
        datasets: &AllDatasets,
    ) -> color_eyre::Result<Self> {
        let date_data_vec_handle = thread::spawn(DateDataVec::import);

        let address_counters = Counters::import()?;

        let date_data_vec = date_data_vec_handle.join().unwrap()?;

        // TODO:
        // For both address and utxo check if any of these datasets have a None min
        // If so use default state otherwise init
        // unrealized
        // price_paid
        // capitalization
        // supply
        // utxo

        let mut address_cohorts_durable_states = AddressCohortsDurableStates::default();

        let mut utxo_cohorts_durable_states = UTXOCohortsDurableStates::default();

        if let Some(first_date_data) = date_data_vec.first() {
            if let Some(first_block_data) = first_date_data.blocks.first() {
                let first_height = first_block_data.height as usize;
                let first_date = first_date_data.date;

                // TODO: Do the same for addresses
                address_cohorts_durable_states =
                    AddressCohortsDurableStates::init(address_index_to_address_data);

                if !datasets.utxo.needs_durable_states(first_height, first_date) {
                    utxo_cohorts_durable_states = UTXOCohortsDurableStates::init(&date_data_vec);
                }
            }
        }

        Ok(Self {
            address_cohorts_durable_states,
            address_counters,
            date_data_vec,
            utxo_cohorts_durable_states,
        })
    }

    pub fn reset(&mut self, include_addresses: bool) {
        log("Reseting all states...");

        let _ = self.date_data_vec.reset();

        self.utxo_cohorts_durable_states = UTXOCohortsDurableStates::default();

        // TODO: Check that they are ONLY computed in an `if include_addresses`
        if include_addresses {
            let _ = self.address_counters.reset();

            self.address_cohorts_durable_states = AddressCohortsDurableStates::default();
        }
    }

    pub fn export(&self) -> color_eyre::Result<()> {
        thread::scope(|s| {
            s.spawn(|| self.address_counters.export().unwrap());
            s.spawn(|| self.date_data_vec.export().unwrap());
        });

        Ok(())
    }
}
