use allocative::Allocative;
use derive_deref::{Deref, DerefMut};

use crate::HEIGHT_MAP_CHUNK_SIZE;

use super::{Height, MapChunkId};

#[derive(
    Debug, Default, PartialEq, Eq, PartialOrd, Ord, Clone, Copy, Allocative, Deref, DerefMut,
)]
pub struct HeightMapChunkId(Height);

impl HeightMapChunkId {
    pub fn new(height: &Height) -> Self {
        Self(Height::new(
            **height / HEIGHT_MAP_CHUNK_SIZE * HEIGHT_MAP_CHUNK_SIZE,
        ))
    }
}

impl MapChunkId for HeightMapChunkId {
    fn to_name(&self) -> String {
        let start = ***self;
        let end = start + HEIGHT_MAP_CHUNK_SIZE;

        format!("{start}..{end}")
    }

    fn from_name(name: &str) -> Self {
        Self(Height::new(
            name.split("..").next().unwrap().parse::<u32>().unwrap(),
        ))
    }

    fn to_usize(self) -> usize {
        **self as usize
    }

    fn from_usize(id: usize) -> Self {
        Self(Height::new(id as u32))
    }
}
