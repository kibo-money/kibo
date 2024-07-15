use std::{process::Command, thread::sleep, time::Duration};

use color_eyre::eyre::eyre;
use serde_json::Value;

use crate::{
    utils::{log, log_output, retry},
    Config,
};

struct BlockchainInfo {
    pub headers: u64,
    pub blocks: u64,
}

pub struct BitcoinDaemon {
    config: Config,
}

impl BitcoinDaemon {
    pub fn new(config: &Config) -> Self {
        Self {
            config: config.clone(),
        }
    }

    pub fn start(&self) {
        sleep(Duration::from_secs(1));

        let mut command = Command::new("bitcoind");

        command
            .arg(self.datadir_arg())
            .arg("-txindex=1")
            .arg("-daemon");

        if self.config.blocksonly.unwrap() {
            command.arg("-blocksonly");
        }

        if let Some(ip) = self.config.rpcconnect.as_ref() {
            command.arg(format!("-rpcconnect={}", ip));
        }

        // bitcoind -datadir=/Users/k/Developer/bitcoin -blocksonly -txindex=1 -daemon
        let output = command
            .output()
            .expect("bitcoind to be able to properly start");

        log_output(&output);
    }

    pub fn stop(&self) {
        // bitcoin-cli -datadir=/Users/k/Developer/bitcoin stop
        let output = Command::new("bitcoin-cli")
            .arg(self.datadir_arg())
            .arg("stop")
            .output()
            .unwrap();

        if output.status.success() {
            log_output(&output);

            sleep(Duration::from_secs(15));
        }
    }

    pub fn wait_sync(&self) {
        while !self.check_if_fully_synced() {
            sleep(Duration::from_secs(5))
        }
    }

    pub fn wait_for_new_block(&self, last_block_height: usize) {
        log("Waiting for new block...");

        while self.get_blockchain_info().headers as usize == last_block_height {
            sleep(Duration::from_secs(5))
        }
    }

    pub fn check_if_fully_synced(&self) -> bool {
        let BlockchainInfo { blocks, headers } = self.get_blockchain_info();

        let synced = blocks == headers;

        if synced {
            log(&format!("Synced ! ({blocks} blocks)"));
        } else {
            log(&format!("Syncing... ({} remaining)", headers - blocks));
        }

        synced
    }

    fn get_blockchain_info(&self) -> BlockchainInfo {
        retry(
            || {
                // bitcoin-cli -datadir=/Users/k/Developer/bitcoin getblockchaininfo
                let output = Command::new("bitcoin-cli")
                    .arg(self.datadir_arg())
                    .arg("getblockchaininfo")
                    .output()?;

                let output = String::from_utf8_lossy(&output.stdout);

                let json: Value = serde_json::from_str(&output)?;
                let json = json.as_object().ok_or(eyre!("json as object failed"))?;

                let blocks = json
                    .get("blocks")
                    .ok_or(eyre!("get field 'blocks' from json failed"))?
                    .as_u64()
                    .ok_or(eyre!("blocks to u64 failed"))?;
                let headers = json
                    .get("headers")
                    .ok_or(eyre!("get field 'headers' from json failed"))?
                    .as_u64()
                    .ok_or(eyre!("blocks to u64 failed"))?;

                Ok(BlockchainInfo { headers, blocks })
            },
            1,
            u64::MAX,
        )
        .unwrap()
    }

    fn datadir_arg(&self) -> String {
        if self.config.datadir.is_none() {
            unreachable!();
        }

        format!("-datadir={}", self.config.datadir.as_ref().unwrap())
    }
}
