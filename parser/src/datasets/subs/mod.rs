use allocative::Allocative;

mod capitalization;
mod input;
// mod output;
mod price_paid;
mod realized;
mod supply;
mod unrealized;
mod utxo;

pub use capitalization::*;
pub use input::*;
// pub use output::*;
pub use price_paid::*;
pub use realized::*;
pub use supply::*;
pub use unrealized::*;
pub use utxo::*;

use crate::datasets::AnyDataset;

use super::AnyDatasetGroup;

#[derive(Default, Allocative)]
pub struct SubDataset {
    pub capitalization: CapitalizationDataset,
    pub input: InputSubDataset,
    // pub output: OutputSubDataset,
    pub price_paid: PricePaidSubDataset,
    pub realized: RealizedSubDataset,
    pub supply: SupplySubDataset,
    pub unrealized: UnrealizedSubDataset,
    pub utxo: UTXOSubDataset,
}

impl SubDataset {
    pub fn import(parent_path: &str) -> color_eyre::Result<Self> {
        let s = Self {
            capitalization: CapitalizationDataset::import(parent_path)?,
            input: InputSubDataset::import(parent_path)?,
            // output: OutputSubDataset::import(parent_path)?,
            price_paid: PricePaidSubDataset::import(parent_path)?,
            realized: RealizedSubDataset::import(parent_path)?,
            supply: SupplySubDataset::import(parent_path)?,
            unrealized: UnrealizedSubDataset::import(parent_path)?,
            utxo: UTXOSubDataset::import(parent_path)?,
        };

        Ok(s)
    }
}

impl AnyDatasetGroup for SubDataset {
    fn as_vec(&self) -> Vec<&(dyn AnyDataset + Send + Sync)> {
        vec![
            &self.capitalization,
            &self.price_paid,
            &self.realized,
            &self.supply,
            &self.unrealized,
            &self.utxo,
            &self.input,
            // &self.output,
        ]
    }

    fn as_mut_vec(&mut self) -> Vec<&mut dyn AnyDataset> {
        vec![
            &mut self.capitalization,
            &mut self.price_paid,
            &mut self.realized,
            &mut self.supply,
            &mut self.unrealized,
            &mut self.utxo,
            &mut self.input,
            // &mut self.output,
        ]
    }
}
