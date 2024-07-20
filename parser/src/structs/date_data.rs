use allocative::Allocative;
use bincode::{Decode, Encode};

use super::{BlockData, BlockPath, Date};

#[derive(Debug, Encode, Decode, Allocative)]
pub struct DateData {
    pub date: Date,
    pub blocks: Vec<BlockData>,
}

impl DateData {
    pub fn new(date: Date, blocks: Vec<BlockData>) -> Self {
        Self { date, blocks }
    }

    pub fn get_block_data(&self, block_path: &BlockPath) -> Option<&BlockData> {
        self.blocks.get(block_path.block_index as usize)
    }
}
