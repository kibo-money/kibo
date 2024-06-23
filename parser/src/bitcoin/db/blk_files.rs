use std::{
    collections::HashMap,
    convert::From,
    fs::{self, DirEntry, File},
    io::{self, BufReader, Seek, SeekFrom},
    path::{Path, PathBuf},
};

use bitcoin::{io::Cursor, Block, Transaction};
use derive_deref::{Deref, DerefMut};

use super::{
    errors::{OpError, OpErrorKind, OpResult},
    reader::BlockchainRead,
};

///
/// An index of all blk files found.
///
#[derive(Debug, Clone, Deref, DerefMut)]
pub struct BlkFiles(HashMap<i32, PathBuf>);

impl BlkFiles {
    ///
    /// Construct an index of all blk files.
    ///
    pub fn new(path: &Path) -> OpResult<Self> {
        Ok(Self(Self::scan_path(path)?))
    }

    ///
    /// Read a Block from blk file.
    ///
    #[inline]
    pub fn read_raw_block(&self, n_file: i32, offset: u32) -> OpResult<Vec<u8>> {
        if let Some(blk_path) = self.get(&n_file) {
            let mut r = BufReader::new(File::open(blk_path)?);
            r.seek(SeekFrom::Start(offset as u64 - 4))?;
            let block_size = r.read_u32()?;
            let block = r.read_u8_vec(block_size)?;
            Ok(block)
        } else {
            Err(OpError::from("blk file not found, sync with bitcoin core"))
        }
    }

    ///
    /// Read a Block from blk file.
    ///
    pub fn read_block(&self, n_file: i32, offset: u32) -> OpResult<Block> {
        Cursor::new(self.read_raw_block(n_file, offset)?).read_block()
    }

    ///
    /// Read a transaction from blk file.
    ///
    pub fn read_transaction(
        &self,
        n_file: i32,
        n_pos: u32,
        n_tx_offset: u32,
    ) -> OpResult<Transaction> {
        if let Some(blk_path) = self.get(&n_file) {
            let mut r = BufReader::new(File::open(blk_path)?);
            // the size of a header is 80.
            r.seek(SeekFrom::Start(n_pos as u64 + n_tx_offset as u64 + 80))?;
            r.read_transaction()
        } else {
            Err(OpError::from("blk file not found, sync with bitcoin core"))
        }
    }

    ///
    /// Scan blk folder to build an index of all blk files.
    ///
    fn scan_path(path: &Path) -> OpResult<HashMap<i32, PathBuf>> {
        let mut collected = HashMap::with_capacity(4000);

        for entry in fs::read_dir(path)? {
            match entry {
                Ok(de) => {
                    let path = Self::resolve_path(&de)?;
                    if !path.is_file() {
                        continue;
                    };
                    if let Some(file_name) = path.as_path().file_name() {
                        if let Some(file_name) = file_name.to_str() {
                            if let Some(index) = Self::parse_blk_index(file_name) {
                                collected.insert(index, path);
                            }
                        }
                    }
                }
                Err(msg) => {
                    return Err(OpError::from(msg));
                }
            }
        }

        collected.shrink_to_fit();

        if collected.is_empty() {
            Err(OpError::new(OpErrorKind::RuntimeError).join_msg("No blk files found!"))
        } else {
            Ok(collected)
        }
    }

    ///
    /// Resolve symlink.
    ///
    fn resolve_path(entry: &DirEntry) -> io::Result<PathBuf> {
        if entry.file_type()?.is_symlink() {
            fs::read_link(entry.path())
        } else {
            Ok(entry.path())
        }
    }

    ///
    /// Extract index from block file name.
    ///
    fn parse_blk_index(file_name: &str) -> Option<i32> {
        let prefix = "blk";
        let ext = ".dat";
        if file_name.starts_with(prefix) && file_name.ends_with(ext) {
            file_name[prefix.len()..(file_name.len() - ext.len())]
                .parse::<i32>()
                .ok()
        } else {
            None
        }
    }
}

// #[cfg(test)]
// mod tests {
//     use super::*;

//     #[test]
//     fn test_parse_blk_index() {
//         assert_eq!(0, BlkFiles::parse_blk_index("blk00000.dat").unwrap());
//         assert_eq!(6, BlkFiles::parse_blk_index("blk6.dat").unwrap());
//         assert_eq!(1202, BlkFiles::parse_blk_index("blk1202.dat").unwrap());
//         assert_eq!(
//             13412451,
//             BlkFiles::parse_blk_index("blk13412451.dat").unwrap()
//         );
//         assert!(BlkFiles::parse_blk_index("blkindex.dat").is_none());
//         assert!(BlkFiles::parse_blk_index("invalid.dat").is_none());
//     }
// }
