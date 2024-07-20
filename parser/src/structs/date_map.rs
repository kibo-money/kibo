use crate::{Date, HeightMap};

use super::{AnyMap, DateMapChunkId, GenericMap, Height, MapValue, SerializedBTreeMap};

pub type DateMap<Value> = GenericMap<Date, Value, DateMapChunkId, SerializedBTreeMap<Date, Value>>;

impl<T> DateMap<T>
where
    T: MapValue,
{
    pub fn multi_insert_last(
        &mut self,
        dates: &[Date],
        source: &mut HeightMap<T>,
        last_height: &mut DateMap<Height>,
    ) {
        dates.iter().for_each(|date| {
            self.insert(
                *date,
                source
                    .get_or_import(&last_height.get_or_import(date).unwrap())
                    .unwrap(),
            );
        });
    }
}

pub trait AnyDateMap: AnyMap {
    fn get_initial_first_unsafe_date(&self) -> Option<Date>;

    fn get_initial_last_date(&self) -> Option<Date>;

    fn as_any_map(&self) -> &(dyn AnyMap + Send + Sync);

    fn as_any_mut_map(&mut self) -> &mut dyn AnyMap;
}

impl<T> AnyDateMap for DateMap<T>
where
    T: MapValue,
{
    #[inline(always)]
    fn get_initial_first_unsafe_date(&self) -> Option<Date> {
        self.initial_first_unsafe_key
    }

    #[inline(always)]
    fn get_initial_last_date(&self) -> Option<Date> {
        self.initial_last_key
    }

    fn as_any_map(&self) -> &(dyn AnyMap + Send + Sync) {
        self
    }

    fn as_any_mut_map(&mut self) -> &mut dyn AnyMap {
        self
    }
}
