mod ohlc;

use std::collections::BTreeMap;

use allocative::Allocative;
use chrono::{Days, NaiveDateTime, NaiveTime, TimeZone, Timelike, Utc};
use color_eyre::eyre::Error;

pub use ohlc::*;

use crate::{
    price::{Binance, Kraken},
    structs::{AnyBiMap, AnyDateMap, BiMap, DateMap, WNaiveDate},
    utils::{ONE_MONTH_IN_DAYS, ONE_WEEK_IN_DAYS, ONE_YEAR_IN_DAYS},
};

use super::{AnyDataset, ComputeData, MinInitialStates};

#[derive(Allocative)]
pub struct PriceDatasets {
    min_initial_states: MinInitialStates,

    kraken_daily: Option<BTreeMap<WNaiveDate, OHLC>>,
    kraken_1mn: Option<BTreeMap<u32, OHLC>>,
    binance_1mn: Option<BTreeMap<u32, OHLC>>,
    binance_har: Option<BTreeMap<u32, OHLC>>,

    // Inserted
    pub ohlcs: BiMap<OHLC>,

    // Computed
    pub closes: BiMap<f32>,
    pub market_cap: BiMap<f32>,
    pub price_1w_sma: DateMap<f32>,
    pub price_1m_sma: DateMap<f32>,
    pub price_1y_sma: DateMap<f32>,
    pub price_2y_sma: DateMap<f32>,
    pub price_4y_sma: DateMap<f32>,
    pub price_8d_sma: DateMap<f32>,
    pub price_13d_sma: DateMap<f32>,
    pub price_21d_sma: DateMap<f32>,
    pub price_34d_sma: DateMap<f32>,
    pub price_55d_sma: DateMap<f32>,
    pub price_89d_sma: DateMap<f32>,
    pub price_144d_sma: DateMap<f32>,
    pub price_200w_sma: DateMap<f32>,
    pub price_1d_total_return: DateMap<f32>,
    pub price_1m_total_return: DateMap<f32>,
    pub price_6m_total_return: DateMap<f32>,
    pub price_1y_total_return: DateMap<f32>,
    pub price_2y_total_return: DateMap<f32>,
    pub price_3y_total_return: DateMap<f32>,
    pub price_4y_total_return: DateMap<f32>,
    pub price_6y_total_return: DateMap<f32>,
    pub price_8y_total_return: DateMap<f32>,
    pub price_10y_total_return: DateMap<f32>,
    pub price_4y_compound_return: DateMap<f32>,
    // projection via lowest 4y compound value
    // volatility
    // drawdown
    // sats per dollar
}

impl PriceDatasets {
    pub fn import(datasets_path: &str) -> color_eyre::Result<Self> {
        let price_path = "../price";

        let f = |s: &str| format!("{datasets_path}/{s}");

        let mut s = Self {
            min_initial_states: MinInitialStates::default(),

            binance_1mn: None,
            binance_har: None,
            kraken_1mn: None,
            kraken_daily: None,

            ohlcs: BiMap::new_json(1, &format!("{price_path}/ohlc")),
            closes: BiMap::new_json(1, &f("close")),
            market_cap: BiMap::new_bin(1, &f("market_cap")),
            price_1w_sma: DateMap::new_bin(1, &f("price_1w_sma")),
            price_1m_sma: DateMap::new_bin(1, &f("price_1m_sma")),
            price_1y_sma: DateMap::new_bin(1, &f("price_1y_sma")),
            price_2y_sma: DateMap::new_bin(1, &f("price_2y_sma")),
            price_4y_sma: DateMap::new_bin(1, &f("price_4y_sma")),
            price_8d_sma: DateMap::new_bin(1, &f("price_8d_sma")),
            price_13d_sma: DateMap::new_bin(1, &f("price_13d_sma")),
            price_21d_sma: DateMap::new_bin(1, &f("price_21d_sma")),
            price_34d_sma: DateMap::new_bin(1, &f("price_34d_sma")),
            price_55d_sma: DateMap::new_bin(1, &f("price_55d_sma")),
            price_89d_sma: DateMap::new_bin(1, &f("price_89d_sma")),
            price_144d_sma: DateMap::new_bin(1, &f("price_144d_sma")),
            price_200w_sma: DateMap::new_bin(1, &f("price_200w_sma")),
            price_1d_total_return: DateMap::new_bin(1, &f("price_1d_total_return")),
            price_1m_total_return: DateMap::new_bin(1, &f("price_1m_total_return")),
            price_6m_total_return: DateMap::new_bin(1, &f("price_6m_total_return")),
            price_1y_total_return: DateMap::new_bin(1, &f("price_1y_total_return")),
            price_2y_total_return: DateMap::new_bin(1, &f("price_2y_total_return")),
            price_3y_total_return: DateMap::new_bin(1, &f("price_3y_total_return")),
            price_4y_total_return: DateMap::new_bin(1, &f("price_4y_total_return")),
            price_6y_total_return: DateMap::new_bin(1, &f("price_6y_total_return")),
            price_8y_total_return: DateMap::new_bin(1, &f("price_8y_total_return")),
            price_10y_total_return: DateMap::new_bin(1, &f("price_10y_total_return")),
            price_4y_compound_return: DateMap::new_bin(1, &f("price_4y_compound_return")),
        };

        s.min_initial_states
            .consume(MinInitialStates::compute_from_dataset(&s));

        Ok(s)
    }

    pub fn compute(
        &mut self,
        &ComputeData { dates, heights }: &ComputeData,
        circulating_supply: &mut BiMap<f64>,
    ) {
        self.closes
            .multi_insert_simple_transform(heights, dates, &mut self.ohlcs, &|ohlc| ohlc.close);

        self.market_cap
            .multi_insert_multiply(heights, dates, &mut self.closes, circulating_supply);

        self.price_1w_sma.multi_insert_simple_average(
            dates,
            &mut self.closes.date,
            ONE_WEEK_IN_DAYS,
        );

        self.price_1m_sma.multi_insert_simple_average(
            dates,
            &mut self.closes.date,
            ONE_MONTH_IN_DAYS,
        );

        self.price_1y_sma.multi_insert_simple_average(
            dates,
            &mut self.closes.date,
            ONE_YEAR_IN_DAYS,
        );

        self.price_2y_sma.multi_insert_simple_average(
            dates,
            &mut self.closes.date,
            2 * ONE_YEAR_IN_DAYS,
        );

        self.price_4y_sma.multi_insert_simple_average(
            dates,
            &mut self.closes.date,
            4 * ONE_YEAR_IN_DAYS,
        );

        self.price_8d_sma
            .multi_insert_simple_average(dates, &mut self.closes.date, 8);

        self.price_13d_sma
            .multi_insert_simple_average(dates, &mut self.closes.date, 13);

        self.price_21d_sma
            .multi_insert_simple_average(dates, &mut self.closes.date, 21);

        self.price_34d_sma
            .multi_insert_simple_average(dates, &mut self.closes.date, 34);

        self.price_55d_sma
            .multi_insert_simple_average(dates, &mut self.closes.date, 55);

        self.price_89d_sma
            .multi_insert_simple_average(dates, &mut self.closes.date, 89);

        self.price_144d_sma
            .multi_insert_simple_average(dates, &mut self.closes.date, 144);

        self.price_200w_sma.multi_insert_simple_average(
            dates,
            &mut self.closes.date,
            200 * ONE_WEEK_IN_DAYS,
        );

        self.price_1d_total_return
            .multi_insert_percentage_change(dates, &mut self.closes.date, 1);
        self.price_1m_total_return.multi_insert_percentage_change(
            dates,
            &mut self.closes.date,
            ONE_MONTH_IN_DAYS,
        );
        self.price_6m_total_return.multi_insert_percentage_change(
            dates,
            &mut self.closes.date,
            6 * ONE_MONTH_IN_DAYS,
        );
        self.price_1y_total_return.multi_insert_percentage_change(
            dates,
            &mut self.closes.date,
            ONE_YEAR_IN_DAYS,
        );
        self.price_2y_total_return.multi_insert_percentage_change(
            dates,
            &mut self.closes.date,
            2 * ONE_YEAR_IN_DAYS,
        );
        self.price_3y_total_return.multi_insert_percentage_change(
            dates,
            &mut self.closes.date,
            3 * ONE_YEAR_IN_DAYS,
        );
        self.price_4y_total_return.multi_insert_percentage_change(
            dates,
            &mut self.closes.date,
            4 * ONE_YEAR_IN_DAYS,
        );
        self.price_6y_total_return.multi_insert_percentage_change(
            dates,
            &mut self.closes.date,
            6 * ONE_YEAR_IN_DAYS,
        );
        self.price_8y_total_return.multi_insert_percentage_change(
            dates,
            &mut self.closes.date,
            8 * ONE_YEAR_IN_DAYS,
        );
        self.price_10y_total_return.multi_insert_percentage_change(
            dates,
            &mut self.closes.date,
            10 * ONE_YEAR_IN_DAYS,
        );

        self.price_4y_compound_return
            .multi_insert_complex_transform(
                dates,
                &mut self.closes.date,
                |(last_value, date, closes)| {
                    let previous_value = date
                        .checked_sub_days(Days::new(4 * ONE_YEAR_IN_DAYS as u64))
                        .and_then(|date| closes.get_or_import(&WNaiveDate::wrap(date)))
                        .unwrap_or_default();

                    (((last_value / previous_value).powf(1.0 / 4.0)) - 1.0) * 100.0
                },
            );
    }

    pub fn get_date_ohlc(&mut self, date: WNaiveDate) -> color_eyre::Result<OHLC> {
        if self.ohlcs.date.is_date_safe(date) {
            Ok(self.ohlcs.date.get(&date).unwrap().to_owned())
        } else {
            let ohlc = self.get_from_daily_kraken(&date)?;

            self.ohlcs.date.insert(date, ohlc);

            Ok(ohlc)
        }
    }

    fn get_from_daily_kraken(&mut self, date: &WNaiveDate) -> color_eyre::Result<OHLC> {
        if self.kraken_daily.is_none() {
            self.kraken_daily.replace(
                Kraken::fetch_daily_prices()
                    .unwrap_or_else(|_| Binance::fetch_daily_prices().unwrap()),
            );
        }

        self.kraken_daily
            .as_ref()
            .unwrap()
            .get(date)
            .cloned()
            .ok_or(Error::msg("Couldn't find date in daily kraken"))
    }

    pub fn get_height_ohlc(
        &mut self,
        height: usize,
        timestamp: u32,
        previous_timestamp: Option<u32>,
    ) -> color_eyre::Result<OHLC> {
        if let Some(ohlc) = self.ohlcs.height.get(&height) {
            return Ok(ohlc);
        }

        let clean_timestamp = |timestamp| {
            let date_time = Utc.timestamp_opt(i64::from(timestamp), 0).unwrap();

            NaiveDateTime::new(
                date_time.date_naive(),
                NaiveTime::from_hms_opt(date_time.hour(), date_time.minute(), 0).unwrap(),
            )
            .and_utc()
            .timestamp() as u32
        };

        let timestamp = clean_timestamp(timestamp);

        if previous_timestamp.is_none() && height > 0 {
            panic!("Shouldn't be possible");
        }

        let previous_timestamp = previous_timestamp.map(clean_timestamp);

        let ohlc = self.get_from_1mn_kraken(timestamp, previous_timestamp).unwrap_or_else(|_| {
                self.get_from_1mn_binance(timestamp, previous_timestamp)
                    .unwrap_or_else(|_| self.get_from_har_binance(timestamp, previous_timestamp).unwrap_or_else(|_| {
                        let date = WNaiveDate::from_timestamp(timestamp);

                        panic!(
                            "Can't find price for {height} - {timestamp} - {date}, please update binance.har file"
                        )
                    }))
            });

        self.ohlcs.height.insert(height, ohlc);

        Ok(ohlc)
    }

    fn get_from_1mn_kraken(
        &mut self,
        timestamp: u32,
        previous_timestamp: Option<u32>,
    ) -> color_eyre::Result<OHLC> {
        if self.kraken_1mn.is_none() {
            self.kraken_1mn.replace(Kraken::fetch_1mn_prices()?);
        }

        Self::find_height_ohlc(&self.kraken_1mn, timestamp, previous_timestamp, "kraken 1m")
    }

    fn get_from_1mn_binance(
        &mut self,
        timestamp: u32,
        previous_timestamp: Option<u32>,
    ) -> color_eyre::Result<OHLC> {
        if self.binance_1mn.is_none() {
            self.binance_1mn.replace(Binance::fetch_1mn_prices()?);
        }

        Self::find_height_ohlc(
            &self.binance_1mn,
            timestamp,
            previous_timestamp,
            "binance 1m",
        )
    }

    fn get_from_har_binance(
        &mut self,
        timestamp: u32,
        previous_timestamp: Option<u32>,
    ) -> color_eyre::Result<OHLC> {
        if self.binance_har.is_none() {
            self.binance_har.replace(Binance::read_har_file()?);
        }

        Self::find_height_ohlc(
            &self.binance_har,
            timestamp,
            previous_timestamp,
            "binance har",
        )
    }

    fn find_height_ohlc(
        tree: &Option<BTreeMap<u32, OHLC>>,
        timestamp: u32,
        previous_timestamp: Option<u32>,
        name: &str,
    ) -> color_eyre::Result<OHLC> {
        let tree = tree.as_ref().unwrap();

        let err = Error::msg(format!("Couldn't find timestamp in {name}"));

        let previous_ohlc = previous_timestamp
            .map_or(Some(OHLC::default()), |previous_timestamp| {
                tree.get(&previous_timestamp).cloned()
            });

        let last_ohlc = tree.get(&timestamp);

        if previous_ohlc.is_none() || last_ohlc.is_none() {
            return Err(err);
        }

        let previous_ohlc = previous_ohlc.unwrap();

        let mut final_ohlc = OHLC {
            open: previous_ohlc.close,
            high: previous_ohlc.close,
            low: previous_ohlc.close,
            close: previous_ohlc.close,
        };

        let start = previous_timestamp.unwrap_or(0);
        let end = timestamp;

        // Otherwise it's a re-org
        if start < end {
            tree.range(&start..=&end).skip(1).for_each(|(_, ohlc)| {
                if ohlc.high > final_ohlc.high {
                    final_ohlc.high = ohlc.high
                }

                if ohlc.low < final_ohlc.low {
                    final_ohlc.low = ohlc.low
                }

                final_ohlc.close = ohlc.close;
            });
        }

        Ok(final_ohlc)
    }
}

impl AnyDataset for PriceDatasets {
    fn get_min_initial_states(&self) -> &MinInitialStates {
        &self.min_initial_states
    }

    fn to_inserted_bi_map_vec(&self) -> Vec<&(dyn AnyBiMap + Send + Sync)> {
        vec![&self.ohlcs]
    }

    fn to_inserted_mut_bi_map_vec(&mut self) -> Vec<&mut dyn AnyBiMap> {
        vec![&mut self.ohlcs]
    }

    fn to_computed_bi_map_vec(&self) -> Vec<&(dyn AnyBiMap + Send + Sync)> {
        vec![&self.closes, &self.market_cap]
    }

    fn to_computed_mut_bi_map_vec(&mut self) -> Vec<&mut dyn AnyBiMap> {
        vec![&mut self.closes, &mut self.market_cap]
    }

    fn to_computed_date_map_vec(&self) -> Vec<&(dyn AnyDateMap + Send + Sync)> {
        vec![
            &self.price_1w_sma,
            &self.price_1m_sma,
            &self.price_1y_sma,
            &self.price_2y_sma,
            &self.price_4y_sma,
            &self.price_8d_sma,
            &self.price_13d_sma,
            &self.price_21d_sma,
            &self.price_34d_sma,
            &self.price_55d_sma,
            &self.price_89d_sma,
            &self.price_144d_sma,
            &self.price_200w_sma,
            &self.price_1d_total_return,
            &self.price_1m_total_return,
            &self.price_6m_total_return,
            &self.price_1y_total_return,
            &self.price_2y_total_return,
            &self.price_3y_total_return,
            &self.price_4y_total_return,
            &self.price_6y_total_return,
            &self.price_8y_total_return,
            &self.price_10y_total_return,
            &self.price_4y_compound_return,
        ]
    }

    fn to_computed_mut_date_map_vec(&mut self) -> Vec<&mut dyn AnyDateMap> {
        vec![
            &mut self.price_1w_sma,
            &mut self.price_1m_sma,
            &mut self.price_1y_sma,
            &mut self.price_2y_sma,
            &mut self.price_4y_sma,
            &mut self.price_8d_sma,
            &mut self.price_13d_sma,
            &mut self.price_21d_sma,
            &mut self.price_34d_sma,
            &mut self.price_55d_sma,
            &mut self.price_89d_sma,
            &mut self.price_144d_sma,
            &mut self.price_200w_sma,
            &mut self.price_1d_total_return,
            &mut self.price_1m_total_return,
            &mut self.price_6m_total_return,
            &mut self.price_1y_total_return,
            &mut self.price_2y_total_return,
            &mut self.price_3y_total_return,
            &mut self.price_4y_total_return,
            &mut self.price_6y_total_return,
            &mut self.price_8y_total_return,
            &mut self.price_10y_total_return,
            &mut self.price_4y_compound_return,
        ]
    }
}
