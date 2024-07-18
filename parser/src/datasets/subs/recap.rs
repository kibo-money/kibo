use allocative::Allocative;

use crate::{
    datasets::{AnyDataset, ComputeData, MinInitialStates},
    structs::{AnyDateMap, MapValue},
    DateMap, HeightMap,
};

#[derive(Default, Allocative)]
pub struct RecapDataset<T> {
    min_initial_states: MinInitialStates,

    // Computed
    min: Option<DateMap<T>>,
    max: Option<DateMap<T>>,
    median: Option<DateMap<T>>,
    average: Option<DateMap<T>>,
    sum: Option<DateMap<T>>,
    _90p: Option<DateMap<T>>,
    _75p: Option<DateMap<T>>,
    _25p: Option<DateMap<T>>,
    _10p: Option<DateMap<T>>,
}

#[derive(Default)]
struct RecapOptions {
    min: bool,
    max: bool,
    median: bool,
    average: bool,
    sum: bool,
    _90p: bool,
    _75p: bool,
    _25p: bool,
    _10p: bool,
}

impl RecapOptions {
    pub fn add_min(&mut self) {
        self.min = true;
    }

    pub fn add_max(&mut self) {
        self.max = true;
    }

    pub fn add_median(&mut self) {
        self.median = true;
    }

    pub fn add_average(&mut self) {
        self.average = true;
    }

    pub fn add_sum(&mut self) {
        self.sum = true;
    }

    pub fn add_90p(&mut self) {
        self._90p = true;
    }

    pub fn add_75p(&mut self) {
        self._75p = true;
    }

    pub fn add_25p(&mut self) {
        self._25p = true;
    }

    pub fn add_10p(&mut self) {
        self._10p = true;
    }
}

impl<T> RecapDataset<T>
where
    T: MapValue,
{
    pub fn import(parent_path: &str, options: RecapOptions) -> color_eyre::Result<Self> {
        let f = |s: &str| format!("{parent_path}/{s}");

        let mut s = Self {
            min_initial_states: MinInitialStates::default(),

            min: options.min.then(|| DateMap::new_bin(1, &f("min"))),
            max: options.max.then(|| DateMap::new_bin(1, &f("max"))),
            median: options.median.then(|| DateMap::new_bin(1, &f("median"))),
            average: options.average.then(|| DateMap::new_bin(1, &f("average"))),
            sum: options.sum.then(|| DateMap::new_bin(1, &f("sum"))),
            _90p: options._90p.then(|| DateMap::new_bin(1, &f("90p"))),
            _75p: options._75p.then(|| DateMap::new_bin(1, &f("75p"))),
            _25p: options._25p.then(|| DateMap::new_bin(1, &f("25p"))),
            _10p: options._10p.then(|| DateMap::new_bin(1, &f("10p"))),
        };

        s.min_initial_states
            .consume(MinInitialStates::compute_from_dataset(&s));

        Ok(s)
    }

    pub fn compute(
        &mut self,
        &ComputeData { heights, dates }: &ComputeData,
        source: &mut HeightMap<f32>,
    ) {
        if let Some(min) = self.min.as_ref() {
            // v.push(min);
        }

        if let Some(max) = self.max.as_ref() {
            // v.push(max);
        }

        if let Some(median) = self.median.as_ref() {
            // v.push(median);
        }

        if let Some(average) = self.average.as_ref() {
            // v.push(average);
        }

        if let Some(sum) = self.sum.as_ref() {
            // v.push(sum);
        }

        if let Some(_90p) = self._90p.as_ref() {
            // v.push(_90p);
        }

        if let Some(_75p) = self._75p.as_ref() {
            // v.push(_75p);
        }

        if let Some(_25p) = self._25p.as_ref() {
            // v.push(_25p);
        }

        if let Some(_10p) = self._10p.as_ref() {
            // v.push(_10p);
        }
    }
}

impl<T> AnyDataset for RecapDataset<T>
where
    T: MapValue,
{
    fn get_min_initial_states(&self) -> &MinInitialStates {
        &self.min_initial_states
    }

    fn to_computed_date_map_vec(&self) -> Vec<&(dyn AnyDateMap + Send + Sync)> {
        let mut v: Vec<&(dyn AnyDateMap + Send + Sync)> = vec![];

        if let Some(min) = self.min.as_ref() {
            v.push(min);
        }

        if let Some(max) = self.max.as_ref() {
            v.push(max);
        }

        if let Some(median) = self.median.as_ref() {
            v.push(median);
        }

        if let Some(average) = self.average.as_ref() {
            v.push(average);
        }

        if let Some(sum) = self.sum.as_ref() {
            v.push(sum);
        }

        if let Some(_90p) = self._90p.as_ref() {
            v.push(_90p);
        }

        if let Some(_75p) = self._75p.as_ref() {
            v.push(_75p);
        }

        if let Some(_25p) = self._25p.as_ref() {
            v.push(_25p);
        }

        if let Some(_10p) = self._10p.as_ref() {
            v.push(_10p);
        }

        v
    }

    fn to_computed_mut_date_map_vec(&mut self) -> Vec<&mut dyn AnyDateMap> {
        let mut v: Vec<&mut dyn AnyDateMap> = vec![];

        if let Some(min) = self.min.as_mut() {
            v.push(min);
        }

        if let Some(max) = self.max.as_mut() {
            v.push(max);
        }

        if let Some(median) = self.median.as_mut() {
            v.push(median);
        }

        if let Some(average) = self.average.as_mut() {
            v.push(average);
        }

        if let Some(sum) = self.sum.as_mut() {
            v.push(sum);
        }

        if let Some(_90p) = self._90p.as_mut() {
            v.push(_90p);
        }

        if let Some(_75p) = self._75p.as_mut() {
            v.push(_75p);
        }

        if let Some(_25p) = self._25p.as_mut() {
            v.push(_25p);
        }

        if let Some(_10p) = self._10p.as_mut() {
            v.push(_10p);
        }

        v
    }
}
