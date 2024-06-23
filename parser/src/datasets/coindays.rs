use allocative::Allocative;

use crate::{
    datasets::AnyDataset,
    structs::{AnyBiMap, BiMap},
};

use super::{InsertData, MinInitialStates};

#[derive(Allocative)]
pub struct CoindaysDataset {
    min_initial_states: MinInitialStates,

    // Inserted
    pub coindays_destroyed: BiMap<f32>,
}

impl CoindaysDataset {
    pub fn import(parent_path: &str) -> color_eyre::Result<Self> {
        let f = |s: &str| format!("{parent_path}/{s}");

        let mut s = Self {
            min_initial_states: MinInitialStates::default(),

            coindays_destroyed: BiMap::new_bin(1, &f("coindays_destroyed")),
        };

        s.min_initial_states
            .consume(MinInitialStates::compute_from_dataset(&s));

        Ok(s)
    }

    pub fn insert(
        &mut self,
        &InsertData {
            height,
            satdays_destroyed,
            date_blocks_range,
            is_date_last_block,
            date,
            ..
        }: &InsertData,
    ) {
        self.coindays_destroyed
            .height
            .insert(height, satdays_destroyed.to_btc() as f32);

        if is_date_last_block {
            self.coindays_destroyed
                .date_insert_sum_range(date, date_blocks_range)
        }
    }
}

impl AnyDataset for CoindaysDataset {
    fn to_inserted_bi_map_vec(&self) -> Vec<&(dyn AnyBiMap + Send + Sync)> {
        vec![&self.coindays_destroyed]
    }

    fn to_inserted_mut_bi_map_vec(&mut self) -> Vec<&mut dyn AnyBiMap> {
        vec![&mut self.coindays_destroyed]
    }

    fn get_min_initial_states(&self) -> &MinInitialStates {
        &self.min_initial_states
    }
}
