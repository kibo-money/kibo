use std::{
    cmp::Ordering,
    collections::{BTreeMap, BTreeSet},
    fs::{self, File},
    io::{BufReader, BufWriter},
    path::{Path, PathBuf},
};

use derived_deref::{Deref, DerefMut};

use crate::{blk_recap::BlkRecap, BlkMetadataAndBlock};

const TARGET_BLOCKS_PER_MONTH: usize = 144 * 30;

#[derive(Deref, DerefMut, Debug)]
pub struct BlkIndexToBlkRecap {
    path: PathBuf,
    #[target]
    tree: BTreeMap<usize, BlkRecap>,
    last_safe_height: Option<usize>,
}

impl BlkIndexToBlkRecap {
    pub fn import(blocks_dir: &BTreeMap<usize, PathBuf>, data_dir: &Path) -> Self {
        let path = data_dir.join("blk_index_to_blk_recap.json");

        let tree = {
            fs::create_dir_all(data_dir).unwrap();

            if let Ok(file) = File::open(&path) {
                let reader = BufReader::new(file);
                serde_json::from_reader(reader).unwrap_or_default()
            } else {
                BTreeMap::default()
            }
        };

        let mut this = Self {
            path,
            tree,
            last_safe_height: None,
        };

        this.clean_outdated(blocks_dir);

        this
    }

    pub fn clean_outdated(&mut self, blocks_dir: &BTreeMap<usize, PathBuf>) {
        let mut unprocessed_keys = self.keys().copied().collect::<BTreeSet<_>>();

        blocks_dir.iter().for_each(|(blk_index, blk_path)| {
            unprocessed_keys.remove(blk_index);
            if let Some(blk_recap) = self.get(blk_index) {
                if blk_recap.has_different_modified_time(blk_path) {
                    self.remove(blk_index);
                }
            }
        });

        unprocessed_keys.into_iter().for_each(|blk_index| {
            self.remove(&blk_index);
        });

        self.last_safe_height = self.iter().map(|(_, recap)| recap.height()).max();
    }

    pub fn get_start_recap(&self, start: Option<usize>) -> Option<(usize, BlkRecap)> {
        if let Some(start) = start {
            let (last_key, last_value) = self.last_key_value()?;

            if last_value.height() < start {
                return Some((*last_key, *last_value));
            } else if let Some((blk_index, _)) = self
                .iter()
                .find(|(_, blk_recap)| blk_recap.is_younger_than(start))
            {
                if *blk_index != 0 {
                    let blk_index = *blk_index - 1;
                    return Some((blk_index, *self.get(&blk_index).unwrap()));
                }
            }
        }

        None
    }

    pub fn update(&mut self, blk_metadata_and_block: &BlkMetadataAndBlock, height: usize) {
        let blk_index = blk_metadata_and_block.blk_metadata.index;

        if let Some(last_entry) = self.last_entry() {
            match last_entry.key().cmp(&blk_index) {
                Ordering::Greater => {
                    last_entry.remove_entry();
                }
                Ordering::Less => {
                    self.insert(blk_index, BlkRecap::from(height, blk_metadata_and_block));
                }
                Ordering::Equal => {}
            };
        } else {
            if blk_index != 0 || height != 0 {
                // dbg!(blk_index, height);
                unreachable!();
            }

            self.insert(blk_index, BlkRecap::first(blk_metadata_and_block));
        }

        if self
            .last_safe_height
            .map_or(true, |safe_height| height >= safe_height)
            && (height % TARGET_BLOCKS_PER_MONTH) == 0
        {
            self.export();
        }
    }

    pub fn export(&self) {
        let file = File::create(&self.path).unwrap_or_else(|_| {
            dbg!(&self.path);
            panic!("No such file or directory")
        });

        serde_json::to_writer_pretty(&mut BufWriter::new(file), &self.tree).unwrap();
    }
}
