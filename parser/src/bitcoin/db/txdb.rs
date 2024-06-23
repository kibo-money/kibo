use std::{path::Path, str::FromStr};

use bitcoin::{hashes::Hash, io::Cursor, Txid};
use leveldb::{
    database::Database,
    kv::KV,
    options::{Options, ReadOptions},
};

use crate::utils::log;

use super::{BlockchainRead, OpError, OpResult};

const GENESIS_TXID: &str = "4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b";

///
/// tx-index: looking up transaction position using txid.
///
/// This is possible if Bitcoin Core has `txindex=1`.
///
pub struct TxDB {
    db: Option<Database<TxKey>>,
    genesis_txid: Txid,
}

/// Records transaction storage on disk
pub struct TransactionRecord {
    pub txid: Txid,
    pub n_file: i32,
    pub n_pos: u32,
    pub n_tx_offset: u32,
}

impl TransactionRecord {
    fn from(key: &[u8], values: &[u8]) -> OpResult<Self> {
        let mut reader = Cursor::new(values);
        Ok(TransactionRecord {
            txid: Txid::from_slice(key).unwrap(),
            n_file: reader.read_varint()? as i32,
            n_pos: reader.read_varint()? as u32,
            n_tx_offset: reader.read_varint()? as u32,
        })
    }
}

impl TxDB {
    /// initialize TxDB for transaction queries
    pub fn new(path: &Path) -> TxDB {
        let option_db = TxDB::try_open_db(path);
        if let Some(db) = option_db {
            TxDB {
                db: Some(db),
                genesis_txid: Txid::from_str(GENESIS_TXID).unwrap(),
            }
        } else {
            TxDB::null()
        }
    }

    #[inline]
    pub fn is_open(&self) -> bool {
        self.db.is_some()
    }

    #[inline]
    pub fn null() -> TxDB {
        TxDB {
            db: None,
            genesis_txid: Txid::from_str(GENESIS_TXID).unwrap(),
        }
    }

    #[inline]
    ///
    /// genesis tx is not included in UTXO because of Bitcoin Core Bug
    ///
    pub fn is_genesis_tx(&self, txid: &Txid) -> bool {
        txid == &self.genesis_txid
    }

    fn try_open_db(path: &Path) -> Option<Database<TxKey>> {
        if !path.exists() {
            log("Failed to open tx_index DB: tx_index not built");

            return None;
        }
        let options = Options::new();
        match Database::open(path, options) {
            Ok(db) => {
                log("Successfully opened tx_index DB!");

                Some(db)
            }
            Err(e) => {
                log(&format!("Failed to open tx_index DB: {:?}", e));

                None
            }
        }
    }

    /// note that this function cannot find genesis block, which needs special treatment
    pub fn get_tx_record(&self, txid: &Txid) -> OpResult<TransactionRecord> {
        if let Some(db) = &self.db {
            let inner = txid.as_byte_array();
            let mut key = Vec::with_capacity(inner.len() + 1);
            key.push(b't');
            key.extend(inner);
            let key = TxKey { key };
            let read_options = ReadOptions::new();
            match db.get(read_options, &key) {
                Ok(value) => {
                    if let Some(value) = value {
                        Ok(TransactionRecord::from(&key.key[1..], value.as_slice())?)
                    } else {
                        Err(OpError::from(
                            format!("value not found for txid: {}", txid).as_str(),
                        ))
                    }
                }
                Err(e) => Err(OpError::from(
                    format!("value not found for txid: {}", e).as_str(),
                )),
            }
        } else {
            Err(OpError::from("TxDB not open"))
        }
    }
}

/// levelDB key utility
struct TxKey {
    key: Vec<u8>,
}

/// levelDB key utility
impl db_key::Key for TxKey {
    fn from_u8(key: &[u8]) -> Self {
        TxKey {
            key: Vec::from(key),
        }
    }

    fn as_slice<T, F: Fn(&[u8]) -> T>(&self, f: F) -> T {
        f(&self.key)
    }
}
