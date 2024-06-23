use std::time::Instant;

use crate::utils::log;

use super::ONE_DAY_IN_S;

pub fn time<F, T>(name: &str, function: F) -> T
where
    F: FnOnce() -> T,
{
    let time = Instant::now();

    let returned = function();

    log(&format!("{name}: {} seconds", time.elapsed().as_secs_f32()));

    returned
}

pub fn difference_in_days_between_timestamps(older: u32, younger: u32) -> u32 {
    if younger <= older {
        0
    } else {
        (younger - older) / ONE_DAY_IN_S as u32
    }
}
