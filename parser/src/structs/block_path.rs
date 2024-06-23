use allocative::Allocative;
use bincode::{Decode, Encode};

#[derive(Debug, Clone, PartialEq, PartialOrd, Eq, Ord, Copy, Encode, Decode, Allocative)]
pub struct BlockPath {
    pub date_index: u16,
    pub block_index: u16,
}

impl BlockPath {
    pub fn new(date_index: u16, block_index: u16) -> Self {
        Self {
            date_index,
            block_index,
        }
    }
}

impl std::hash::Hash for BlockPath {
    fn hash<H: std::hash::Hasher>(&self, hasher: &mut H) {
        hasher.write_u32(((self.date_index as u32) << 16_u32) + self.block_index as u32)
    }
}

// impl nohash::IsEnabled for BlockPath {}
