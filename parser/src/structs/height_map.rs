use std::{
    cmp::Ordering,
    collections::{BTreeMap, VecDeque},
    fmt::Debug,
    fs,
    iter::Sum,
    mem,
    ops::{Add, Div, Mul, RangeInclusive, Sub},
    path::{Path, PathBuf},
};

use allocative::Allocative;
use bincode::{Decode, Encode};
use itertools::Itertools;
use ordered_float::{FloatCore, OrderedFloat};
use serde::{Deserialize, Serialize};

use crate::{
    bitcoin::NUMBER_OF_UNSAFE_BLOCKS,
    io::{format_path, Serialization},
    utils::{log, LossyFrom},
};

use super::{AnyMap, MapValue};

pub const HEIGHT_MAP_CHUNK_SIZE: usize = 10_000;

#[derive(Debug, Serialize, Deserialize, Encode, Decode, Allocative)]
pub struct SerializedHeightMap<T> {
    version: u32,
    map: Vec<T>,
}

#[derive(Default, Allocative)]
pub struct HeightMap<T>
where
    T: MapValue,
{
    version: u32,

    path_all: String,
    path_last: Option<String>,

    chunks_in_memory: usize,

    serialization: Serialization,

    initial_last_height: Option<usize>,
    initial_first_unsafe_height: Option<usize>,

    imported: BTreeMap<usize, SerializedHeightMap<T>>,
    to_insert: BTreeMap<usize, BTreeMap<usize, T>>,
}

impl<T> HeightMap<T>
where
    T: MapValue,
{
    pub fn new_bin(version: u32, path: &str) -> Self {
        Self::new(version, path, Serialization::Binary, 1, true)
    }

    pub fn _new_bin(version: u32, path: &str, export_last: bool) -> Self {
        Self::new(version, path, Serialization::Binary, 1, export_last)
    }

    pub fn new_json(version: u32, path: &str, export_last: bool) -> Self {
        Self::new(version, path, Serialization::Json, usize::MAX, export_last)
    }

    fn new(
        version: u32,
        path: &str,
        serialization: Serialization,
        chunks_in_memory: usize,
        export_last: bool,
    ) -> Self {
        if chunks_in_memory < 1 {
            panic!("Should always have at least the latest chunk in memory");
        }

        let path = format_path(path);

        let path_all = format!("{path}/height");

        fs::create_dir_all(&path_all).unwrap();

        let path_last = {
            if export_last {
                Some(serialization.append_extension(&format!("{path}/last")))
            } else {
                None
            }
        };

        let mut s = Self {
            version,

            path_all,
            path_last,

            chunks_in_memory,

            serialization,

            initial_first_unsafe_height: None,
            initial_last_height: None,

            to_insert: BTreeMap::default(),
            imported: BTreeMap::default(),
        };

        s.read_dir()
            .into_iter()
            .rev()
            .take(chunks_in_memory)
            .for_each(|(chunk_start, path)| {
                if let Ok(serialized) = s.import(&path) {
                    if serialized.version == s.version {
                        s.imported.insert(chunk_start, serialized);
                    } else {
                        s.read_dir()
                            .iter()
                            .for_each(|(_, path)| fs::remove_file(path).unwrap())
                    }
                }
            });

        s.initial_last_height = s
            .imported
            .iter()
            .last()
            .map(|(chunk_start, serialized)| chunk_start + serialized.map.len());

        s.initial_first_unsafe_height = s.initial_last_height.and_then(|last_height| {
            let offset = NUMBER_OF_UNSAFE_BLOCKS - 1;
            last_height.checked_sub(offset)
        });

        if s.initial_first_unsafe_height.is_none() {
            log(&format!("New {path}"));
        }

        s
    }

    fn height_to_chunk_name(height: usize) -> String {
        let start = Self::height_to_chunk_start(height);
        let end = start + HEIGHT_MAP_CHUNK_SIZE;

        format!("{start}..{end}")
    }

    fn height_to_chunk_start(height: usize) -> usize {
        height / HEIGHT_MAP_CHUNK_SIZE * HEIGHT_MAP_CHUNK_SIZE
    }

    pub fn insert(&mut self, height: usize, value: T) -> T {
        if !self.is_height_safe(height) {
            self.to_insert
                .entry(Self::height_to_chunk_start(height))
                .or_default()
                .insert(height % HEIGHT_MAP_CHUNK_SIZE, value);
        }

        value
    }

    pub fn insert_default(&mut self, height: usize) -> T {
        self.insert(height, T::default())
    }

    pub fn get(&self, height: &usize) -> Option<T> {
        let chunk_start = Self::height_to_chunk_start(*height);

        self.to_insert
            .get(&chunk_start)
            .and_then(|map| map.get(&(height - chunk_start)).cloned())
            .or_else(|| {
                self.imported
                    .get(&chunk_start)
                    .and_then(|serialized| serialized.map.get(height - chunk_start))
                    .cloned()
            })
    }

    pub fn get_or_import(&mut self, height: &usize) -> T {
        let chunk_start = Self::height_to_chunk_start(*height);

        self.to_insert
            .get(&chunk_start)
            .and_then(|map| map.get(&(height - chunk_start)).cloned())
            .or_else(|| {
                #[allow(clippy::map_entry)] // Can't be mut and then use read_dir()
                if !self.imported.contains_key(&chunk_start) {
                    let dir_content = self.read_dir();

                    let path = dir_content.get(&chunk_start).unwrap_or_else(|| {
                        dbg!(self.path(), chunk_start, &dir_content);
                        panic!();
                    });

                    let serialized = self.import(path).unwrap();

                    self.imported.insert(chunk_start, serialized);
                }

                self.imported
                    .get(&chunk_start)
                    .and_then(|serialized| serialized.map.get(height - chunk_start))
                    .cloned()
            })
            .unwrap_or_else(|| {
                dbg!(height, self.path());
                panic!();
            })
    }

    #[inline(always)]
    pub fn is_height_safe(&self, height: usize) -> bool {
        self.initial_first_unsafe_height.unwrap_or(0) > height
    }

    fn read_dir(&self) -> BTreeMap<usize, PathBuf> {
        Self::_read_dir(&self.path_all, &self.serialization)
    }

    pub fn _read_dir(path: &str, serialization: &Serialization) -> BTreeMap<usize, PathBuf> {
        fs::read_dir(path)
            .unwrap()
            .map(|entry| entry.unwrap().path())
            .filter(|path| {
                let extension = path.extension().unwrap().to_str().unwrap();

                path.is_file() && extension == serialization.to_extension()
            })
            .map(|path| {
                (
                    path.file_stem()
                        .unwrap()
                        .to_str()
                        .unwrap()
                        .split("..")
                        .next()
                        .unwrap()
                        .parse::<usize>()
                        .unwrap(),
                    path,
                )
            })
            .collect()
    }

    fn import(&self, path: &Path) -> color_eyre::Result<SerializedHeightMap<T>> {
        self.serialization
            .import::<SerializedHeightMap<T>>(path.to_str().unwrap())
    }
}

impl<T> AnyMap for HeightMap<T>
where
    T: MapValue,
{
    fn path(&self) -> &str {
        &self.path_all
    }

    fn path_last(&self) -> &Option<String> {
        &self.path_last
    }

    fn t_name(&self) -> &str {
        std::any::type_name::<T>()
    }

    // fn reset(&mut self) -> color_eyre::Result<()> {
    //     fs::remove_dir(&self.path_all)?;

    //     self.initial_last_height = None;
    //     self.initial_first_unsafe_height = None;

    //     self.imported.clear();
    //     self.to_insert.clear();

    //     Ok(())
    // }

    fn pre_export(&mut self) {
        self.to_insert.iter_mut().for_each(|(chunk_start, map)| {
            let serialized = self
                .imported
                .entry(*chunk_start)
                .or_insert(SerializedHeightMap {
                    version: self.version,
                    map: vec![],
                });

            mem::take(map)
                .into_iter()
                .for_each(
                    |(chunk_height, value)| match serialized.map.len().cmp(&chunk_height) {
                        Ordering::Greater => serialized.map[chunk_height] = value,
                        Ordering::Equal => serialized.map.push(value),
                        Ordering::Less => panic!(),
                    },
                );
        });
    }

    fn export(&self) -> color_eyre::Result<()> {
        let len = self.imported.len();

        self.to_insert.iter().enumerate().try_for_each(
            |(index, (chunk_start, map))| -> color_eyre::Result<()> {
                if !map.is_empty() {
                    unreachable!()
                }

                let chunk_name = Self::height_to_chunk_name(*chunk_start);

                let path = self
                    .serialization
                    .append_extension(&format!("{}/{}", self.path_all, chunk_name));

                let serialized = self.imported.get(chunk_start).unwrap_or_else(|| {
                    dbg!(&self.path_all, chunk_start, &self.imported);
                    panic!();
                });

                self.serialization.export(&path, serialized)?;

                if index == len - 1 {
                    if let Some(path_last) = self.path_last.as_ref() {
                        self.serialization
                            .export(path_last, serialized.map.last().unwrap())?;
                    }
                }

                Ok(())
            },
        )
    }

    fn post_export(&mut self) {
        self.imported
            .keys()
            .rev()
            .enumerate()
            .filter(|(index, _)| *index + 1 > self.chunks_in_memory)
            .map(|(_, key)| *key)
            .collect_vec()
            .iter()
            .for_each(|key| {
                self.imported.remove(key);
            });

        self.to_insert.clear();
    }
}

pub trait AnyHeightMap: AnyMap {
    fn get_initial_first_unsafe_height(&self) -> Option<usize>;

    fn get_initial_last_height(&self) -> Option<usize>;

    fn as_any_map(&self) -> &(dyn AnyMap + Send + Sync);

    fn as_any_mut_map(&mut self) -> &mut dyn AnyMap;
}

impl<T> AnyHeightMap for HeightMap<T>
where
    T: MapValue,
{
    #[inline(always)]
    fn get_initial_first_unsafe_height(&self) -> Option<usize> {
        self.initial_first_unsafe_height
    }

    #[inline(always)]
    fn get_initial_last_height(&self) -> Option<usize> {
        self.initial_last_height
    }

    fn as_any_map(&self) -> &(dyn AnyMap + Send + Sync) {
        self
    }

    fn as_any_mut_map(&mut self) -> &mut dyn AnyMap {
        self
    }
}

impl<T> HeightMap<T>
where
    T: MapValue,
{
    pub fn sum_range(&self, range: &RangeInclusive<usize>) -> T
    where
        T: Sum,
    {
        range
            .to_owned()
            .flat_map(|height| self.get(&height))
            .sum::<T>()
    }

    pub fn multi_insert_const(&mut self, heights: &[usize], constant: T) {
        heights.iter().for_each(|height| {
            let height = *height;

            self.insert(height, constant);
        });
    }

    pub fn multi_insert_simple_transform<K, F>(
        &mut self,
        heights: &[usize],
        source: &mut HeightMap<K>,
        transform: F,
    ) where
        K: MapValue,
        F: Fn(K) -> T,
    {
        heights.iter().for_each(|height| {
            self.insert(*height, transform(source.get_or_import(height)));
        });
    }

    pub fn multi_insert_complex_transform<K, F>(
        &mut self,
        heights: &[usize],
        source: &mut HeightMap<K>,
        transform: F,
    ) where
        K: MapValue,
        F: Fn((K, &usize)) -> T,
    {
        heights.iter().for_each(|height| {
            self.insert(*height, transform((source.get_or_import(height), height)));
        });
    }

    pub fn multi_insert_add<A, B>(
        &mut self,
        heights: &[usize],
        added: &mut HeightMap<A>,
        adder: &mut HeightMap<B>,
    ) where
        A: MapValue,
        B: MapValue,
        T: LossyFrom<A> + LossyFrom<B>,
        T: Add<Output = T>,
    {
        heights.iter().for_each(|height| {
            self.insert(
                *height,
                T::lossy_from(added.get_or_import(height))
                    + T::lossy_from(adder.get_or_import(height)),
            );
        });
    }

    pub fn multi_insert_subtract<A, B>(
        &mut self,
        heights: &[usize],
        subtracted: &mut HeightMap<A>,
        subtracter: &mut HeightMap<B>,
    ) where
        A: MapValue,
        B: MapValue,
        T: LossyFrom<A> + LossyFrom<B>,
        T: Sub<Output = T>,
    {
        heights.iter().for_each(|height| {
            self.insert(
                *height,
                T::lossy_from(subtracted.get_or_import(height))
                    - T::lossy_from(subtracter.get_or_import(height)),
            );
        });
    }

    pub fn multi_insert_multiply<A, B>(
        &mut self,
        heights: &[usize],
        multiplied: &mut HeightMap<A>,
        multiplier: &mut HeightMap<B>,
    ) where
        A: MapValue,
        B: MapValue,
        T: LossyFrom<A> + LossyFrom<B>,
        T: Mul<Output = T>,
    {
        heights.iter().for_each(|height| {
            self.insert(
                *height,
                T::lossy_from(multiplied.get_or_import(height))
                    * T::lossy_from(multiplier.get_or_import(height)),
            );
        });
    }

    pub fn multi_insert_divide<A, B>(
        &mut self,
        heights: &[usize],
        divided: &mut HeightMap<A>,
        divider: &mut HeightMap<B>,
    ) where
        A: MapValue,
        B: MapValue,
        T: LossyFrom<A> + LossyFrom<B>,
        T: Div<Output = T> + Mul<Output = T> + From<u8>,
    {
        self._multi_insert_divide(heights, divided, divider, false)
    }

    pub fn multi_insert_percentage<A, B>(
        &mut self,
        heights: &[usize],
        divided: &mut HeightMap<A>,
        divider: &mut HeightMap<B>,
    ) where
        A: MapValue,
        B: MapValue,
        T: LossyFrom<A> + LossyFrom<B>,
        T: Div<Output = T> + Mul<Output = T> + From<u8>,
    {
        self._multi_insert_divide(heights, divided, divider, true)
    }

    pub fn _multi_insert_divide<A, B>(
        &mut self,
        heights: &[usize],
        divided: &mut HeightMap<A>,
        divider: &mut HeightMap<B>,
        as_percentage: bool,
    ) where
        A: MapValue,
        B: MapValue,
        T: LossyFrom<A> + LossyFrom<B>,
        T: Div<Output = T> + Mul<Output = T> + From<u8>,
    {
        let multiplier = T::from(if as_percentage { 100 } else { 1 });

        heights.iter().for_each(|height| {
            self.insert(
                *height,
                T::lossy_from(divided.get_or_import(height))
                    / T::lossy_from(divider.get_or_import(height))
                    * multiplier,
            );
        });
    }

    pub fn multi_insert_cumulative<K>(&mut self, heights: &[usize], source: &mut HeightMap<K>)
    where
        K: MapValue,
        T: LossyFrom<K>,
        T: Add<Output = T> + Sub<Output = T>,
    {
        self._multi_insert_last_x_sum(heights, source, None)
    }

    pub fn multi_insert_last_x_sum<K>(
        &mut self,
        heights: &[usize],
        source: &mut HeightMap<K>,
        block_time: usize,
    ) where
        K: MapValue,
        T: LossyFrom<K>,
        T: Add<Output = T> + Sub<Output = T>,
    {
        self._multi_insert_last_x_sum(heights, source, Some(block_time))
    }

    fn _multi_insert_last_x_sum<K>(
        &mut self,
        heights: &[usize],
        source: &mut HeightMap<K>,
        block_time: Option<usize>,
    ) where
        K: MapValue,
        T: LossyFrom<K>,
        T: Add<Output = T> + Sub<Output = T>,
    {
        let mut sum = None;

        heights.iter().for_each(|height| {
            let to_subtract = block_time
                .and_then(|x| {
                    (height + 1)
                        .checked_sub(x)
                        .map(|previous_height| source.get_or_import(&previous_height))
                })
                .unwrap_or_default();

            let previous_sum = sum.unwrap_or_else(|| {
                height
                    .checked_sub(1)
                    .map(|previous_sum_height| self.get_or_import(&previous_sum_height))
                    .unwrap_or_default()
            });

            let last_value = source.get_or_import(height);

            sum.replace(previous_sum + T::lossy_from(last_value) - T::lossy_from(to_subtract));

            self.insert(*height, sum.unwrap());
        });
    }

    pub fn multi_insert_simple_average<K>(
        &mut self,
        heights: &[usize],
        source: &mut HeightMap<K>,
        block_time: usize,
    ) where
        T: Into<f32> + From<f32>,
        K: MapValue + Sum,
        f32: LossyFrom<K>,
    {
        if block_time <= 1 {
            panic!("Average of 1 or less is not useful");
        }

        let mut average = None;

        heights.iter().for_each(|height| {
            let height = *height;

            let previous_average: f32 = average
                .unwrap_or_else(|| {
                    height
                        .checked_sub(block_time)
                        .and_then(|previous_average_height| self.get(&previous_average_height))
                        .unwrap_or_default()
                })
                .into();

            let last_value = f32::lossy_from(source.get_or_import(&height));

            average.replace(
                ((previous_average * (block_time as f32 - 1.0) + last_value) / block_time as f32)
                    .into(),
            );

            self.insert(height, average.unwrap());
        });
    }

    pub fn multi_insert_net_change(
        &mut self,
        heights: &[usize],
        source: &mut HeightMap<T>,
        block_time: usize,
    ) where
        T: Sub<Output = T>,
    {
        heights.iter().for_each(|height| {
            let height = *height;

            let previous_value = height
                .checked_sub(block_time)
                .map(|height| source.get_or_import(&height))
                .unwrap_or_default();

            let last_value = source.get_or_import(&height);

            let net = last_value - previous_value;

            self.insert(height, net);
        });
    }

    pub fn multi_insert_median(
        &mut self,
        heights: &[usize],
        source: &mut HeightMap<T>,
        block_time: Option<usize>,
    ) where
        T: FloatCore,
    {
        self.multi_insert_percentile(heights, source, 0.5, block_time);
    }

    pub fn multi_insert_percentile(
        &mut self,
        heights: &[usize],
        source: &mut HeightMap<T>,
        percentile: f32,
        block_time: Option<usize>,
    ) where
        T: FloatCore,
    {
        if !(0.0..=1.0).contains(&percentile) {
            panic!("The percentile should be between 0.0 and 1.0");
        }

        if block_time.map_or(false, |size| size < 3) {
            panic!("Computing a median for a size lower than 3 is useless");
        }

        let mut ordered_vec = None;
        let mut sorted_vec = None;

        heights.iter().for_each(|height| {
            let height = *height;

            let value = {
                if let Some(start) = block_time.map_or(Some(0), |size| height.checked_sub(size)) {
                    if ordered_vec.is_none() {
                        let mut vec = (start..=height)
                            .map(|height| OrderedFloat(source.get_or_import(&height)))
                            .collect_vec();

                        if block_time.is_some() {
                            ordered_vec.replace(VecDeque::from(vec.clone()));
                        }

                        vec.sort_unstable();
                        sorted_vec.replace(vec);
                    } else {
                        let float_value = OrderedFloat(source.get_or_import(&height));

                        if block_time.is_some() {
                            let first = ordered_vec.as_mut().unwrap().pop_front().unwrap();
                            let pos = sorted_vec.as_ref().unwrap().binary_search(&first).unwrap();
                            sorted_vec.as_mut().unwrap().remove(pos);

                            ordered_vec.as_mut().unwrap().push_back(float_value);
                        }

                        let pos = sorted_vec
                            .as_ref()
                            .unwrap()
                            .binary_search(&float_value)
                            .unwrap_or_else(|pos| pos);
                        sorted_vec.as_mut().unwrap().insert(pos, float_value);
                    }

                    let vec = sorted_vec.as_ref().unwrap();

                    let index = vec.len() as f32 * percentile;

                    if index.fract() != 0.0 {
                        (vec.get(index.ceil() as usize)
                            .unwrap_or_else(|| {
                                dbg!(index, &self.path_all, &source.path_all, block_time);
                                panic!()
                            })
                            .0
                            + vec
                                .get(index.floor() as usize)
                                .unwrap_or_else(|| {
                                    dbg!(index, &self.path_all, &source.path_all, block_time);
                                    panic!()
                                })
                                .0)
                            / T::from(2.0).unwrap()
                    } else {
                        vec.get(index as usize).unwrap().0
                    }
                } else {
                    T::default()
                }
            };

            self.insert(height, value);
        });
    }

    // pub fn insert_cumulative(&mut self, height: usize, source: &HeightMap<T>) -> T
    // where
    //     T: Add<Output = T> + Sub<Output = T>,
    // {
    //     let previous_cum = height
    //         .checked_sub(1)
    //         .map(|previous_sum_height| {
    //             self.get(&previous_sum_height).unwrap_or_else(|| {
    //                 dbg!(previous_sum_height);
    //                 panic!()
    //             })
    //         })
    //         .unwrap_or_default();

    //     let last_value = source.get(&height).unwrap();

    //     let cum_value = previous_cum + last_value;

    //     self.insert(height, cum_value);

    //     cum_value
    // }

    // pub fn insert_last_x_sum(&mut self, height: usize, source: &HeightMap<T>, x: usize) -> T
    // where
    //     T: Add<Output = T> + Sub<Output = T>,
    // {
    //     let to_subtract = (height + 1)
    //         .checked_sub(x)
    //         .map(|previous_height| {
    //             source.get(&previous_height).unwrap_or_else(|| {
    //                 dbg!(&self.path_all, &source.path_all, previous_height);
    //                 panic!()
    //             })
    //         })
    //         .unwrap_or_default();

    //     let previous_sum = height
    //         .checked_sub(1)
    //         .map(|previous_sum_height| self.get(&previous_sum_height).unwrap())
    //         .unwrap_or_default();

    //     let last_value = source.get(&height).unwrap();

    //     let sum = previous_sum + last_value - to_subtract;

    //     self.insert(height, sum);

    //     sum
    // }

    // pub fn insert_simple_average(&mut self, height: usize, source: &HeightMap<T>, block_time: usize)
    // where
    //     T: Into<f32> + From<f32>,
    // {
    //     let to_subtract: f32 = (height + 1)
    //         .checked_sub(block_time)
    //         .map(|previous_height| source.get(&previous_height).unwrap())
    //         .unwrap_or_default()
    //         .into();

    //     let previous_average: f32 = height
    //         .checked_sub(1)
    //         .map(|previous_average_height| self.get(&previous_average_height).unwrap())
    //         .unwrap_or_default()
    //         .into();

    //     let last_value: f32 = source.get(&height).unwrap().into();

    //     let sum = previous_average * block_time as f32 - to_subtract + last_value;

    //     let average: T = (sum / block_time as f32).into();

    //     self.insert(height, average);
    // }

    // pub fn insert_net_change(&mut self, height: usize, source: &HeightMap<T>, offset: usize) -> T
    // where
    //     T: Sub<Output = T>,
    // {
    //     let previous_value = height
    //         .checked_sub(offset)
    //         .map(|height| {
    //             source.get(&height).unwrap_or_else(|| {
    //                 dbg!(&self.path_all, &source.path_all, offset);
    //                 panic!();
    //             })
    //         })
    //         .unwrap_or_default();

    //     let last_value = source.get(&height).unwrap();

    //     let net = last_value - previous_value;

    //     self.insert(height, net);

    //     net
    // }

    // pub fn insert_median(&mut self, height: usize, source: &HeightMap<T>, size: usize) -> T
    // where
    //     T: FloatCore,
    // {
    //     if size < 3 {
    //         panic!("Computing a median for a size lower than 3 is useless");
    //     }

    //     let median = {
    //         if let Some(start) = height.checked_sub(size - 1) {
    //             let even = size % 2 == 0;
    //             let median_index = size / 2;

    //             let mut vec = (start..=height)
    //                 .map(|height| {
    //                     OrderedFloat(source.get(&height).unwrap_or_else(|| {
    //                         dbg!(height, &source.path_all, size);
    //                         panic!()
    //                     }))
    //                 })
    //                 .collect_vec();

    //             vec.sort_unstable();

    //             if even {
    //                 (vec.get(median_index)
    //                     .unwrap_or_else(|| {
    //                         dbg!(median_index, &self.path_all, &source.path_all, size);
    //                         panic!()
    //                     })
    //                     .0
    //                     + vec.get(median_index - 1).unwrap().0)
    //                     / T::from(2.0).unwrap()
    //             } else {
    //                 vec.get(median_index).unwrap().0
    //             }
    //         } else {
    //             T::default()
    //         }
    //     };

    //     self.insert(height, median);

    //     median
    // }
}
