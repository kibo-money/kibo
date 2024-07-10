use std::{env::args, path::Path};

use itertools::Itertools;
use parser::{iter_blocks, log, BitcoinDB, BitcoinDaemon};

fn main() -> color_eyre::Result<()> {
    let mut args = args().collect_vec();
    let bitcoin_dir_path = args.get(1).unwrap().to_owned();
    args.drain(0..2);

    color_eyre::install()?;

    let deamon = BitcoinDaemon::new(bitcoin_dir_path.to_owned(), args);

    loop {
        deamon.stop();

        // Scoped to free bitcoin's lock
        let block_count = {
            let bitcoin_db = BitcoinDB::new(Path::new(&bitcoin_dir_path), true)?;

            // let block_count = 200_000;
            let block_count = bitcoin_db.get_block_count();

            log(&format!("{block_count} blocks found."));

            iter_blocks(&bitcoin_db, block_count)?;

            block_count
        };

        deamon.start();

        if deamon.check_if_fully_synced() {
            deamon.wait_for_new_block(block_count - 1);
        } else {
            deamon.wait_sync();
        }
    }

    // Ok(())
}
