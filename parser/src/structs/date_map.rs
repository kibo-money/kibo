use std::iter::Sum;

use crate::{Date, HeightMap};

use super::{AnyMap, DateMapChunkId, GenericMap, Height, MapValue, SerializedBTreeMap};

pub type DateMap<Value> = GenericMap<Date, Value, DateMapChunkId, SerializedBTreeMap<Date, Value>>;

impl<Value> DateMap<Value>
where
    Value: MapValue,
{
    pub fn multi_insert_last(
        &mut self,
        dates: &[Date],
        source: &mut HeightMap<Value>,
        last_height: &mut DateMap<Height>,
    ) {
        dates.iter().for_each(|date| {
            self.insert_computed(
                *date,
                source
                    .get_or_import(&last_height.get_or_import(date).unwrap())
                    .unwrap(),
            );
        });
    }

    pub fn multi_insert_sum_range(
        &mut self,
        dates: &[Date],
        height_map: &HeightMap<Value>,
        first_height: &mut DateMap<Height>,
        last_height: &mut DateMap<Height>,
    ) where
        Value: Sum,
    {
        dates.iter().for_each(|date| {
            let first_height = first_height.get_or_import(date).unwrap();
            let last_height = last_height.get_or_import(date).unwrap();
            let range = (*first_height)..=(*last_height);

            self.insert_computed(*date, height_map.sum_range(&range));
        })
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
