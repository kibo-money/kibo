//!
//! Mostly a stripped down copy pasta of bitcoin-explorer
//!
//! Huge props to https://github.com/Congyuwang
//!
//! Crates APIs, essential structs, functions, methods are all here!
//!
//! To quickly understand how to use this crate, have a look at the
//! documentation for `bitcoin_explorer::BitcoinDB`!!.
//!

mod blk_files;
mod block_iter;
mod blocks_indexes;
mod errors;
mod reader;
mod txdb;

use blk_files::*;
use blocks_indexes::*;
use errors::*;
use reader::*;
use txdb::*;

use std::ops::Deref;
use std::path::Path;
use std::sync::Arc;

use bitcoin::{Block, Transaction, Txid};

pub use block_iter::BlockIter;

pub struct InnerDB {
    pub blocks_indexes: BlocksIndexes,
    pub blk_files: BlkFiles,
    pub tx_db: TxDB,
}

///
/// This is the main struct of this crate!! Click and read the doc.
///
/// All queries start from initializing `BitcoinDB`.
///
/// Note: This is an Arc wrap around `InnerDB`.
///
#[derive(Clone)]
pub struct BitcoinDB(Arc<InnerDB>);

impl Deref for BitcoinDB {
    type Target = InnerDB;

    fn deref(&self) -> &Self::Target {
        self.0.deref()
    }
}

impl BitcoinDB {
    ///
    /// This is the main structure for reading Bitcoin blockchain data.
    ///
    /// Instantiating this class by passing the `-datadir` directory of
    /// Bitcoin core to the `new()` method.
    /// `tx_index`: whether to try to open tx_index levelDB.
    ///
    pub fn new(p: &Path, tx_index: bool) -> OpResult<BitcoinDB> {
        if !p.exists() {
            return Err(OpError::from("data_dir does not exist"));
        }
        let blk_path = p.join("blocks");
        let index_path = blk_path.join("index");
        let blocks_indexes = BlocksIndexes::new(index_path.as_path())?;
        let tx_db = if tx_index {
            let tx_index_path = p.join("indexes").join("txindex");
            TxDB::new(&tx_index_path)
        } else {
            TxDB::null()
        };
        let inner = InnerDB {
            blocks_indexes,
            blk_files: BlkFiles::new(blk_path.as_path())?,
            tx_db,
        };
        Ok(BitcoinDB(Arc::new(inner)))
    }

    ///
    /// Get the maximum number of blocks downloaded.
    ///
    /// This API guarantee that block 0 to `get_block_count() - 1`
    /// have been downloaded and available for query.
    ///
    pub fn get_block_count(&self) -> usize {
        let records = self.blocks_indexes.len();
        for h in 0..records {
            // n_tx == 0 indicates that the block is not downloaded
            if self.blocks_indexes.get(h).unwrap().n_tx == 0 {
                return h;
            }
        }
        records
    }

    ///
    /// Get a block
    ///
    pub fn get_block(&self, height: usize) -> OpResult<Block> {
        if let Some(index) = self.blocks_indexes.get(height) {
            Ok(self.blk_files.read_block(index.n_file, index.n_data_pos)?)
        } else {
            Err(OpError::from("height not found"))
        }
    }

    ///
    /// Get a transaction by providing txid.
    ///
    /// This function requires `txindex` to be set to `true` for `BitcoinDB`,
    /// and requires that flag `txindex=1` has been enabled when
    /// running Bitcoin Core.
    ///
    /// A transaction cannot be found using this function if it is
    /// not yet indexed using `txindex`.
    ///
    pub fn get_transaction(&self, txid: &Txid) -> OpResult<Transaction> {
        if !self.tx_db.is_open() {
            return Err(OpError::from("TxDB not open"));
        }

        // give special treatment for genesis transaction
        if self.tx_db.is_genesis_tx(txid) {
            return Ok(self.get_block(0)?.txdata.swap_remove(0));
        }

        let record = self.tx_db.get_tx_record(txid)?;

        self.blk_files
            .read_transaction(record.n_file, record.n_pos, record.n_tx_offset)
    }

    ///
    /// Iterate through all blocks from `start` to `end` (excluded).
    ///
    /// # Performance
    ///
    /// This iterator is implemented to read the blocks in concurrency,
    /// but the result is still produced in sequential order.
    /// Results read are stored in a synced queue for `next()`
    /// to get.
    ///
    /// The iterator stops automatically when a block cannot be
    /// read (i.e., when the max height in the database met).
    ///
    /// This is a very efficient implementation.
    /// Using SSD and intel core i7 (4 core, 8 threads)
    /// Iterating from height 0 to 700000 takes about 10 minutes.
    ///
    pub fn iter_block(&self, start: usize, end: usize) -> BlockIter {
        BlockIter::from_range(self, start, end)
    }

    pub fn check_if_txout_value_is_zero(&self, txid: &Txid, vout: usize) -> bool {
        self.get_transaction(txid)
            .unwrap()
            .output
            .get(vout)
            .unwrap()
            .to_owned()
            .value
            .to_sat()
            == 0
    }
}
