use allocative::Allocative;
use itertools::Itertools;

use crate::{
    datasets::{
        AnyDataset, AnyDatasetGroup, ComputeData, InsertData, MinInitialStates, SubDataset,
    },
    states::{AddressCohortDurableStates, AddressCohortId},
    structs::{AddressSplit, AnyBiMap, AnyDateMap, AnyHeightMap, BiMap, Date, Height},
};

use super::cohort_metadata::MetadataDataset;

#[derive(Default, Allocative)]
pub struct CohortDataset {
    min_initial_states: MinInitialStates,

    split: AddressSplit,

    metadata: MetadataDataset,

    pub all: SubDataset,
    illiquid: SubDataset,
    liquid: SubDataset,
    highly_liquid: SubDataset,
}

impl CohortDataset {
    pub fn import(parent_path: &str, id: AddressCohortId) -> color_eyre::Result<Self> {
        let name = id.as_name().map(|s| s.to_owned());
        let split = id.as_split();

        let f = |s: &str| {
            if let Some(name) = &name {
                Some(format!("{s}/{name}"))
            } else {
                Some(s.to_owned())
            }
        };

        let mut s = Self {
            min_initial_states: MinInitialStates::default(),

            split,

            metadata: MetadataDataset::import(parent_path, &name)?,
            all: SubDataset::import(parent_path, &name)?,
            illiquid: SubDataset::import(parent_path, &f("illiquid"))?,
            liquid: SubDataset::import(parent_path, &f("liquid"))?,
            highly_liquid: SubDataset::import(parent_path, &f("highly_liquid"))?,
        };

        s.min_initial_states
            .consume(MinInitialStates::compute_from_dataset(&s));

        Ok(s)
    }

    pub fn sub_datasets_vec(&self) -> Vec<&SubDataset> {
        vec![&self.all, &self.illiquid, &self.liquid, &self.highly_liquid]
    }

    pub fn needs_insert_metadata(&self, height: Height, date: Date) -> bool {
        self.metadata.needs_insert(height, date)
    }

    pub fn needs_insert_utxo(&self, height: Height, date: Date) -> bool {
        self.sub_datasets_vec()
            .iter()
            .any(|sub| sub.utxo.needs_insert(height, date))
    }

    pub fn needs_insert_capitalization(&self, height: Height, date: Date) -> bool {
        self.sub_datasets_vec()
            .iter()
            .any(|sub| sub.capitalization.needs_insert(height, date))
    }

    pub fn needs_insert_supply(&self, height: Height, date: Date) -> bool {
        self.sub_datasets_vec()
            .iter()
            .any(|sub| sub.supply.needs_insert(height, date))
    }

    pub fn needs_insert_price_paid(&self, height: Height, date: Date) -> bool {
        self.sub_datasets_vec()
            .iter()
            .any(|sub| sub.price_paid.needs_insert(height, date))
    }

    pub fn needs_insert_realized(&self, height: Height, date: Date) -> bool {
        self.sub_datasets_vec()
            .iter()
            .any(|sub| sub.realized.needs_insert(height, date))
    }

    pub fn needs_insert_unrealized(&self, height: Height, date: Date) -> bool {
        self.sub_datasets_vec()
            .iter()
            .any(|sub| sub.unrealized.needs_insert(height, date))
    }

    pub fn needs_insert_input(&self, height: Height, date: Date) -> bool {
        self.sub_datasets_vec()
            .iter()
            .any(|sub| sub.input.needs_insert(height, date))
    }

    // fn needs_insert_output(&self, insert_data: &InsertData) -> bool {
    //     self.sub_datasets_vec()
    //         .iter()
    //         .any(|sub| sub.output.needs_insert(height, date))
    // }

    pub fn insert_realized_data(&mut self, insert_data: &InsertData) {
        let split_realized_state = insert_data
            .address_cohorts_realized_states
            .as_ref()
            .unwrap()
            .get(&self.split)
            .unwrap();

        self.all
            .realized
            .insert(insert_data, &split_realized_state.all);

        self.illiquid
            .realized
            .insert(insert_data, &split_realized_state.illiquid);

        self.liquid
            .realized
            .insert(insert_data, &split_realized_state.liquid);

        self.highly_liquid
            .realized
            .insert(insert_data, &split_realized_state.highly_liquid);
    }

    fn insert_metadata(&mut self, insert_data: &InsertData) {
        let address_count = insert_data
            .states
            .address_cohorts_durable_states
            .as_ref()
            .unwrap()
            .get(&self.split)
            .unwrap()
            .address_count;

        self.metadata.insert(insert_data, address_count);
    }

    fn insert_supply_data(
        &mut self,
        insert_data: &InsertData,
        liquidity_split_state: &AddressCohortDurableStates,
    ) {
        self.all.supply.insert(
            insert_data,
            &liquidity_split_state.split_durable_states.all.supply_state,
        );

        self.illiquid.supply.insert(
            insert_data,
            &liquidity_split_state
                .split_durable_states
                .illiquid
                .supply_state,
        );

        self.liquid.supply.insert(
            insert_data,
            &liquidity_split_state
                .split_durable_states
                .liquid
                .supply_state,
        );

        self.highly_liquid.supply.insert(
            insert_data,
            &liquidity_split_state
                .split_durable_states
                .highly_liquid
                .supply_state,
        );
    }

    fn insert_utxo_data(
        &mut self,
        insert_data: &InsertData,
        liquidity_split_state: &AddressCohortDurableStates,
    ) {
        self.all.utxo.insert(
            insert_data,
            &liquidity_split_state.split_durable_states.all.utxo_state,
        );

        self.illiquid.utxo.insert(
            insert_data,
            &liquidity_split_state
                .split_durable_states
                .illiquid
                .utxo_state,
        );

        self.liquid.utxo.insert(
            insert_data,
            &liquidity_split_state.split_durable_states.liquid.utxo_state,
        );

        self.highly_liquid.utxo.insert(
            insert_data,
            &liquidity_split_state
                .split_durable_states
                .highly_liquid
                .utxo_state,
        );
    }

    fn insert_capitalization_data(
        &mut self,
        insert_data: &InsertData,
        liquidity_split_state: &AddressCohortDurableStates,
    ) {
        self.all.capitalization.insert(
            insert_data,
            &liquidity_split_state
                .split_durable_states
                .all
                .capitalization_state,
        );

        self.illiquid.capitalization.insert(
            insert_data,
            &liquidity_split_state
                .split_durable_states
                .illiquid
                .capitalization_state,
        );

        self.liquid.capitalization.insert(
            insert_data,
            &liquidity_split_state
                .split_durable_states
                .liquid
                .capitalization_state,
        );

        self.highly_liquid.capitalization.insert(
            insert_data,
            &liquidity_split_state
                .split_durable_states
                .highly_liquid
                .capitalization_state,
        );
    }

    fn insert_unrealized_data(&mut self, insert_data: &InsertData) {
        let states = insert_data
            .address_cohorts_one_shot_states
            .as_ref()
            .unwrap()
            .get(&self.split)
            .unwrap();

        self.all.unrealized.insert(
            insert_data,
            &states.all.unrealized_block_state,
            &states.all.unrealized_date_state,
        );

        self.illiquid.unrealized.insert(
            insert_data,
            &states.illiquid.unrealized_block_state,
            &states.illiquid.unrealized_date_state,
        );

        self.liquid.unrealized.insert(
            insert_data,
            &states.liquid.unrealized_block_state,
            &states.liquid.unrealized_date_state,
        );

        self.highly_liquid.unrealized.insert(
            insert_data,
            &states.highly_liquid.unrealized_block_state,
            &states.highly_liquid.unrealized_date_state,
        );
    }

    fn insert_price_paid_data(&mut self, insert_data: &InsertData) {
        let states = insert_data
            .address_cohorts_one_shot_states
            .as_ref()
            .unwrap()
            .get(&self.split)
            .unwrap();

        self.all
            .price_paid
            .insert(insert_data, &states.all.price_paid_state);

        self.illiquid
            .price_paid
            .insert(insert_data, &states.illiquid.price_paid_state);

        self.liquid
            .price_paid
            .insert(insert_data, &states.liquid.price_paid_state);

        self.highly_liquid
            .price_paid
            .insert(insert_data, &states.highly_liquid.price_paid_state);
    }

    fn insert_input_data(&mut self, insert_data: &InsertData) {
        let state = insert_data
            .address_cohorts_input_states
            .as_ref()
            .unwrap()
            .get(&self.split)
            .unwrap();

        self.all.input.insert(insert_data, &state.all);
        self.illiquid.input.insert(insert_data, &state.illiquid);
        self.liquid.input.insert(insert_data, &state.liquid);
        self.highly_liquid
            .input
            .insert(insert_data, &state.highly_liquid);
    }

    // fn insert_output_data(&mut self, insert_data: &InsertData) {
    //     let state = insert_data
    //         .address_cohorts_output_states
    //         .as_ref()
    //         .unwrap()
    //         .get(&self.split)
    //         .unwrap();

    //     self.all.output.insert(insert_data, &state.all);
    //     self.illiquid.output.insert(insert_data, &state.illiquid);
    //     self.liquid.output.insert(insert_data, &state.liquid);
    //     self.highly_liquid
    //         .output
    //         .insert(insert_data, &state.highly_liquid);
    // }

    fn as_vec(&self) -> Vec<&(dyn AnyDataset + Send + Sync)> {
        vec![
            self.all.as_vec(),
            self.illiquid.as_vec(),
            self.liquid.as_vec(),
            self.highly_liquid.as_vec(),
            vec![&self.metadata],
        ]
        .into_iter()
        .flatten()
        .collect_vec()
    }

    fn as_mut_vec(&mut self) -> Vec<&mut dyn AnyDataset> {
        vec![
            self.all.as_mut_vec(),
            self.illiquid.as_mut_vec(),
            self.liquid.as_mut_vec(),
            self.highly_liquid.as_mut_vec(),
            vec![&mut self.metadata],
        ]
        .into_iter()
        .flatten()
        .collect_vec()
    }

    pub fn insert(&mut self, insert_data: &InsertData) {
        if !insert_data.compute_addresses {
            return;
        }

        let liquidity_split_processed_address_state = insert_data
            .states
            .address_cohorts_durable_states
            .as_ref()
            .unwrap()
            .get(&self.split);

        if liquidity_split_processed_address_state.is_none() {
            return; // TODO: Check if should panic instead
        }

        let liquidity_split_processed_address_state =
            liquidity_split_processed_address_state.unwrap();

        if self.needs_insert_metadata(insert_data.height, insert_data.date) {
            self.insert_metadata(insert_data);
        }

        if self.needs_insert_utxo(insert_data.height, insert_data.date) {
            self.insert_utxo_data(insert_data, liquidity_split_processed_address_state);
        }

        if self.needs_insert_capitalization(insert_data.height, insert_data.date) {
            self.insert_capitalization_data(insert_data, liquidity_split_processed_address_state);
        }

        if self.needs_insert_supply(insert_data.height, insert_data.date) {
            self.insert_supply_data(insert_data, liquidity_split_processed_address_state);
        }

        if self.needs_insert_realized(insert_data.height, insert_data.date) {
            self.insert_realized_data(insert_data);
        }

        if self.needs_insert_unrealized(insert_data.height, insert_data.date) {
            self.insert_unrealized_data(insert_data);
        }

        if self.needs_insert_price_paid(insert_data.height, insert_data.date) {
            self.insert_price_paid_data(insert_data);
        }

        if self.needs_insert_input(insert_data.height, insert_data.date) {
            self.insert_input_data(insert_data);
        }

        // if self.needs_insert_output(insert_data) {
        //     self.insert_output_data(insert_data);
        // }
    }

    // pub fn should_compute_metadata(&self, compute_data: &ComputeData) -> bool {
    //     self.metadata.should_compute(compute_data)
    // }

    // pub fn should_compute_utxo(&self, compute_data: &ComputeData) -> bool {
    //     self.sub_datasets_vec()
    //         .iter()
    //         .any(|sub| sub.utxo.should_compute(compute_data))
    // }

    pub fn should_compute_supply(&self, compute_data: &ComputeData) -> bool {
        self.sub_datasets_vec()
            .iter()
            .any(|sub| sub.supply.should_compute(compute_data))
    }

    pub fn should_compute_capitalization(&self, compute_data: &ComputeData) -> bool {
        self.sub_datasets_vec()
            .iter()
            .any(|sub| sub.capitalization.should_compute(compute_data))
    }

    fn should_compute_realized(&self, compute_data: &ComputeData) -> bool {
        self.sub_datasets_vec()
            .iter()
            .any(|sub| sub.realized.should_compute(compute_data))
    }

    fn should_compute_unrealized(&self, compute_data: &ComputeData) -> bool {
        self.sub_datasets_vec()
            .iter()
            .any(|sub| sub.unrealized.should_compute(compute_data))
    }

    // fn should_compute_input(&self, compute_data: &ComputeData) -> bool {
    //     self.sub_datasets_vec()
    //         .iter()
    //         .any(|sub| sub.input.should_compute(compute_data))
    // }

    // fn should_compute_output(&self, compute_data: &ComputeData) -> bool {
    //     self.sub_datasets_vec()
    //         .iter()
    //         .any(|sub| sub.output.should_compute(compute_data))
    // }

    fn compute_supply_data(
        &mut self,
        compute_data: &ComputeData,
        circulating_supply: &mut BiMap<f64>,
    ) {
        self.all.supply.compute(compute_data, circulating_supply);

        self.illiquid
            .supply
            .compute(compute_data, circulating_supply);

        self.liquid.supply.compute(compute_data, circulating_supply);

        self.highly_liquid
            .supply
            .compute(compute_data, circulating_supply);
    }

    fn compute_unrealized_data(
        &mut self,
        compute_data: &ComputeData,
        circulating_supply: &mut BiMap<f64>,
        market_cap: &mut BiMap<f32>,
    ) {
        self.all.unrealized.compute(
            compute_data,
            &mut self.all.supply.supply,
            circulating_supply,
            market_cap,
        );

        self.illiquid.unrealized.compute(
            compute_data,
            &mut self.illiquid.supply.supply,
            circulating_supply,
            market_cap,
        );

        self.liquid.unrealized.compute(
            compute_data,
            &mut self.liquid.supply.supply,
            circulating_supply,
            market_cap,
        );

        self.highly_liquid.unrealized.compute(
            compute_data,
            &mut self.highly_liquid.supply.supply,
            circulating_supply,
            market_cap,
        );
    }

    fn compute_realized_data(&mut self, compute_data: &ComputeData, market_cap: &mut BiMap<f32>) {
        self.all.realized.compute(compute_data, market_cap);

        self.illiquid.realized.compute(compute_data, market_cap);

        self.liquid.realized.compute(compute_data, market_cap);

        self.highly_liquid
            .realized
            .compute(compute_data, market_cap);
    }

    fn compute_capitalization_data(&mut self, compute_data: &ComputeData, closes: &mut BiMap<f32>) {
        self.all
            .capitalization
            .compute(compute_data, closes, &mut self.all.supply.supply);

        self.illiquid.capitalization.compute(
            compute_data,
            closes,
            &mut self.illiquid.supply.supply,
        );

        self.liquid
            .capitalization
            .compute(compute_data, closes, &mut self.liquid.supply.supply);

        self.highly_liquid.capitalization.compute(
            compute_data,
            closes,
            &mut self.highly_liquid.supply.supply,
        );
    }

    // fn compute_output_data(&mut self, compute_data: &ComputeData) {
    //     self.all
    //         .output
    //         .compute(compute_data, &mut self.all.supply.total);

    //     self.illiquid
    //         .output
    //         .compute(compute_data, &mut self.illiquid.supply.total);

    //     self.liquid
    //         .output
    //         .compute(compute_data, &mut self.liquid.supply.total);

    //     self.highly_liquid
    //         .output
    //         .compute(compute_data, &mut self.highly_liquid.supply.total);
    // }

    pub fn compute(
        &mut self,
        compute_data: &ComputeData,
        closes: &mut BiMap<f32>,
        circulating_supply: &mut BiMap<f64>,
        market_cap: &mut BiMap<f32>,
    ) {
        if self.should_compute_supply(compute_data) {
            self.compute_supply_data(compute_data, circulating_supply);
        }

        if self.should_compute_unrealized(compute_data) {
            self.compute_unrealized_data(compute_data, circulating_supply, market_cap);
        }

        if self.should_compute_realized(compute_data) {
            self.compute_realized_data(compute_data, market_cap);
        }

        // MUST BE after compute_supply
        if self.should_compute_capitalization(compute_data) {
            self.compute_capitalization_data(compute_data, closes);
        }

        // if self.should_compute_output(compute_data) {
        //     self.compute_output_data(compute_data);
        // }
    }
}

impl AnyDataset for CohortDataset {
    fn to_inserted_height_map_vec(&self) -> Vec<&(dyn AnyHeightMap + Send + Sync)> {
        self.as_vec()
            .into_iter()
            .flat_map(|d| d.to_inserted_height_map_vec())
            .collect_vec()
    }

    fn to_inserted_date_map_vec(&self) -> Vec<&(dyn AnyDateMap + Send + Sync)> {
        self.as_vec()
            .into_iter()
            .flat_map(|d| d.to_inserted_date_map_vec())
            .collect_vec()
    }

    fn to_inserted_bi_map_vec(&self) -> Vec<&(dyn AnyBiMap + Send + Sync)> {
        self.as_vec()
            .into_iter()
            .flat_map(|d| d.to_inserted_bi_map_vec())
            .collect_vec()
    }

    fn to_inserted_mut_height_map_vec(&mut self) -> Vec<&mut dyn AnyHeightMap> {
        self.as_mut_vec()
            .into_iter()
            .flat_map(|d| d.to_inserted_mut_height_map_vec())
            .collect_vec()
    }

    fn to_inserted_mut_date_map_vec(&mut self) -> Vec<&mut dyn AnyDateMap> {
        self.as_mut_vec()
            .into_iter()
            .flat_map(|d| d.to_inserted_mut_date_map_vec())
            .collect_vec()
    }

    fn to_inserted_mut_bi_map_vec(&mut self) -> Vec<&mut dyn AnyBiMap> {
        self.as_mut_vec()
            .into_iter()
            .flat_map(|d| d.to_inserted_mut_bi_map_vec())
            .collect_vec()
    }

    fn to_computed_height_map_vec(&self) -> Vec<&(dyn AnyHeightMap + Send + Sync)> {
        self.as_vec()
            .into_iter()
            .flat_map(|d| d.to_computed_height_map_vec())
            .collect_vec()
    }

    fn to_computed_date_map_vec(&self) -> Vec<&(dyn AnyDateMap + Send + Sync)> {
        self.as_vec()
            .into_iter()
            .flat_map(|d| d.to_computed_date_map_vec())
            .collect_vec()
    }

    fn to_computed_bi_map_vec(&self) -> Vec<&(dyn AnyBiMap + Send + Sync)> {
        self.as_vec()
            .into_iter()
            .flat_map(|d| d.to_computed_bi_map_vec())
            .collect_vec()
    }

    fn to_computed_mut_height_map_vec(&mut self) -> Vec<&mut dyn AnyHeightMap> {
        self.as_mut_vec()
            .into_iter()
            .flat_map(|d| d.to_computed_mut_height_map_vec())
            .collect_vec()
    }

    fn to_computed_mut_date_map_vec(&mut self) -> Vec<&mut dyn AnyDateMap> {
        self.as_mut_vec()
            .into_iter()
            .flat_map(|d| d.to_computed_mut_date_map_vec())
            .collect_vec()
    }

    fn to_computed_mut_bi_map_vec(&mut self) -> Vec<&mut dyn AnyBiMap> {
        self.as_mut_vec()
            .into_iter()
            .flat_map(|d| d.to_computed_mut_bi_map_vec())
            .collect_vec()
    }

    fn get_min_initial_states(&self) -> &MinInitialStates {
        &self.min_initial_states
    }
}
