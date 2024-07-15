use std::fs::{self, File};

use clap::Parser;
use serde::{Deserialize, Serialize};

#[derive(Parser, Debug, Clone, Default, Serialize, Deserialize)]
#[command(version, about, long_about = None)]
pub struct Config {
    /// bitcoind `-datadir=<dir>` argument
    #[arg(long, value_name = "DIR")]
    pub datadir: Option<String>,

    /// bitcoind `-blocksonly` argument, default: true
    #[arg(long)]
    pub blocksonly: Option<bool>,

    /// bitcoind `-rpcconnect=<ip>` argument
    #[arg(long, value_name = "IP")]
    pub rpcconnect: Option<String>,

    /// Delay between runs, default: 0
    #[arg(long, value_name = "SECONDS")]
    pub delay: Option<u64>,
}

impl Config {
    const PATH: &'static str = "config.toml";

    pub fn read() -> Self {
        File::open(Self::PATH).unwrap();

        let string = fs::read_to_string(Self::PATH).unwrap();

        let config_args = Config::parse();

        let mut config_saved: Config = toml::from_str(&string).unwrap_or_default();

        if let Some(datadir) = config_args.datadir {
            config_saved.datadir = Some(datadir);
        }

        if let Some(blocksonly) = config_args.blocksonly {
            config_saved.blocksonly = Some(blocksonly);
        } else {
            config_saved.blocksonly = Some(true);
        }

        if let Some(rpcconnect) = config_args.rpcconnect {
            config_saved.rpcconnect = Some(rpcconnect);
        }

        if let Some(delay) = config_args.delay {
            config_saved.delay = Some(delay);
        }

        config_saved
    }

    pub fn write(&self) -> std::io::Result<()> {
        fs::write(Self::PATH, toml::to_string(self).unwrap())
    }
}
