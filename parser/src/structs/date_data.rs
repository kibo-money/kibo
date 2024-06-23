use allocative::Allocative;
use bincode::{Decode, Encode};

use super::{BlockData, BlockPath, WNaiveDate};

#[derive(Debug, Encode, Decode, Allocative)]
pub struct DateData {
    pub date: WNaiveDate,
    pub blocks: Vec<BlockData>,
}

impl DateData {
    pub fn new(date: WNaiveDate, blocks: Vec<BlockData>) -> Self {
        Self { date, blocks }
    }

    pub fn get_block_data(&self, block_path: &BlockPath) -> Option<&BlockData> {
        self.blocks.get(block_path.block_index as usize)
    }
}
