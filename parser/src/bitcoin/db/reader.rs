use std::{fs::File, io::BufReader};

use bitcoin::{block::Header, consensus::Decodable, io::Cursor, Block, Transaction};
use byteorder::{LittleEndian, ReadBytesExt};

use super::OpResult;

///
/// binary file read utilities.
///
pub trait BlockchainRead {
    #[inline]
    fn read_varint(&mut self) -> OpResult<usize>
    where
        Self: bitcoin::io::Read,
    {
        let mut n = 0;
        loop {
            let ch_data = self.read_u8()?;
            n = (n << 7) | (ch_data & 0x7F) as usize;
            if ch_data & 0x80 > 0 {
                n += 1;
            } else {
                break;
            }
        }
        Ok(n)
    }

    #[inline]
    fn read_u8(&mut self) -> OpResult<u8>
    where
        Self: bitcoin::io::Read,
    {
        let mut slice = [0u8; 1];

        self.read_exact(&mut slice).unwrap();

        Ok(slice[0])
    }

    #[inline]
    fn read_u32(&mut self) -> OpResult<u32>
    where
        Self: std::io::Read,
    {
        let u = ReadBytesExt::read_u32::<LittleEndian>(self)?;

        Ok(u)
    }

    #[inline]
    fn read_u8_vec(&mut self, count: u32) -> OpResult<Vec<u8>>
    where
        Self: bitcoin::io::Read,
    {
        let mut arr = vec![0u8; count as usize];

        self.read_exact(&mut arr).unwrap();

        Ok(arr)
    }

    #[inline]
    fn read_block(&mut self) -> OpResult<Block>
    where
        Self: bitcoin::io::BufRead,
    {
        Ok(Block::consensus_decode(self)?)
    }

    #[inline]
    fn read_transaction(&mut self) -> OpResult<Transaction>
    where
        Self: bitcoin::io::BufRead,
    {
        Ok(Transaction::consensus_decode(self)?)
    }

    #[inline]
    fn read_block_header(&mut self) -> OpResult<Header>
    where
        Self: bitcoin::io::BufRead,
    {
        Ok(Header::consensus_decode(self)?)
    }
}

impl<T> BlockchainRead for Cursor<T> {}
impl BlockchainRead for BufReader<File> {}
