mod all_metadata;
mod cohort;
mod cohort_metadata;

use allocative::Allocative;
use itertools::Itertools;
use rayon::prelude::*;

use crate::{states::SplitByAddressCohort, structs::BiMap};

use self::{all_metadata::AllAddressesMetadataDataset, cohort::CohortDataset};

use super::{AnyDataset, AnyDatasets, ComputeData, InsertData, MinInitialStates};

#[derive(Allocative)]
pub struct AddressDatasets {
    min_initial_states: MinInitialStates,

    metadata: AllAddressesMetadataDataset,

    pub cohorts: SplitByAddressCohort<CohortDataset>,
}

impl AddressDatasets {
    pub fn import(parent_path: &str) -> color_eyre::Result<Self> {
        let mut cohorts = SplitByAddressCohort::<CohortDataset>::default();

        cohorts
            .as_vec()
            .into_par_iter()
            .map(|(_, id)| (id, CohortDataset::import(parent_path, id)))
            .collect::<Vec<_>>()
            .into_iter()
            .try_for_each(|(id, dataset)| -> color_eyre::Result<()> {
                *cohorts.get_mut_from_id(&id) = dataset?;
                Ok(())
            })?;

        let mut s = Self {
            min_initial_states: MinInitialStates::default(),

            metadata: AllAddressesMetadataDataset::import(parent_path)?,

            cohorts,
        };

        s.min_initial_states
            .consume(MinInitialStates::compute_from_datasets(&s));

        Ok(s)
    }

    pub fn insert(&mut self, insert_data: &InsertData) {
        self.metadata.insert(insert_data);

        self.cohorts
            .as_mut_vec()
            .into_iter()
            .for_each(|(cohort, _)| cohort.insert(insert_data))
    }

    // pub fn needs_insert_utxo(&self, height: usize, date: WNaiveDate) -> bool {
    //     self.cohorts
    //         .as_vec()
    //         .iter()
    //         .any(|(dataset, _)| dataset.utxo.needs_insert(height, date))
    // }

    // pub fn needs_insert_capitalization(&self, height: usize, date: WNaiveDate) -> bool {
    //     self.cohorts
    //         .as_vec()
    //         .iter()
    //         .any(|(dataset, _)| dataset.capitalization.needs_insert(height, date))
    // }

    // pub fn needs_insert_supply(&self, height: usize, date: WNaiveDate) -> bool {
    //     self.cohorts
    //         .as_vec()
    //         .iter()
    //         .any(|(dataset, _)| dataset.supply.needs_insert(height, date))
    // }

    // pub fn needs_insert_price_paid(&self, height: usize, date: WNaiveDate) -> bool {
    //     self.cohorts
    //         .as_vec()
    //         .iter()
    //         .any(|(dataset, _)| dataset.price_paid.needs_insert(height, date))
    // }

    // fn needs_insert_realized(&self, height: usize, date: WNaiveDate) -> bool {
    //     self.cohorts
    //         .as_vec()
    //         .iter()
    //         .any(|(dataset, _)| dataset.realized.needs_insert(height, date))
    // }

    // fn needs_insert_unrealized(&self, height: usize, date: WNaiveDate) -> bool {
    //     self.cohorts
    //         .as_vec()
    //         .iter()
    //         .any(|(dataset, _)| dataset.unrealized.needs_insert(height, date))
    // }

    // fn needs_insert_input(&self, height: usize, date: WNaiveDate) -> bool {
    //     self.cohorts
    //         .as_vec()
    //         .iter()
    //         .any(|(dataset, _)| dataset.input.needs_insert(height, date))
    // }

    pub fn compute(
        &mut self,
        compute_data: &ComputeData,
        closes: &mut BiMap<f32>,
        circulating_supply: &mut BiMap<f64>,
        market_cap: &mut BiMap<f32>,
    ) {
        self.metadata.compute(compute_data);

        self.cohorts
            .as_mut_vec()
            .into_iter()
            .for_each(|(cohort, _)| {
                cohort.compute(compute_data, closes, circulating_supply, market_cap)
            })
    }
}

impl AnyDatasets for AddressDatasets {
    fn get_min_initial_states(&self) -> &MinInitialStates {
        &self.min_initial_states
    }

    fn to_any_dataset_vec(&self) -> Vec<&(dyn AnyDataset + Send + Sync)> {
        self.cohorts
            .as_vec()
            .into_iter()
            .map(|(d, _)| d as &(dyn AnyDataset + Send + Sync))
            .chain(vec![&self.metadata as &(dyn AnyDataset + Send + Sync)])
            .collect_vec()
    }

    fn to_mut_any_dataset_vec(&mut self) -> Vec<&mut dyn AnyDataset> {
        self.cohorts
            .as_mut_vec()
            .into_iter()
            .map(|(d, _)| d as &mut dyn AnyDataset)
            .chain(vec![&mut self.metadata as &mut dyn AnyDataset])
            .collect_vec()
    }
}
