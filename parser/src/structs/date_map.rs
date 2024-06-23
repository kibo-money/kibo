use std::{
    collections::{BTreeMap, VecDeque},
    fmt::Debug,
    fs,
    iter::Sum,
    mem,
    ops::{Add, Div, Mul, Sub},
    path::{Path, PathBuf},
};

use allocative::Allocative;
use bincode::{Decode, Encode};
use chrono::{Datelike, Days};
use itertools::Itertools;
use ordered_float::{FloatCore, OrderedFloat};
use serde::{Deserialize, Serialize};

use crate::{
    io::{format_path, Serialization},
    utils::{log, LossyFrom},
};

use super::{AnyMap, HeightMap, MapValue, WNaiveDate};

const NUMBER_OF_UNSAFE_DATES: usize = 2;
const MIN_YEAR: usize = 2009;

#[derive(Debug, Serialize, Deserialize, Encode, Decode, Allocative)]
pub struct SerializedDateMap<T> {
    version: u32,
    map: BTreeMap<WNaiveDate, T>,
}

#[derive(Default, Allocative)]
pub struct DateMap<T> {
    version: u32,

    path_all: String,
    path_last: Option<String>,

    chunks_in_memory: usize,

    serialization: Serialization,

    pub initial_last_date: Option<WNaiveDate>,
    pub initial_first_unsafe_date: Option<WNaiveDate>,

    imported: BTreeMap<usize, SerializedDateMap<T>>,
    to_insert: BTreeMap<usize, BTreeMap<WNaiveDate, T>>,
}

impl<T> DateMap<T>
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

        let path_all = format!("{path}/date");

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

            initial_last_date: None,
            initial_first_unsafe_date: None,

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

        s.initial_last_date = s
            .imported
            .values()
            .last()
            .and_then(|serialized| serialized.map.keys().copied().max());

        s.initial_first_unsafe_date = s.initial_last_date.and_then(|last_date| {
            let offset = NUMBER_OF_UNSAFE_DATES - 1;
            last_date
                .checked_sub_days(Days::new(offset as u64))
                .map(WNaiveDate::wrap)
        });

        if s.initial_first_unsafe_date.is_none() {
            log(&format!("New {path}"));
        }

        s
    }

    pub fn insert(&mut self, date: WNaiveDate, value: T) -> T {
        if !self.is_date_safe(date) {
            self.to_insert
                .entry(date.year() as usize)
                .or_default()
                .insert(date, value);
        }

        value
    }

    pub fn insert_default(&mut self, date: WNaiveDate) -> T {
        self.insert(date, T::default())
    }

    /// Same as get but with &WNaiveDate instead of NaiveDate
    pub fn get(&self, date: &WNaiveDate) -> Option<T> {
        let year = date.year() as usize;

        self.to_insert
            .get(&year)
            .and_then(|tree| tree.get(date).cloned())
            .or_else(|| {
                self.imported
                    .get(&year)
                    .and_then(|serialized| serialized.map.get(date))
                    .cloned()
            })
    }

    /// Same as get_or_import but with &WNaiveDate instead of NaiveDate
    pub fn get_or_import(&mut self, date: &WNaiveDate) -> Option<T> {
        let year = date.year() as usize;

        if year < MIN_YEAR {
            return None;
        }

        self.to_insert
            .get(&year)
            .and_then(|tree| tree.get(date).cloned())
            .or_else(|| {
                #[allow(clippy::map_entry)] // Can't be mut and then use read_dir()
                if !self.imported.contains_key(&year) {
                    let dir_content = self.read_dir();

                    if let Some(path) = dir_content.get(&year) {
                        let serialized = self.import(path).unwrap();
                        //     .unwrap_or(SerializedDateMap {
                        //     version: self.version,
                        //     map: BTreeMap::default(),
                        // });

                        self.imported.insert(year, serialized);
                    }
                }

                self.imported
                    .get(&year)
                    .and_then(|serialized| serialized.map.get(date))
                    .cloned()
            })
    }

    #[inline(always)]
    pub fn is_date_safe(&self, date: WNaiveDate) -> bool {
        self.initial_first_unsafe_date
            .map_or(false, |initial_first_unsafe_date| {
                initial_first_unsafe_date > date
            })
    }

    fn read_dir(&self) -> BTreeMap<usize, PathBuf> {
        Self::_read_dir(&self.path_all, &self.serialization)
    }

    pub fn _read_dir(path: &str, serialization: &Serialization) -> BTreeMap<usize, PathBuf> {
        fs::read_dir(path)
            .unwrap()
            .map(|entry| entry.unwrap().path())
            .filter(|path| {
                let file_stem = path.file_stem().unwrap().to_str().unwrap();
                let extension = path.extension().unwrap().to_str().unwrap();

                path.is_file()
                    && file_stem.len() == 4
                    && file_stem.starts_with("20")
                    && extension == serialization.to_extension()
            })
            .map(|path| {
                let year = path
                    .file_stem()
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .parse::<usize>()
                    .unwrap();

                (year, path)
            })
            .collect()
    }

    fn import(&self, path: &Path) -> color_eyre::Result<SerializedDateMap<T>> {
        self.serialization
            .import::<SerializedDateMap<T>>(path.to_str().unwrap())
    }
}

impl<T> AnyMap for DateMap<T>
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

    //     self.initial_last_date = None;
    //     self.initial_first_unsafe_date = None;

    //     self.imported.clear();
    //     self.to_insert.clear();

    //     Ok(())
    // }

    fn pre_export(&mut self) {
        self.to_insert.iter_mut().for_each(|(chunk_start, map)| {
            self.imported
                .entry(*chunk_start)
                .or_insert(SerializedDateMap {
                    version: self.version,
                    map: BTreeMap::default(),
                })
                .map
                .extend(mem::take(map));
        });
    }

    fn export(&self) -> color_eyre::Result<()> {
        let len = self.imported.len();

        self.to_insert.iter().enumerate().try_for_each(
            |(index, (year, map))| -> color_eyre::Result<()> {
                if !map.is_empty() {
                    unreachable!()
                }

                let path = self
                    .serialization
                    .append_extension(&format!("{}/{}", self.path_all, year));

                let serialized = self.imported.get(year).unwrap();

                self.serialization.export(&path, serialized)?;

                if index == len - 1 {
                    if let Some(path_last) = self.path_last.as_ref() {
                        self.serialization
                            .export(path_last, serialized.map.values().last().unwrap())?;
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

pub trait AnyDateMap: AnyMap {
    fn get_initial_first_unsafe_date(&self) -> Option<WNaiveDate>;

    fn get_initial_last_date(&self) -> Option<WNaiveDate>;

    fn as_any_map(&self) -> &(dyn AnyMap + Send + Sync);

    fn as_any_mut_map(&mut self) -> &mut dyn AnyMap;
}

impl<T> AnyDateMap for DateMap<T>
where
    T: MapValue,
{
    #[inline(always)]
    fn get_initial_first_unsafe_date(&self) -> Option<WNaiveDate> {
        self.initial_first_unsafe_date
    }

    #[inline(always)]
    fn get_initial_last_date(&self) -> Option<WNaiveDate> {
        self.initial_last_date
    }

    fn as_any_map(&self) -> &(dyn AnyMap + Send + Sync) {
        self
    }

    fn as_any_mut_map(&mut self) -> &mut dyn AnyMap {
        self
    }
}

impl<T> DateMap<T>
where
    T: MapValue,
{
    pub fn multi_insert<F>(&mut self, dates: &[WNaiveDate], mut callback: F)
    where
        F: FnMut(&WNaiveDate) -> T,
    {
        dates.iter().for_each(|date| {
            self.insert(*date, callback(date));
        });
    }

    pub fn multi_insert_last(
        &mut self,
        dates: &[WNaiveDate],
        source: &mut HeightMap<T>,
        last_height: &mut DateMap<usize>,
    ) {
        dates.iter().for_each(|date| {
            self.insert(
                *date,
                source.get_or_import(&last_height.get_or_import(date).unwrap()),
            );
        });
    }

    pub fn multi_insert_const(&mut self, dates: &[WNaiveDate], constant: T) {
        dates.iter().for_each(|date| {
            self.insert(*date, constant);
        });
    }

    pub fn multi_insert_simple_transform<K, F>(
        &mut self,
        dates: &[WNaiveDate],
        source: &mut DateMap<K>,
        transform: F,
    ) where
        F: Fn(K) -> T,
        K: MapValue,
    {
        dates.iter().for_each(|date| {
            self.insert(*date, transform(source.get_or_import(date).unwrap()));
        });
    }

    pub fn multi_insert_complex_transform<K, F>(
        &mut self,
        dates: &[WNaiveDate],
        source: &mut DateMap<K>,
        transform: F,
    ) where
        K: MapValue,
        F: Fn((K, &WNaiveDate, &mut DateMap<K>)) -> T,
    {
        dates.iter().for_each(|date| {
            self.insert(
                *date,
                transform((source.get_or_import(date).unwrap(), date, source)),
            );
        });
    }

    pub fn multi_insert_add<A, B>(
        &mut self,
        dates: &[WNaiveDate],
        added: &mut DateMap<A>,
        adder: &mut DateMap<B>,
    ) where
        A: MapValue,
        B: MapValue,
        T: LossyFrom<A> + LossyFrom<B>,
        T: Add<Output = T>,
    {
        dates.iter().for_each(|date| {
            self.insert(
                *date,
                T::lossy_from(added.get_or_import(date).unwrap())
                    + T::lossy_from(adder.get_or_import(date).unwrap()),
            );
        });
    }

    pub fn multi_insert_subtract<A, B>(
        &mut self,
        dates: &[WNaiveDate],
        subtracted: &mut DateMap<A>,
        subtracter: &mut DateMap<B>,
    ) where
        A: MapValue,
        B: MapValue,
        T: LossyFrom<A> + LossyFrom<B>,
        T: Sub<Output = T>,
    {
        dates.iter().for_each(|date| {
            self.insert(
                *date,
                T::lossy_from(subtracted.get_or_import(date).unwrap())
                    - T::lossy_from(subtracter.get_or_import(date).unwrap()),
            );
        });
    }

    pub fn multi_insert_multiply<A, B>(
        &mut self,
        dates: &[WNaiveDate],
        multiplied: &mut DateMap<A>,
        multiplier: &mut DateMap<B>,
    ) where
        A: MapValue,
        B: MapValue,
        T: LossyFrom<A> + LossyFrom<B>,
        T: Mul<Output = T>,
    {
        dates.iter().for_each(|date| {
            self.insert(
                *date,
                T::lossy_from(multiplied.get_or_import(date).unwrap())
                    * T::lossy_from(multiplier.get_or_import(date).unwrap()),
            );
        });
    }

    pub fn multi_insert_divide<A, B>(
        &mut self,
        dates: &[WNaiveDate],
        divided: &mut DateMap<A>,
        divider: &mut DateMap<B>,
    ) where
        A: MapValue,
        B: MapValue,
        T: LossyFrom<A> + LossyFrom<B>,
        T: Div<Output = T> + Mul<Output = T> + From<u8>,
    {
        self._multi_insert_divide(dates, divided, divider, false)
    }

    pub fn multi_insert_percentage<A, B>(
        &mut self,
        dates: &[WNaiveDate],
        divided: &mut DateMap<A>,
        divider: &mut DateMap<B>,
    ) where
        A: MapValue,
        B: MapValue,
        T: LossyFrom<A> + LossyFrom<B>,
        T: Div<Output = T> + Mul<Output = T> + From<u8>,
    {
        self._multi_insert_divide(dates, divided, divider, true)
    }

    pub fn _multi_insert_divide<A, B>(
        &mut self,
        dates: &[WNaiveDate],
        divided: &mut DateMap<A>,
        divider: &mut DateMap<B>,
        as_percentage: bool,
    ) where
        A: MapValue,
        B: MapValue,
        T: LossyFrom<A> + LossyFrom<B>,
        T: Div<Output = T> + Mul<Output = T> + From<u8>,
    {
        let multiplier = T::from(if as_percentage { 100 } else { 1 });

        dates.iter().for_each(|date| {
            self.insert(
                *date,
                T::lossy_from(divided.get_or_import(date).unwrap())
                    / T::lossy_from(divider.get_or_import(date).unwrap())
                    * multiplier,
            );
        });
    }

    pub fn multi_insert_cumulative<K>(&mut self, dates: &[WNaiveDate], source: &mut DateMap<K>)
    where
        K: MapValue,
        T: LossyFrom<K>,
        T: Add<Output = T> + Sub<Output = T>,
    {
        self._multi_insert_last_x_sum(dates, source, None)
    }

    pub fn multi_insert_last_x_sum<K>(
        &mut self,
        dates: &[WNaiveDate],
        source: &mut DateMap<K>,
        days: usize,
    ) where
        K: MapValue,
        T: LossyFrom<K>,
        T: Add<Output = T> + Sub<Output = T>,
    {
        self._multi_insert_last_x_sum(dates, source, Some(days))
    }

    fn _multi_insert_last_x_sum<K>(
        &mut self,
        dates: &[WNaiveDate],
        source: &mut DateMap<K>,
        days: Option<usize>,
    ) where
        K: MapValue,
        T: LossyFrom<K>,
        T: Add<Output = T> + Sub<Output = T>,
    {
        let mut sum = None;

        dates.iter().for_each(|date| {
            let to_subtract = days
                .and_then(|x| {
                    date.checked_sub_days(Days::new(x as u64))
                        .and_then(|previous_date| {
                            source.get_or_import(&WNaiveDate::wrap(previous_date))
                        })
                })
                .unwrap_or_default();

            let previous_sum = sum.unwrap_or_else(|| {
                date.checked_sub_days(Days::new(1))
                    .and_then(|previous_sum_date| {
                        self.get_or_import(&WNaiveDate::wrap(previous_sum_date))
                    })
                    .unwrap_or_default()
            });

            let last_value = source.get_or_import(date).unwrap_or_else(|| {
                dbg!(date);
                panic!();
            });

            sum.replace(previous_sum - T::lossy_from(to_subtract) + T::lossy_from(last_value));

            self.insert(*date, sum.unwrap());
        });
    }

    pub fn multi_insert_simple_average<K>(
        &mut self,
        dates: &[WNaiveDate],
        source: &mut DateMap<K>,
        days: usize,
    ) where
        T: Into<f32> + From<f32>,
        K: MapValue + Sum,
        f32: LossyFrom<K>,
    {
        if days <= 1 {
            panic!("Average of 1 or less is not useful");
        }

        let days = days as f32;

        let mut average = None;

        dates.iter().for_each(|date| {
            let previous_average: f32 = average
                .unwrap_or_else(|| {
                    date.checked_sub_days(Days::new(1))
                        .and_then(|previous_average_date| {
                            self.get(&WNaiveDate::wrap(previous_average_date))
                        })
                        .unwrap_or_default()
                })
                .into();

            let last_value = f32::lossy_from(source.get_or_import(date).unwrap_or_else(|| {
                dbg!(date);
                panic!()
            }));

            average.replace(((previous_average * (days - 1.0) + last_value) / days).into());

            self.insert(*date, average.unwrap());
        });
    }

    pub fn multi_insert_net_change(
        &mut self,
        dates: &[WNaiveDate],
        source: &mut DateMap<T>,
        days: usize,
    ) where
        T: Sub<Output = T>,
    {
        dates.iter().for_each(|date| {
            let previous_value = date
                .checked_sub_days(Days::new(days as u64))
                .and_then(|date| source.get_or_import(&WNaiveDate::wrap(date)))
                .unwrap_or_default();

            let last_value = source.get_or_import(date).unwrap();

            let net_change = last_value - previous_value;

            self.insert(*date, net_change);
        });
    }

    pub fn multi_insert_percentage_change(
        &mut self,
        dates: &[WNaiveDate],
        source: &mut DateMap<T>,
        days: usize,
    ) where
        T: Sub<Output = T> + FloatCore,
    {
        let one = T::from(1.0).unwrap();
        let hundred = T::from(100.0).unwrap();

        dates.iter().for_each(|date| {
            let previous_value = date
                .checked_sub_days(Days::new(days as u64))
                .and_then(|date| source.get_or_import(&WNaiveDate::wrap(date)))
                .unwrap_or_default();

            let last_value = source.get_or_import(date).unwrap();

            let percentage_change = ((last_value / previous_value) - one) * hundred;

            self.insert(*date, percentage_change);
        });
    }

    pub fn multi_insert_median(
        &mut self,
        dates: &[WNaiveDate],
        source: &mut DateMap<T>,
        days: Option<usize>,
    ) where
        T: FloatCore,
    {
        self.multi_insert_percentile(dates, source, 0.5, days);
    }

    pub fn multi_insert_percentile(
        &mut self,
        dates: &[WNaiveDate],
        source: &mut DateMap<T>,
        percentile: f32,
        days: Option<usize>,
    ) where
        T: FloatCore,
    {
        if !(0.0..=1.0).contains(&percentile) {
            panic!("The percentile should be between 0.0 and 1.0");
        }

        if days.map_or(false, |size| size < 3) {
            panic!("Computing a median for a size lower than 3 is useless");
        }

        let mut ordered_vec = None;
        let mut sorted_vec = None;

        dates.iter().for_each(|date| {
            let value = {
                if let Some(start) = days
                    .map_or(chrono::NaiveDate::from_ymd_opt(2009, 3, 1), |size| {
                        date.checked_sub_days(Days::new(size as u64))
                    })
                {
                    if ordered_vec.is_none() {
                        let mut vec = start
                            .iter_days()
                            .take_while(|d| *d != **date)
                            .flat_map(|date| source.get_or_import(&WNaiveDate::wrap(date)))
                            .map(|f| OrderedFloat(f))
                            .collect_vec();

                        if days.is_some() {
                            ordered_vec.replace(VecDeque::from(vec.clone()));
                        }

                        vec.sort_unstable();
                        sorted_vec.replace(vec);
                    } else {
                        let float_value = OrderedFloat(source.get_or_import(date).unwrap());

                        if let Some(days) = days {
                            if let Some(ordered_vec) = ordered_vec.as_mut() {
                                if ordered_vec.len() == days {
                                    let first = ordered_vec.pop_front().unwrap();

                                    let pos =
                                        sorted_vec.as_ref().unwrap().binary_search(&first).unwrap();

                                    sorted_vec.as_mut().unwrap().remove(pos);
                                }

                                ordered_vec.push_back(float_value);
                            }
                        }

                        let pos = sorted_vec
                            .as_ref()
                            .unwrap()
                            .binary_search(&float_value)
                            .unwrap_or_else(|pos| pos);
                        sorted_vec.as_mut().unwrap().insert(pos, float_value);
                    }

                    let vec = sorted_vec.as_ref().unwrap();

                    if vec.is_empty() {
                        T::default()
                    } else {
                        let index = vec.len() as f32 * percentile;

                        if index.fract() != 0.0 && vec.len() > 1 {
                            (vec.get(index.ceil() as usize)
                                .unwrap_or_else(|| {
                                    dbg!(vec, index, &self.path_all, &source.path_all, days);
                                    panic!()
                                })
                                .0
                                + vec
                                    .get(index.floor() as usize)
                                    .unwrap_or_else(|| {
                                        dbg!(vec, index, &self.path_all, &source.path_all, days);
                                        panic!()
                                    })
                                    .0)
                                / T::from(2.0).unwrap()
                        } else {
                            vec.get(index.floor() as usize)
                                .unwrap_or_else(|| {
                                    dbg!(vec, index);
                                    panic!();
                                })
                                .0
                        }
                    }
                } else {
                    T::default()
                }
            };

            self.insert(*date, value);
        });
    }

    //
    // pub fn transform<F>(&self, transform: F) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Copy + Default,
    //     F: Fn((&WNaiveDate, &T, &BTreeMap<WNaiveDate, T>, usize)) -> T,
    // {
    //     Self::_transform(self.imported.lock().as_ref().unwrap(), transform)
    // }

    // pub fn _transform<F>(map: &BTreeMap<WNaiveDate, T>, transform: F) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Copy + Default,
    //     F: Fn((&WNaiveDate, &T, &BTreeMap<WNaiveDate, T>, usize)) -> T,
    // {
    //     map.iter()
    //         .enumerate()
    //         .map(|(index, (date, value))| (date.to_owned(), transform((date, value, map, index))))
    //         .collect()
    // }

    //
    // pub fn add(&self, other: &Self) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Add<Output = T> + Copy + Default,
    // {
    //     Self::_add(
    //         self.imported.lock().as_ref().unwrap(),
    //         other.imported.lock().as_ref().unwrap(),
    //     )
    // }

    // pub fn _add(
    //     map1: &BTreeMap<WNaiveDate, T>,
    //     map2: &BTreeMap<WNaiveDate, T>,
    // ) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Add<Output = T> + Copy + Default,
    // {
    //     Self::_transform(map1, |(date, value, ..)| {
    //         map2.get(date)
    //             .map(|value2| *value + *value2)
    //             .unwrap_or_default()
    //     })
    // }

    //
    // pub fn subtract(&self, other: &Self) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Sub<Output = T> + Copy + Default,
    // {
    //     Self::_subtract(
    //         self.imported.lock().as_ref().unwrap(),
    //         other.imported.lock().as_ref().unwrap(),
    //     )
    // }

    // pub fn _subtract(
    //     map1: &BTreeMap<WNaiveDate, T>,
    //     map2: &BTreeMap<WNaiveDate, T>,
    // ) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Sub<Output = T> + Copy + Default,
    // {
    //     if map1.len() != map2.len() {
    //         panic!("Can't subtract two arrays with a different length");
    //     }

    //     Self::_transform(map1, |(date, value, ..)| {
    //         map2.get(date)
    //             .map(|value2| *value - *value2)
    //             .unwrap_or_default()
    //     })
    // }

    //
    // pub fn multiply(&self, other: &Self) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Mul<Output = T> + Copy + Default,
    // {
    //     Self::_multiply(
    //         self.imported.lock().as_ref().unwrap(),
    //         other.imported.lock().as_ref().unwrap(),
    //     )
    // }

    //
    // pub fn _multiply(
    //     map1: &BTreeMap<WNaiveDate, T>,
    //     map2: &BTreeMap<WNaiveDate, T>,
    // ) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Mul<Output = T> + Copy + Default,
    // {
    //     Self::_transform(map1, |(date, value, ..)| {
    //         map2.get(date)
    //             .map(|value2| *value * *value2)
    //             .unwrap_or_default()
    //     })
    // }

    //
    // pub fn divide(&self, other: &Self) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Div<Output = T> + Copy + Default,
    // {
    //     Self::_divide(
    //         self.imported.lock().as_ref().unwrap(),
    //         other.imported.lock().as_ref().unwrap(),
    //     )
    // }

    //
    // pub fn _divide(
    //     map1: &BTreeMap<WNaiveDate, T>,
    //     map2: &BTreeMap<WNaiveDate, T>,
    // ) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Div<Output = T> + Copy + Default,
    // {
    //     Self::_transform(map1, |(date, value, ..)| {
    //         map2.get(date)
    //             .map(|value2| *value / *value2)
    //             .unwrap_or_default()
    //     })
    // }

    //
    // pub fn cumulate(&self) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Sum + Copy + Default + AddAssign,
    // {
    //     Self::_cumulate(self.imported.lock().as_ref().unwrap())
    // }

    //
    // pub fn _cumulate(map: &BTreeMap<WNaiveDate, T>) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Sum + Copy + Default + AddAssign,
    // {
    //     let mut sum = T::default();

    //     map.iter()
    //         .map(|(date, value)| {
    //             sum += *value;
    //             (date.to_owned(), sum)
    //         })
    //         .collect()
    // }

    // pub fn insert_cumulative(&mut self, date: NaiveDate, source: &DateMap<T>) -> T
    // where
    //     T: Add<Output = T> + Sub<Output = T>,
    // {
    //     let previous_cum = date
    //         .checked_sub_days(Days::new(1))
    //         .map(|previous_date| {
    //             self.get(previous_date).unwrap_or_else(|| {
    //                 if previous_date.year() == 2009 && previous_date.month() == 1 {
    //                     let day = previous_date.day();

    //                     if day == 8 {
    //                         self.get(NaiveDate::from_str("2009-01-03").unwrap())
    //                             .unwrap()
    //                     } else if day == 2 {
    //                         T::default()
    //                     } else {
    //                         panic!()
    //                     }
    //                 } else {
    //                     dbg!(previous_date, &self.path_all);
    //                     panic!()
    //                 }
    //             })
    //         })
    //         .unwrap_or_default();

    //     let last_value = source.get(date).unwrap();

    //     let cum_value = previous_cum + last_value;

    //     self.insert(date, cum_value);

    //     cum_value
    // }

    //
    // pub fn insert_last_x_sum(&mut self, date: NaiveDate, source: &DateMap<T>, x: usize) -> T
    // where
    //     T: Add<Output = T> + Sub<Output = T>,
    // {
    //     let to_subtract = date
    //         .checked_sub_days(Days::new(x as u64 - 1))
    //         .and_then(|previous_date| source.get(previous_date))
    //         .unwrap_or_default();

    //     let previous_sum = date
    //         .checked_sub_days(Days::new(1))
    //         .and_then(|previous_sum_date| self.get(previous_sum_date))
    //         .unwrap_or_default();

    //     let last_value = source.get(date).unwrap();

    //     let sum = previous_sum - to_subtract + last_value;

    //     self.insert(date, sum);

    //     sum
    // }

    //
    // pub fn last_x_sum(&self, x: usize) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Sum + Copy + Default + AddAssign + SubAssign,
    // {
    //     Self::_last_x_sum(self.imported.lock().as_ref().unwrap(), x)
    // }

    // pub fn _last_x_sum(map: &BTreeMap<WNaiveDate, T>, days: usize) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Sum + Copy + Default + AddAssign + SubAssign,
    // {
    //     let mut sum = T::default();

    //     map.iter()
    //         .enumerate()
    //         .map(|(index, (date, value))| {
    //             sum += *value;

    //             if index >= days - 1 {
    //                 let previous_index = index + 1 - days;

    //                 sum -= *map.values().nth(previous_index).unwrap()
    //             }

    //             (date.to_owned(), sum)
    //         })
    //         .collect()
    // }

    //
    // pub fn simple_moving_average(&self, x: usize) -> BTreeMap<WNaiveDate, f32>
    // where
    //     T: Sum + Copy + Default + AddAssign + SubAssign + ToF32,
    // {
    //     Self::_simple_moving_average(self.imported.lock().as_ref().unwrap(), x)
    // }

    // pub fn insert_simple_average<K>(&mut self, date: NaiveDate, source: &DateMap<K>, x: usize)
    // where
    //     T: Into<f32> + From<f32>,
    //     K: Clone
    //         + Copy
    //         + Default
    //         + Debug
    //         + Serialize
    //         + DeserializeOwned
    //         + Sum
    //         + savefile::Serialize
    //         + savefile::Deserialize
    //         + savefile::ReprC
    //         + ToF32,
    // {
    //     let previous_average: f32 = date
    //         .checked_sub_days(Days::new(1))
    //         .and_then(|previous_average_date| self.get(previous_average_date))
    //         .unwrap_or_default()
    //         .into();

    //     let last_value: f32 = source.get(date).unwrap().to_f32();

    //     let sum = previous_average * x as f32 - 1.0 + last_value;

    //     let average: T = (sum / x as f32).into();

    //     self.insert(date, average);
    // }

    //
    // pub fn _simple_moving_average(
    //     map: &BTreeMap<WNaiveDate, T>,
    //     x: usize,
    // ) -> BTreeMap<WNaiveDate, f32>
    // where
    //     T: Sum + Copy + Default + AddAssign + SubAssign + Into<f32>,
    // {
    //     let mut sum = T::default();

    //     map.iter()
    //         .enumerate()
    //         .map(|(index, (date, value))| {
    //             sum += *value;

    //             if index >= x - 1 {
    //                 sum -= *map.values().nth(index + 1 - x).unwrap()
    //             }

    //             let float_sum: f32 = sum.into();

    //             (date.to_owned(), float_sum / x as f32)
    //         })
    //         .collect()
    // }

    //
    // pub fn net_change(&self, offset: usize) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Copy + Default + Sub<Output = T>,
    // {
    //     Self::_net_change(self.imported.lock().as_ref().unwrap(), offset)
    // }
    //
    //
    // pub fn insert_net_change(&mut self, date: NaiveDate, source: &DateMap<T>, offset: usize) -> T
    // where
    //     T: Sub<Output = T>,
    // {
    //     let previous_value = date
    //         .checked_sub_days(Days::new(offset as u64))
    //         .and_then(|date| source.get(date))
    //         .unwrap_or_default();

    //     let last_value = source.get(date).unwrap_or_else(|| {
    //         dbg!(date);
    //         panic!();
    //     });

    //     let net = last_value - previous_value;

    //     self.insert(date, net);

    //     net
    // }

    //
    // pub fn _net_change(map: &BTreeMap<WNaiveDate, T>, offset: usize) -> BTreeMap<WNaiveDate, T>
    // where
    //     T: Copy + Default + Sub<Output = T>,
    // {
    //     Self::_transform(map, |(_, value, map, index)| {
    //         let previous = {
    //             if let Some(previous_index) = index.checked_sub(offset) {
    //                 *map.values().nth(previous_index).unwrap()
    //             } else {
    //                 T::default()
    //             }
    //         };

    //         *value - previous
    //     })
    // }

    //
    // pub fn _median(map: &BTreeMap<WNaiveDate, T>, size: usize) -> BTreeMap<WNaiveDate, Option<T>>
    // where
    //     T: FloatCore,
    // {
    //     let even = size % 2 == 0;
    //     let median_index = size / 2;

    //     if size < 3 {
    //         panic!("Computing a median for a size lower than 3 is useless");
    //     }

    //     map.iter()
    //         .enumerate()
    //         .map(|(index, (date, _))| {
    //             let value = {
    //                 if index >= size - 1 {
    //                     let mut vec = map
    //                         .values()
    //                         .rev()
    //                         .take(size)
    //                         .map(|v| OrderedFloat(*v))
    //                         .collect_vec();

    //                     vec.sort_unstable();

    //                     if even {
    //                         Some(
    //                             (**vec.get(median_index).unwrap()
    //                                 + **vec.get(median_index - 1).unwrap())
    //                                 / T::from(2.0).unwrap(),
    //                         )
    //                     } else {
    //                         Some(**vec.get(median_index).unwrap())
    //                     }
    //                 } else {
    //                     None
    //                 }
    //             };

    //             (date.to_owned(), value)
    //         })
    //         .collect()
    // }
    //
    // pub fn insert_median(&mut self, date: NaiveDate, source: &DateMap<T>, size: usize) -> T
    // where
    //     T: FloatCore,
    // {
    //     if size < 3 {
    //         panic!("Computing a median for a size lower than 3 is useless");
    //     }

    //     let median = {
    //         if let Some(start) = date.checked_sub_days(Days::new(size as u64 - 1)) {
    //             let even = size % 2 == 0;
    //             let median_index = size / 2;

    //             let mut vec = start
    //                 .iter_days()
    //                 .take(size)
    //                 .flat_map(|date| source.get(date))
    //                 .map(|f| OrderedFloat(f))
    //                 .collect_vec();

    //             if vec.len() != size {
    //                 return T::default();
    //             }

    //             vec.sort_unstable();

    //             if even {
    //                 (vec.get(median_index).unwrap().0 + vec.get(median_index - 1).unwrap().0)
    //                     / T::from(2.0).unwrap()
    //             } else {
    //                 vec.get(median_index).unwrap().0
    //             }
    //         } else {
    //             T::default()
    //         }
    //     };

    //     self.insert(date, median);

    //     median
    // }
}
