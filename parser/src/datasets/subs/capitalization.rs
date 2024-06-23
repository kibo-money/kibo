use allocative::Allocative;

use crate::{
    datasets::{AnyDataset, ComputeData, InsertData, MinInitialStates},
    states::CapitalizationState,
    structs::{AnyBiMap, BiMap},
    utils::ONE_MONTH_IN_DAYS,
};

#[derive(Default, Allocative)]
pub struct CapitalizationDataset {
    min_initial_states: MinInitialStates,

    // Inserted
    pub realized_cap: BiMap<f32>,

    // Computed
    pub realized_price: BiMap<f32>,
    mvrv: BiMap<f32>,
    realized_cap_1m_net_change: BiMap<f32>,
}

impl CapitalizationDataset {
    pub fn import(parent_path: &str) -> color_eyre::Result<Self> {
        let f = |s: &str| format!("{parent_path}/{s}");

        let mut s = Self {
            min_initial_states: MinInitialStates::default(),

            realized_cap: BiMap::new_bin(1, &f("realized_cap")),
            realized_cap_1m_net_change: BiMap::new_bin(1, &f("realized_cap_1m_net_change")),
            realized_price: BiMap::new_bin(1, &f("realized_price")),
            mvrv: BiMap::new_bin(1, &f("mvrv")),
        };

        s.min_initial_states
            .consume(MinInitialStates::compute_from_dataset(&s));

        Ok(s)
    }

    pub fn insert(
        &mut self,
        &InsertData {
            height,
            is_date_last_block,
            date,
            ..
        }: &InsertData,
        state: &CapitalizationState,
    ) {
        let realized_cap = self
            .realized_cap
            .height
            .insert(height, state.realized_cap.to_dollar() as f32);

        if is_date_last_block {
            self.realized_cap.date.insert(date, realized_cap);
        }
    }

    pub fn compute(
        &mut self,
        &ComputeData { heights, dates }: &ComputeData,
        closes: &mut BiMap<f32>,
        cohort_supply: &mut BiMap<f64>,
    ) {
        self.realized_price.multi_insert_divide(
            heights,
            dates,
            &mut self.realized_cap,
            cohort_supply,
        );

        self.mvrv.height.multi_insert_divide(
            heights,
            &mut closes.height,
            &mut self.realized_price.height,
        );
        self.mvrv
            .date
            .multi_insert_divide(dates, &mut closes.date, &mut self.realized_price.date);

        self.realized_cap_1m_net_change.multi_insert_net_change(
            heights,
            dates,
            &mut self.realized_cap,
            ONE_MONTH_IN_DAYS,
        )
    }
}

impl AnyDataset for CapitalizationDataset {
    fn get_min_initial_states(&self) -> &MinInitialStates {
        &self.min_initial_states
    }

    fn to_inserted_bi_map_vec(&self) -> Vec<&(dyn AnyBiMap + Send + Sync)> {
        vec![&self.realized_cap]
    }

    fn to_inserted_mut_bi_map_vec(&mut self) -> Vec<&mut dyn AnyBiMap> {
        vec![&mut self.realized_cap]
    }

    fn to_computed_bi_map_vec(&self) -> Vec<&(dyn AnyBiMap + Send + Sync)> {
        vec![
            &self.realized_price,
            &self.mvrv,
            &self.realized_cap_1m_net_change,
        ]
    }

    fn to_computed_mut_bi_map_vec(&mut self) -> Vec<&mut dyn AnyBiMap> {
        vec![
            &mut self.realized_price,
            &mut self.mvrv,
            &mut self.realized_cap_1m_net_change,
        ]
    }
}
