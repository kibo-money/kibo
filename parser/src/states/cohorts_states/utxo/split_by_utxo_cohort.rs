use allocative::Allocative;

use super::{UTXOCheck, UTXOCohortId, UTXO_FILTERS};

#[derive(Default, Allocative)]
pub struct SplitByUTXOCohort<T> {
    pub sth: T,
    pub lth: T,

    pub up_to_1d: T,
    pub up_to_1w: T,
    pub up_to_1m: T,
    pub up_to_2m: T,
    pub up_to_3m: T,
    pub up_to_4m: T,
    pub up_to_5m: T,
    pub up_to_6m: T,
    pub up_to_1y: T,
    pub up_to_2y: T,
    pub up_to_3y: T,
    pub up_to_5y: T,
    pub up_to_7y: T,
    pub up_to_10y: T,
    pub up_to_15y: T,

    pub from_1d_to_1w: T,
    pub from_1w_to_1m: T,
    pub from_1m_to_3m: T,
    pub from_3m_to_6m: T,
    pub from_6m_to_1y: T,
    pub from_1y_to_2y: T,
    pub from_2y_to_3y: T,
    pub from_3y_to_5y: T,
    pub from_5y_to_7y: T,
    pub from_7y_to_10y: T,
    pub from_10y_to_15y: T,

    pub from_1y: T,
    pub from_2y: T,
    pub from_4y: T,
    pub from_10y: T,
    pub from_15y: T,

    pub year_2009: T,
    pub year_2010: T,
    pub year_2011: T,
    pub year_2012: T,
    pub year_2013: T,
    pub year_2014: T,
    pub year_2015: T,
    pub year_2016: T,
    pub year_2017: T,
    pub year_2018: T,
    pub year_2019: T,
    pub year_2020: T,
    pub year_2021: T,
    pub year_2022: T,
    pub year_2023: T,
    pub year_2024: T,
}

impl<T> SplitByUTXOCohort<T> {
    pub fn get(&self, id: &UTXOCohortId) -> &T {
        match id {
            UTXOCohortId::UpTo1d => &self.up_to_1d,
            UTXOCohortId::UpTo1w => &self.up_to_1w,
            UTXOCohortId::UpTo1m => &self.up_to_1m,
            UTXOCohortId::UpTo2m => &self.up_to_2m,
            UTXOCohortId::UpTo3m => &self.up_to_3m,
            UTXOCohortId::UpTo4m => &self.up_to_4m,
            UTXOCohortId::UpTo5m => &self.up_to_5m,
            UTXOCohortId::UpTo6m => &self.up_to_6m,
            UTXOCohortId::UpTo1y => &self.up_to_1y,
            UTXOCohortId::UpTo2y => &self.up_to_2y,
            UTXOCohortId::UpTo3y => &self.up_to_3y,
            UTXOCohortId::UpTo5y => &self.up_to_5y,
            UTXOCohortId::UpTo7y => &self.up_to_7y,
            UTXOCohortId::UpTo10y => &self.up_to_10y,
            UTXOCohortId::UpTo15y => &self.up_to_15y,
            UTXOCohortId::From1dTo1w => &self.from_1d_to_1w,
            UTXOCohortId::From1wTo1m => &self.from_1w_to_1m,
            UTXOCohortId::From1mTo3m => &self.from_1m_to_3m,
            UTXOCohortId::From3mTo6m => &self.from_3m_to_6m,
            UTXOCohortId::From6mTo1y => &self.from_6m_to_1y,
            UTXOCohortId::From1yTo2y => &self.from_1y_to_2y,
            UTXOCohortId::From2yTo3y => &self.from_2y_to_3y,
            UTXOCohortId::From3yTo5y => &self.from_3y_to_5y,
            UTXOCohortId::From5yTo7y => &self.from_5y_to_7y,
            UTXOCohortId::From7yTo10y => &self.from_7y_to_10y,
            UTXOCohortId::From10yTo15y => &self.from_10y_to_15y,
            UTXOCohortId::From1y => &self.from_1y,
            UTXOCohortId::From2y => &self.from_2y,
            UTXOCohortId::From4y => &self.from_4y,
            UTXOCohortId::From10y => &self.from_10y,
            UTXOCohortId::From15y => &self.from_15y,
            UTXOCohortId::Year2009 => &self.year_2009,
            UTXOCohortId::Year2010 => &self.year_2010,
            UTXOCohortId::Year2011 => &self.year_2011,
            UTXOCohortId::Year2012 => &self.year_2012,
            UTXOCohortId::Year2013 => &self.year_2013,
            UTXOCohortId::Year2014 => &self.year_2014,
            UTXOCohortId::Year2015 => &self.year_2015,
            UTXOCohortId::Year2016 => &self.year_2016,
            UTXOCohortId::Year2017 => &self.year_2017,
            UTXOCohortId::Year2018 => &self.year_2018,
            UTXOCohortId::Year2019 => &self.year_2019,
            UTXOCohortId::Year2020 => &self.year_2020,
            UTXOCohortId::Year2021 => &self.year_2021,
            UTXOCohortId::Year2022 => &self.year_2022,
            UTXOCohortId::Year2023 => &self.year_2023,
            UTXOCohortId::Year2024 => &self.year_2024,
            UTXOCohortId::ShortTermHolders => &self.sth,
            UTXOCohortId::LongTermHolders => &self.lth,
        }
    }

    pub fn get_mut(&mut self, id: &UTXOCohortId) -> &mut T {
        match id {
            UTXOCohortId::UpTo1d => &mut self.up_to_1d,
            UTXOCohortId::UpTo1w => &mut self.up_to_1w,
            UTXOCohortId::UpTo1m => &mut self.up_to_1m,
            UTXOCohortId::UpTo2m => &mut self.up_to_2m,
            UTXOCohortId::UpTo3m => &mut self.up_to_3m,
            UTXOCohortId::UpTo4m => &mut self.up_to_4m,
            UTXOCohortId::UpTo5m => &mut self.up_to_5m,
            UTXOCohortId::UpTo6m => &mut self.up_to_6m,
            UTXOCohortId::UpTo1y => &mut self.up_to_1y,
            UTXOCohortId::UpTo2y => &mut self.up_to_2y,
            UTXOCohortId::UpTo3y => &mut self.up_to_3y,
            UTXOCohortId::UpTo5y => &mut self.up_to_5y,
            UTXOCohortId::UpTo7y => &mut self.up_to_7y,
            UTXOCohortId::UpTo10y => &mut self.up_to_10y,
            UTXOCohortId::UpTo15y => &mut self.up_to_15y,
            UTXOCohortId::From1dTo1w => &mut self.from_1d_to_1w,
            UTXOCohortId::From1wTo1m => &mut self.from_1w_to_1m,
            UTXOCohortId::From1mTo3m => &mut self.from_1m_to_3m,
            UTXOCohortId::From3mTo6m => &mut self.from_3m_to_6m,
            UTXOCohortId::From6mTo1y => &mut self.from_6m_to_1y,
            UTXOCohortId::From1yTo2y => &mut self.from_1y_to_2y,
            UTXOCohortId::From2yTo3y => &mut self.from_2y_to_3y,
            UTXOCohortId::From3yTo5y => &mut self.from_3y_to_5y,
            UTXOCohortId::From5yTo7y => &mut self.from_5y_to_7y,
            UTXOCohortId::From7yTo10y => &mut self.from_7y_to_10y,
            UTXOCohortId::From10yTo15y => &mut self.from_10y_to_15y,
            UTXOCohortId::From1y => &mut self.from_1y,
            UTXOCohortId::From2y => &mut self.from_2y,
            UTXOCohortId::From4y => &mut self.from_4y,
            UTXOCohortId::From10y => &mut self.from_10y,
            UTXOCohortId::From15y => &mut self.from_15y,
            UTXOCohortId::Year2009 => &mut self.year_2009,
            UTXOCohortId::Year2010 => &mut self.year_2010,
            UTXOCohortId::Year2011 => &mut self.year_2011,
            UTXOCohortId::Year2012 => &mut self.year_2012,
            UTXOCohortId::Year2013 => &mut self.year_2013,
            UTXOCohortId::Year2014 => &mut self.year_2014,
            UTXOCohortId::Year2015 => &mut self.year_2015,
            UTXOCohortId::Year2016 => &mut self.year_2016,
            UTXOCohortId::Year2017 => &mut self.year_2017,
            UTXOCohortId::Year2018 => &mut self.year_2018,
            UTXOCohortId::Year2019 => &mut self.year_2019,
            UTXOCohortId::Year2020 => &mut self.year_2020,
            UTXOCohortId::Year2021 => &mut self.year_2021,
            UTXOCohortId::Year2022 => &mut self.year_2022,
            UTXOCohortId::Year2023 => &mut self.year_2023,
            UTXOCohortId::Year2024 => &mut self.year_2024,
            UTXOCohortId::ShortTermHolders => &mut self.sth,
            UTXOCohortId::LongTermHolders => &mut self.lth,
        }
    }

    /// Excluding years since they're static
    pub fn duo_filtered_apply(
        &mut self,
        current_days_old: &u32,
        previous_days_old: &u32,
        apply_if_current_only: impl Fn(&mut T),
        apply_if_previous_only: impl Fn(&mut T),
    ) {
        let is_up_to_1d = UTXO_FILTERS.up_to_1d.check_days_old(current_days_old);
        let was_up_to_1d = UTXO_FILTERS.up_to_1d.check_days_old(previous_days_old);
        if is_up_to_1d && !was_up_to_1d {
            apply_if_current_only(&mut self.up_to_1d);
        } else if was_up_to_1d && !is_up_to_1d {
            apply_if_previous_only(&mut self.up_to_1d);
        }

        let is_up_to_1w = UTXO_FILTERS.up_to_1w.check_days_old(current_days_old);
        let was_up_to_1w = UTXO_FILTERS.up_to_1w.check_days_old(previous_days_old);
        if is_up_to_1w && !was_up_to_1w {
            apply_if_current_only(&mut self.up_to_1w);
        } else if was_up_to_1w && !is_up_to_1w {
            apply_if_previous_only(&mut self.up_to_1w);
        }

        let is_up_to_1m = UTXO_FILTERS.up_to_1m.check_days_old(current_days_old);
        let was_up_to_1m = UTXO_FILTERS.up_to_1m.check_days_old(previous_days_old);
        if is_up_to_1m && !was_up_to_1m {
            apply_if_current_only(&mut self.up_to_1m);
        } else if was_up_to_1m && !is_up_to_1m {
            apply_if_previous_only(&mut self.up_to_1m);
        }

        let is_up_to_2m = UTXO_FILTERS.up_to_2m.check_days_old(current_days_old);
        let was_up_to_2m = UTXO_FILTERS.up_to_2m.check_days_old(previous_days_old);
        if is_up_to_2m && !was_up_to_2m {
            apply_if_current_only(&mut self.up_to_2m);
        } else if was_up_to_2m && !is_up_to_2m {
            apply_if_previous_only(&mut self.up_to_2m);
        }

        let is_up_to_3m = UTXO_FILTERS.up_to_3m.check_days_old(current_days_old);
        let was_up_to_3m = UTXO_FILTERS.up_to_3m.check_days_old(previous_days_old);
        if is_up_to_3m && !was_up_to_3m {
            apply_if_current_only(&mut self.up_to_3m);
        } else if was_up_to_3m && !is_up_to_3m {
            apply_if_previous_only(&mut self.up_to_3m);
        }

        let is_up_to_4m = UTXO_FILTERS.up_to_4m.check_days_old(current_days_old);
        let was_up_to_4m = UTXO_FILTERS.up_to_4m.check_days_old(previous_days_old);
        if is_up_to_4m && !was_up_to_4m {
            apply_if_current_only(&mut self.up_to_4m);
        } else if was_up_to_4m && !is_up_to_4m {
            apply_if_previous_only(&mut self.up_to_4m);
        }

        let is_up_to_5m = UTXO_FILTERS.up_to_5m.check_days_old(current_days_old);
        let was_up_to_5m = UTXO_FILTERS.up_to_5m.check_days_old(previous_days_old);
        if is_up_to_5m && !was_up_to_5m {
            apply_if_current_only(&mut self.up_to_5m);
        } else if was_up_to_5m && !is_up_to_5m {
            apply_if_previous_only(&mut self.up_to_5m);
        }

        let is_up_to_6m = UTXO_FILTERS.up_to_6m.check_days_old(current_days_old);
        let was_up_to_6m = UTXO_FILTERS.up_to_6m.check_days_old(previous_days_old);
        if is_up_to_6m && !was_up_to_6m {
            apply_if_current_only(&mut self.up_to_6m);
        } else if was_up_to_6m && !is_up_to_6m {
            apply_if_previous_only(&mut self.up_to_6m);
        }

        let is_up_to_1y = UTXO_FILTERS.up_to_1y.check_days_old(current_days_old);
        let was_up_to_1y = UTXO_FILTERS.up_to_1y.check_days_old(previous_days_old);
        if is_up_to_1y && !was_up_to_1y {
            apply_if_current_only(&mut self.up_to_1y);
        } else if was_up_to_1y && !is_up_to_1y {
            apply_if_previous_only(&mut self.up_to_1y);
        }

        let is_up_to_2y = UTXO_FILTERS.up_to_2y.check_days_old(current_days_old);
        let was_up_to_2y = UTXO_FILTERS.up_to_2y.check_days_old(previous_days_old);
        if is_up_to_2y && !was_up_to_2y {
            apply_if_current_only(&mut self.up_to_2y);
        } else if was_up_to_2y && !is_up_to_2y {
            apply_if_previous_only(&mut self.up_to_2y);
        }

        let is_up_to_3y = UTXO_FILTERS.up_to_3y.check_days_old(current_days_old);
        let was_up_to_3y = UTXO_FILTERS.up_to_3y.check_days_old(previous_days_old);
        if is_up_to_3y && !was_up_to_3y {
            apply_if_current_only(&mut self.up_to_3y);
        } else if was_up_to_3y && !is_up_to_3y {
            apply_if_previous_only(&mut self.up_to_3y);
        }

        let is_up_to_5y = UTXO_FILTERS.up_to_5y.check_days_old(current_days_old);
        let was_up_to_5y = UTXO_FILTERS.up_to_5y.check_days_old(previous_days_old);
        if is_up_to_5y && !was_up_to_5y {
            apply_if_current_only(&mut self.up_to_5y);
        } else if was_up_to_5y && !is_up_to_5y {
            apply_if_previous_only(&mut self.up_to_5y);
        }

        let is_up_to_7y = UTXO_FILTERS.up_to_7y.check_days_old(current_days_old);
        let was_up_to_7y = UTXO_FILTERS.up_to_7y.check_days_old(previous_days_old);
        if is_up_to_7y && !was_up_to_7y {
            apply_if_current_only(&mut self.up_to_7y);
        } else if was_up_to_7y && !is_up_to_7y {
            apply_if_previous_only(&mut self.up_to_7y);
        }

        let is_up_to_10y = UTXO_FILTERS.up_to_10y.check_days_old(current_days_old);
        let was_up_to_10y = UTXO_FILTERS.up_to_10y.check_days_old(previous_days_old);
        if is_up_to_10y && !was_up_to_10y {
            apply_if_current_only(&mut self.up_to_10y);
        } else if was_up_to_10y && !is_up_to_10y {
            apply_if_previous_only(&mut self.up_to_10y);
        }

        let is_up_to_15y = UTXO_FILTERS.up_to_15y.check_days_old(current_days_old);
        let was_up_to_15y = UTXO_FILTERS.up_to_15y.check_days_old(previous_days_old);
        if is_up_to_15y && !was_up_to_15y {
            apply_if_current_only(&mut self.up_to_15y);
        } else if was_up_to_15y && !is_up_to_15y {
            apply_if_previous_only(&mut self.up_to_15y);
        }

        let is_from_1d_to_1w = UTXO_FILTERS.from_1d_to_1w.check_days_old(current_days_old);
        let was_from_1d_to_1w = UTXO_FILTERS.from_1d_to_1w.check_days_old(previous_days_old);
        if is_from_1d_to_1w && !was_from_1d_to_1w {
            apply_if_current_only(&mut self.from_1d_to_1w);
        } else if was_from_1d_to_1w && !is_from_1d_to_1w {
            apply_if_previous_only(&mut self.from_1d_to_1w);
        }

        let is_from_1w_to_1m = UTXO_FILTERS.from_1w_to_1m.check_days_old(current_days_old);
        let was_from_1w_to_1m = UTXO_FILTERS.from_1w_to_1m.check_days_old(previous_days_old);
        if is_from_1w_to_1m && !was_from_1w_to_1m {
            apply_if_current_only(&mut self.from_1w_to_1m);
        } else if was_from_1w_to_1m && !is_from_1w_to_1m {
            apply_if_previous_only(&mut self.from_1w_to_1m);
        }

        let is_from_1m_to_3m = UTXO_FILTERS.from_1m_to_3m.check_days_old(current_days_old);
        let was_from_1m_to_3m = UTXO_FILTERS.from_1m_to_3m.check_days_old(previous_days_old);
        if is_from_1m_to_3m && !was_from_1m_to_3m {
            apply_if_current_only(&mut self.from_1m_to_3m);
        } else if was_from_1m_to_3m && !is_from_1m_to_3m {
            apply_if_previous_only(&mut self.from_1m_to_3m);
        }

        let is_from_3m_to_6m = UTXO_FILTERS.from_3m_to_6m.check_days_old(current_days_old);
        let was_from_3m_to_6m = UTXO_FILTERS.from_3m_to_6m.check_days_old(previous_days_old);
        if is_from_3m_to_6m && !was_from_3m_to_6m {
            apply_if_current_only(&mut self.from_3m_to_6m);
        } else if was_from_3m_to_6m && !is_from_3m_to_6m {
            apply_if_previous_only(&mut self.from_3m_to_6m);
        }

        let is_from_6m_to_1y = UTXO_FILTERS.from_6m_to_1y.check_days_old(current_days_old);
        let was_from_6m_to_1y = UTXO_FILTERS.from_6m_to_1y.check_days_old(previous_days_old);
        if is_from_6m_to_1y && !was_from_6m_to_1y {
            apply_if_current_only(&mut self.from_6m_to_1y);
        } else if was_from_6m_to_1y && !is_from_6m_to_1y {
            apply_if_previous_only(&mut self.from_6m_to_1y);
        }

        let is_from_1y_to_2y = UTXO_FILTERS.from_1y_to_2y.check_days_old(current_days_old);
        let was_from_1y_to_2y = UTXO_FILTERS.from_1y_to_2y.check_days_old(previous_days_old);
        if is_from_1y_to_2y && !was_from_1y_to_2y {
            apply_if_current_only(&mut self.from_1y_to_2y);
        } else if was_from_1y_to_2y && !is_from_1y_to_2y {
            apply_if_previous_only(&mut self.from_1y_to_2y);
        }

        let is_from_2y_to_3y = UTXO_FILTERS.from_2y_to_3y.check_days_old(current_days_old);
        let was_from_2y_to_3y = UTXO_FILTERS.from_2y_to_3y.check_days_old(previous_days_old);
        if is_from_2y_to_3y && !was_from_2y_to_3y {
            apply_if_current_only(&mut self.from_2y_to_3y);
        } else if was_from_2y_to_3y && !is_from_2y_to_3y {
            apply_if_previous_only(&mut self.from_2y_to_3y);
        }

        let is_from_3y_to_5y = UTXO_FILTERS.from_3y_to_5y.check_days_old(current_days_old);
        let was_from_3y_to_5y = UTXO_FILTERS.from_3y_to_5y.check_days_old(previous_days_old);
        if is_from_3y_to_5y && !was_from_3y_to_5y {
            apply_if_current_only(&mut self.from_3y_to_5y);
        } else if was_from_3y_to_5y && !is_from_3y_to_5y {
            apply_if_previous_only(&mut self.from_3y_to_5y);
        }

        let is_from_5y_to_7y = UTXO_FILTERS.from_5y_to_7y.check_days_old(current_days_old);
        let was_from_5y_to_7y = UTXO_FILTERS.from_5y_to_7y.check_days_old(previous_days_old);
        if is_from_5y_to_7y && !was_from_5y_to_7y {
            apply_if_current_only(&mut self.from_5y_to_7y);
        } else if was_from_5y_to_7y && !is_from_5y_to_7y {
            apply_if_previous_only(&mut self.from_5y_to_7y);
        }

        let is_from_7y_to_10y = UTXO_FILTERS.from_7y_to_10y.check_days_old(current_days_old);
        let was_from_7y_to_10y = UTXO_FILTERS
            .from_7y_to_10y
            .check_days_old(previous_days_old);
        if is_from_7y_to_10y && !was_from_7y_to_10y {
            apply_if_current_only(&mut self.from_7y_to_10y);
        } else if was_from_7y_to_10y && !is_from_7y_to_10y {
            apply_if_previous_only(&mut self.from_7y_to_10y);
        }

        let is_from_10y_to_15y = UTXO_FILTERS
            .from_10y_to_15y
            .check_days_old(current_days_old);
        let was_from_10y_to_15y = UTXO_FILTERS
            .from_10y_to_15y
            .check_days_old(previous_days_old);
        if is_from_10y_to_15y && !was_from_10y_to_15y {
            apply_if_current_only(&mut self.from_10y_to_15y);
        } else if was_from_10y_to_15y && !is_from_10y_to_15y {
            apply_if_previous_only(&mut self.from_10y_to_15y);
        }

        let is_from_1y = UTXO_FILTERS.from_1y.check_days_old(current_days_old);
        let was_from_1y = UTXO_FILTERS.from_1y.check_days_old(previous_days_old);
        if is_from_1y && !was_from_1y {
            apply_if_current_only(&mut self.from_1y);
        } else if was_from_1y && !is_from_1y {
            apply_if_previous_only(&mut self.from_1y);
        }

        let is_from_2y = UTXO_FILTERS.from_2y.check_days_old(current_days_old);
        let was_from_2y = UTXO_FILTERS.from_2y.check_days_old(previous_days_old);
        if is_from_2y && !was_from_2y {
            apply_if_current_only(&mut self.from_2y);
        } else if was_from_2y && !is_from_2y {
            apply_if_previous_only(&mut self.from_2y);
        }

        let is_from_4y = UTXO_FILTERS.from_4y.check_days_old(current_days_old);
        let was_from_4y = UTXO_FILTERS.from_4y.check_days_old(previous_days_old);
        if is_from_4y && !was_from_4y {
            apply_if_current_only(&mut self.from_4y);
        } else if was_from_4y && !is_from_4y {
            apply_if_previous_only(&mut self.from_4y);
        }

        let is_from_10y = UTXO_FILTERS.from_10y.check_days_old(current_days_old);
        let was_from_10y = UTXO_FILTERS.from_10y.check_days_old(previous_days_old);
        if is_from_10y && !was_from_10y {
            apply_if_current_only(&mut self.from_10y);
        } else if was_from_10y && !is_from_10y {
            apply_if_previous_only(&mut self.from_10y);
        }

        let is_from_15y = UTXO_FILTERS.from_15y.check_days_old(current_days_old);
        let was_from_15y = UTXO_FILTERS.from_15y.check_days_old(previous_days_old);
        if is_from_15y && !was_from_15y {
            apply_if_current_only(&mut self.from_15y);
        } else if was_from_15y && !is_from_15y {
            apply_if_previous_only(&mut self.from_15y);
        }

        let is_sth = UTXO_FILTERS.sth.check_days_old(current_days_old);
        let was_sth = UTXO_FILTERS.sth.check_days_old(previous_days_old);
        if is_sth && !was_sth {
            apply_if_current_only(&mut self.sth);
        } else if was_sth && !is_sth {
            apply_if_previous_only(&mut self.sth);
        }

        let is_lth = UTXO_FILTERS.lth.check_days_old(current_days_old);
        let was_lth = UTXO_FILTERS.lth.check_days_old(previous_days_old);
        if is_lth && !was_lth {
            if is_sth {
                unreachable!()
            }

            apply_if_current_only(&mut self.lth);
        } else if was_lth && !is_lth {
            if was_sth {
                unreachable!()
            }
            // unreachable!();
            apply_if_previous_only(&mut self.lth);
        }
    }

    /// Includes years since it's the initial apply
    pub fn initial_filtered_apply(&mut self, days_old: &u32, year: &u32, apply: impl Fn(&mut T)) {
        if UTXO_FILTERS.up_to_1d.check(days_old, year) {
            apply(&mut self.up_to_1d);
        } else if UTXO_FILTERS.from_1d_to_1w.check(days_old, year) {
            apply(&mut self.from_1d_to_1w);
        } else if UTXO_FILTERS.from_1w_to_1m.check(days_old, year) {
            apply(&mut self.from_1w_to_1m);
        } else if UTXO_FILTERS.from_1m_to_3m.check(days_old, year) {
            apply(&mut self.from_1m_to_3m);
        } else if UTXO_FILTERS.from_3m_to_6m.check(days_old, year) {
            apply(&mut self.from_3m_to_6m);
        } else if UTXO_FILTERS.from_6m_to_1y.check(days_old, year) {
            apply(&mut self.from_6m_to_1y);
        } else if UTXO_FILTERS.from_1y_to_2y.check(days_old, year) {
            apply(&mut self.from_1y_to_2y);
        } else if UTXO_FILTERS.from_2y_to_3y.check(days_old, year) {
            apply(&mut self.from_2y_to_3y);
        } else if UTXO_FILTERS.from_3y_to_5y.check(days_old, year) {
            apply(&mut self.from_3y_to_5y);
        } else if UTXO_FILTERS.from_5y_to_7y.check(days_old, year) {
            apply(&mut self.from_5y_to_7y);
        } else if UTXO_FILTERS.from_7y_to_10y.check(days_old, year) {
            apply(&mut self.from_7y_to_10y);
        } else if UTXO_FILTERS.from_10y_to_15y.check(days_old, year) {
            apply(&mut self.from_10y_to_15y);
        }

        if UTXO_FILTERS.year_2009.check(days_old, year) {
            apply(&mut self.year_2009);
        } else if UTXO_FILTERS.year_2010.check(days_old, year) {
            apply(&mut self.year_2010);
        } else if UTXO_FILTERS.year_2011.check(days_old, year) {
            apply(&mut self.year_2011);
        } else if UTXO_FILTERS.year_2012.check(days_old, year) {
            apply(&mut self.year_2012);
        } else if UTXO_FILTERS.year_2013.check(days_old, year) {
            apply(&mut self.year_2013);
        } else if UTXO_FILTERS.year_2014.check(days_old, year) {
            apply(&mut self.year_2014);
        } else if UTXO_FILTERS.year_2015.check(days_old, year) {
            apply(&mut self.year_2015);
        } else if UTXO_FILTERS.year_2016.check(days_old, year) {
            apply(&mut self.year_2016);
        } else if UTXO_FILTERS.year_2017.check(days_old, year) {
            apply(&mut self.year_2017);
        } else if UTXO_FILTERS.year_2018.check(days_old, year) {
            apply(&mut self.year_2018);
        } else if UTXO_FILTERS.year_2019.check(days_old, year) {
            apply(&mut self.year_2019);
        } else if UTXO_FILTERS.year_2020.check(days_old, year) {
            apply(&mut self.year_2020);
        } else if UTXO_FILTERS.year_2021.check(days_old, year) {
            apply(&mut self.year_2021);
        } else if UTXO_FILTERS.year_2022.check(days_old, year) {
            apply(&mut self.year_2022);
        } else if UTXO_FILTERS.year_2023.check(days_old, year) {
            apply(&mut self.year_2023);
        } else if UTXO_FILTERS.year_2024.check(days_old, year) {
            apply(&mut self.year_2024);
        }

        if UTXO_FILTERS.sth.check(days_old, year) {
            apply(&mut self.sth);
        } else if UTXO_FILTERS.lth.check(days_old, year) {
            apply(&mut self.lth);
        } else {
            unreachable!()
        }

        if UTXO_FILTERS.from_1y.check(days_old, year) {
            apply(&mut self.from_1y);
        }

        if UTXO_FILTERS.from_2y.check(days_old, year) {
            apply(&mut self.from_2y);
        }

        if UTXO_FILTERS.from_4y.check(days_old, year) {
            apply(&mut self.from_4y);
        }

        if UTXO_FILTERS.from_10y.check(days_old, year) {
            apply(&mut self.from_10y);
        }

        if UTXO_FILTERS.from_15y.check(days_old, year) {
            apply(&mut self.from_15y);
        }

        if UTXO_FILTERS.up_to_15y.check(days_old, year) {
            apply(&mut self.up_to_15y);
        } else {
            return;
        }

        if UTXO_FILTERS.up_to_10y.check(days_old, year) {
            apply(&mut self.up_to_10y);
        } else {
            return;
        }

        if UTXO_FILTERS.up_to_7y.check(days_old, year) {
            apply(&mut self.up_to_7y);
        } else {
            return;
        }

        if UTXO_FILTERS.up_to_5y.check(days_old, year) {
            apply(&mut self.up_to_5y);
        } else {
            return;
        }

        if UTXO_FILTERS.up_to_3y.check(days_old, year) {
            apply(&mut self.up_to_3y);
        } else {
            return;
        }

        if UTXO_FILTERS.up_to_2y.check(days_old, year) {
            apply(&mut self.up_to_2y);
        } else {
            return;
        }

        if UTXO_FILTERS.up_to_1y.check(days_old, year) {
            apply(&mut self.up_to_1y);
        } else {
            return;
        }

        if UTXO_FILTERS.up_to_6m.check(days_old, year) {
            apply(&mut self.up_to_6m);
        } else {
            return;
        }

        if UTXO_FILTERS.up_to_5m.check(days_old, year) {
            apply(&mut self.up_to_5m);
        } else {
            return;
        }

        if UTXO_FILTERS.up_to_4m.check(days_old, year) {
            apply(&mut self.up_to_4m);
        } else {
            return;
        }

        if UTXO_FILTERS.up_to_3m.check(days_old, year) {
            apply(&mut self.up_to_3m);
        } else {
            return;
        }

        if UTXO_FILTERS.up_to_2m.check(days_old, year) {
            apply(&mut self.up_to_2m);
        } else {
            return;
        }

        if UTXO_FILTERS.up_to_1m.check(days_old, year) {
            apply(&mut self.up_to_1m);
        } else {
            return;
        }

        if UTXO_FILTERS.up_to_1w.check(days_old, year) {
            apply(&mut self.up_to_1w);
        }
    }

    #[inline(always)]
    pub fn as_vec(&self) -> Vec<(&T, UTXOCohortId)> {
        vec![
            (&self.up_to_1d, UTXOCohortId::UpTo1d),
            (&self.up_to_1w, UTXOCohortId::UpTo1w),
            (&self.up_to_1m, UTXOCohortId::UpTo1m),
            (&self.up_to_2m, UTXOCohortId::UpTo2m),
            (&self.up_to_3m, UTXOCohortId::UpTo3m),
            (&self.up_to_4m, UTXOCohortId::UpTo4m),
            (&self.up_to_5m, UTXOCohortId::UpTo5m),
            (&self.up_to_6m, UTXOCohortId::UpTo6m),
            (&self.up_to_1y, UTXOCohortId::UpTo1y),
            (&self.up_to_2y, UTXOCohortId::UpTo2y),
            (&self.up_to_3y, UTXOCohortId::UpTo3y),
            (&self.up_to_5y, UTXOCohortId::UpTo5y),
            (&self.up_to_7y, UTXOCohortId::UpTo7y),
            (&self.up_to_10y, UTXOCohortId::UpTo10y),
            (&self.up_to_15y, UTXOCohortId::UpTo15y),
            (&self.from_1d_to_1w, UTXOCohortId::From1dTo1w),
            (&self.from_1w_to_1m, UTXOCohortId::From1wTo1m),
            (&self.from_1m_to_3m, UTXOCohortId::From1mTo3m),
            (&self.from_3m_to_6m, UTXOCohortId::From3mTo6m),
            (&self.from_6m_to_1y, UTXOCohortId::From6mTo1y),
            (&self.from_1y_to_2y, UTXOCohortId::From1yTo2y),
            (&self.from_2y_to_3y, UTXOCohortId::From2yTo3y),
            (&self.from_3y_to_5y, UTXOCohortId::From3yTo5y),
            (&self.from_5y_to_7y, UTXOCohortId::From5yTo7y),
            (&self.from_7y_to_10y, UTXOCohortId::From7yTo10y),
            (&self.from_10y_to_15y, UTXOCohortId::From10yTo15y),
            (&self.from_1y, UTXOCohortId::From1y),
            (&self.from_2y, UTXOCohortId::From2y),
            (&self.from_4y, UTXOCohortId::From4y),
            (&self.from_10y, UTXOCohortId::From10y),
            (&self.from_15y, UTXOCohortId::From15y),
            (&self.year_2009, UTXOCohortId::Year2009),
            (&self.year_2010, UTXOCohortId::Year2010),
            (&self.year_2011, UTXOCohortId::Year2011),
            (&self.year_2012, UTXOCohortId::Year2012),
            (&self.year_2013, UTXOCohortId::Year2013),
            (&self.year_2014, UTXOCohortId::Year2014),
            (&self.year_2015, UTXOCohortId::Year2015),
            (&self.year_2016, UTXOCohortId::Year2016),
            (&self.year_2017, UTXOCohortId::Year2017),
            (&self.year_2018, UTXOCohortId::Year2018),
            (&self.year_2019, UTXOCohortId::Year2019),
            (&self.year_2020, UTXOCohortId::Year2020),
            (&self.year_2021, UTXOCohortId::Year2021),
            (&self.year_2022, UTXOCohortId::Year2022),
            (&self.year_2023, UTXOCohortId::Year2023),
            (&self.year_2024, UTXOCohortId::Year2024),
            (&self.sth, UTXOCohortId::ShortTermHolders),
            (&self.lth, UTXOCohortId::LongTermHolders),
        ]
    }

    #[inline(always)]
    pub fn as_mut_vec(&mut self) -> Vec<(&mut T, UTXOCohortId)> {
        vec![
            (&mut self.up_to_1d, UTXOCohortId::UpTo1d),
            (&mut self.up_to_1w, UTXOCohortId::UpTo1w),
            (&mut self.up_to_1m, UTXOCohortId::UpTo1m),
            (&mut self.up_to_2m, UTXOCohortId::UpTo2m),
            (&mut self.up_to_3m, UTXOCohortId::UpTo3m),
            (&mut self.up_to_4m, UTXOCohortId::UpTo4m),
            (&mut self.up_to_5m, UTXOCohortId::UpTo5m),
            (&mut self.up_to_6m, UTXOCohortId::UpTo6m),
            (&mut self.up_to_1y, UTXOCohortId::UpTo1y),
            (&mut self.up_to_2y, UTXOCohortId::UpTo2y),
            (&mut self.up_to_3y, UTXOCohortId::UpTo3y),
            (&mut self.up_to_5y, UTXOCohortId::UpTo5y),
            (&mut self.up_to_7y, UTXOCohortId::UpTo7y),
            (&mut self.up_to_10y, UTXOCohortId::UpTo10y),
            (&mut self.up_to_15y, UTXOCohortId::UpTo15y),
            (&mut self.from_1d_to_1w, UTXOCohortId::From1dTo1w),
            (&mut self.from_1w_to_1m, UTXOCohortId::From1wTo1m),
            (&mut self.from_1m_to_3m, UTXOCohortId::From1mTo3m),
            (&mut self.from_3m_to_6m, UTXOCohortId::From3mTo6m),
            (&mut self.from_6m_to_1y, UTXOCohortId::From6mTo1y),
            (&mut self.from_1y_to_2y, UTXOCohortId::From1yTo2y),
            (&mut self.from_2y_to_3y, UTXOCohortId::From2yTo3y),
            (&mut self.from_3y_to_5y, UTXOCohortId::From3yTo5y),
            (&mut self.from_5y_to_7y, UTXOCohortId::From5yTo7y),
            (&mut self.from_7y_to_10y, UTXOCohortId::From7yTo10y),
            (&mut self.from_10y_to_15y, UTXOCohortId::From10yTo15y),
            (&mut self.from_1y, UTXOCohortId::From1y),
            (&mut self.from_2y, UTXOCohortId::From2y),
            (&mut self.from_4y, UTXOCohortId::From4y),
            (&mut self.from_10y, UTXOCohortId::From10y),
            (&mut self.from_15y, UTXOCohortId::From15y),
            (&mut self.year_2009, UTXOCohortId::Year2009),
            (&mut self.year_2010, UTXOCohortId::Year2010),
            (&mut self.year_2011, UTXOCohortId::Year2011),
            (&mut self.year_2012, UTXOCohortId::Year2012),
            (&mut self.year_2013, UTXOCohortId::Year2013),
            (&mut self.year_2014, UTXOCohortId::Year2014),
            (&mut self.year_2015, UTXOCohortId::Year2015),
            (&mut self.year_2016, UTXOCohortId::Year2016),
            (&mut self.year_2017, UTXOCohortId::Year2017),
            (&mut self.year_2018, UTXOCohortId::Year2018),
            (&mut self.year_2019, UTXOCohortId::Year2019),
            (&mut self.year_2020, UTXOCohortId::Year2020),
            (&mut self.year_2021, UTXOCohortId::Year2021),
            (&mut self.year_2022, UTXOCohortId::Year2022),
            (&mut self.year_2023, UTXOCohortId::Year2023),
            (&mut self.year_2024, UTXOCohortId::Year2024),
            (&mut self.sth, UTXOCohortId::ShortTermHolders),
            (&mut self.lth, UTXOCohortId::LongTermHolders),
        ]
    }
}
