use std::{thread::sleep, time::Duration};

use biter::bitcoincore_rpc::RpcApi;
use parser::{create_rpc, iter_blocks, log, reset_logs, Config};

fn main() -> color_eyre::Result<()> {
    color_eyre::install()?;

    reset_logs();

    let config = Config::import();

    let rpc = create_rpc(&config).unwrap();

    loop {
        let block_count = rpc.get_blockchain_info().unwrap().blocks as usize;

        log(&format!("{block_count} blocks found."));

        iter_blocks(&config, &rpc, block_count)?;

        if let Some(delay) = config.delay {
            sleep(Duration::from_secs(delay))
        }

        log("Waiting for new block...");
        while block_count == rpc.get_blockchain_info().unwrap().blocks as usize {
            sleep(Duration::from_secs(5))
        }
    }

    // Ok(())
}
