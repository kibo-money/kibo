use std::{path::Path, thread::sleep, time::Duration};

use color_eyre::eyre::eyre;
use parser::{iter_blocks, log, BitcoinDB, BitcoinDaemon, Config};

fn main() -> color_eyre::Result<()> {
    color_eyre::install()?;

    let config = Config::read();

    if config.datadir.is_none() {
        return Err(eyre!(
            "You need to set the --datadir parameter at least once to run the parser"
        ));
    }

    config.write()?;

    let daemon = BitcoinDaemon::new(&config);

    loop {
        daemon.stop();

        // Scoped to free bitcoin's lock
        let block_count = {
            let bitcoin_db = BitcoinDB::new(Path::new(&config.datadir.as_ref().unwrap()), true)?;

            // let block_count = 200_000;
            let block_count = bitcoin_db.get_block_count();

            log(&format!("{block_count} blocks found."));

            iter_blocks(&bitcoin_db, block_count)?;

            block_count
        };

        daemon.start();

        if daemon.check_if_fully_synced() {
            daemon.wait_for_new_block(block_count - 1);
        } else {
            daemon.wait_sync();
        }

        if let Some(delay) = config.delay {
            sleep(Duration::from_secs(delay))
        }
    }

    // Ok(())
}
