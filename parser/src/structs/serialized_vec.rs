use std::{cmp::Ordering, collections::BTreeMap, fmt::Debug};

use allocative::Allocative;
use bincode::{Decode, Encode};
use serde::{de::DeserializeOwned, Deserialize, Serialize};

use super::{MapChunkId, MapKey, MapSerialized, MapValue};

#[derive(Debug, Default, Serialize, Deserialize, Encode, Decode, Allocative)]
pub struct SerializedVec<Value> {
    version: u32,
    map: Vec<Value>,
}

impl<Key, Value, ChunkId> MapSerialized<Key, Value, ChunkId> for SerializedVec<Value>
where
    Self: Debug + Serialize + DeserializeOwned + Encode + Decode,
    ChunkId: MapChunkId,
    Key: MapKey<ChunkId>,
    Value: MapValue,
{
    fn new(version: u32) -> Self {
        Self {
            version,
            map: vec![],
        }
    }

    fn get_last_key(&self, chunk_id: &ChunkId) -> Option<Key> {
        Some(Key::from_usize(chunk_id.to_usize() + self.map.len()))
    }

    fn version(&self) -> u32 {
        self.version
    }

    fn get(&self, serialized_key: &Key) -> Option<&Value> {
        self.map.get(serialized_key.to_usize())
    }

    fn last(&self) -> Option<&Value> {
        self.map.last()
    }

    fn extend(&mut self, map: BTreeMap<Key, Value>) {
        map.into_iter().for_each(|(key, value)| {
            let key = key.to_serialized_key().to_usize();

            match self.map.len().cmp(&key) {
                Ordering::Greater => self.map[key] = value,
                Ordering::Equal => self.map.push(value),
                Ordering::Less => {
                    dbg!(&self.map, key, value);
                    panic!()
                }
            }
        });
    }
}
