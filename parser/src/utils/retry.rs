use std::{thread::sleep, time::Duration};

pub fn retry<T>(
    function: impl Fn(usize) -> color_eyre::Result<T>,
    sleep_in_s: u64,
    retries: usize,
) -> color_eyre::Result<T> {
    if retries < 1 {
        unreachable!()
    }

    let mut i = 0;

    loop {
        let res = function(i);

        if i == retries || res.is_ok() {
            return res;
        } else {
            sleep(Duration::from_secs(sleep_in_s));
        }

        i += 1;
    }
}
