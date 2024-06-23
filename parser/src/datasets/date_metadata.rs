use allocative::Allocative;

use crate::{
    datasets::AnyDataset,
    structs::{AnyDateMap, DateMap},
};

use super::{InsertData, MinInitialStates};

#[derive(Allocative)]
pub struct DateMetadataDataset {
    min_initial_states: MinInitialStates,

    // Inserted
    pub first_height: DateMap<usize>,
    pub last_height: DateMap<usize>,
}

impl DateMetadataDataset {
    pub fn import(parent_path: &str) -> color_eyre::Result<Self> {
        let f = |s: &str| format!("{parent_path}/{s}");

        let mut s = Self {
            min_initial_states: MinInitialStates::default(),

            first_height: DateMap::new_bin(1, &f("first_height")),
            last_height: DateMap::new_bin(1, &f("last_height")),
        };

        s.min_initial_states
            .consume(MinInitialStates::compute_from_dataset(&s));

        Ok(s)
    }

    pub fn insert(
        &mut self,
        &InsertData {
            date,
            date_first_height,
            height,
            ..
        }: &InsertData,
    ) {
        self.first_height.insert(date, date_first_height);

        self.last_height.insert(date, height);
    }
}

impl AnyDataset for DateMetadataDataset {
    fn to_inserted_date_map_vec(&self) -> Vec<&(dyn AnyDateMap + Send + Sync)> {
        vec![&self.first_height, &self.last_height]
    }

    fn to_inserted_mut_date_map_vec(&mut self) -> Vec<&mut dyn AnyDateMap> {
        vec![&mut self.first_height, &mut self.last_height]
    }

    fn get_min_initial_states(&self) -> &MinInitialStates {
        &self.min_initial_states
    }
}
