//!
//! View development note of iter_connected.rs for implementation
//! details of iter_block.rs, which follows similar principles.
//!
use bitcoin::Block;
use par_iter_sync::{IntoParallelIteratorSync, ParIterSync};

use super::BitcoinDB;

pub struct BlockIter(ParIterSync<Block>);

impl BlockIter {
    /// the worker threads are dispatched in this `new` constructor!
    pub fn new<T>(db: &BitcoinDB, heights: T) -> Self
    where
        T: IntoIterator<Item = usize> + Send + 'static,
        <T as IntoIterator>::IntoIter: Send + 'static,
    {
        let db_ref = db.clone();

        BlockIter(
            heights.into_par_iter_sync(move |h| match db_ref.get_block(h) {
                Ok(blk) => Ok(blk),
                Err(_) => Err(()),
            }),
        )
    }

    /// the worker threads are dispatched in this `new` constructor!
    pub fn from_range(db: &BitcoinDB, start: usize, end: usize) -> Self {
        if end <= start {
            BlockIter::new(db, Vec::new())
        } else {
            BlockIter::new(db, start..end)
        }
    }
}

impl Iterator for BlockIter {
    type Item = Block;

    fn next(&mut self) -> Option<Self::Item> {
        self.0.next()
    }
}
