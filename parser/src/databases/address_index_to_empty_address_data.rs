use std::{
    collections::BTreeMap,
    mem,
    ops::{Deref, DerefMut},
};

use allocative::Allocative;
use rayon::prelude::*;

use crate::structs::{EmptyAddressData, WNaiveDate};

use super::{AnyDatabaseGroup, Metadata, SizedDatabase};

type Key = u32;
type Value = EmptyAddressData;
type Database = SizedDatabase<Key, Value>;

#[derive(Allocative)]
pub struct AddressIndexToEmptyAddressData {
    pub metadata: Metadata,

    map: BTreeMap<usize, Database>,
}

impl Deref for AddressIndexToEmptyAddressData {
    type Target = BTreeMap<usize, Database>;

    fn deref(&self) -> &Self::Target {
        &self.map
    }
}

impl DerefMut for AddressIndexToEmptyAddressData {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.map
    }
}

const DB_MAX_SIZE: usize = 500_000;

impl AddressIndexToEmptyAddressData {
    pub fn unsafe_insert(&mut self, key: Key, value: Value) -> Option<Value> {
        self.metadata.called_insert();

        self.open_db(&key).unsafe_insert(key, value)
    }

    // pub fn undo_insert(&mut self, key: &Key) -> Option<Value> {
    //     self.metadata.called_remove();

    //     self.open_db(key).remove_from_puts(key)
    // }

    pub fn remove(&mut self, key: &Key) -> Option<Value> {
        self.metadata.called_remove();

        self.open_db(key).remove(key)
    }

    /// Doesn't check if the database is open contrary to `safe_get` which does and opens if needed
    /// Though it makes it easy to use with rayon.
    pub fn unsafe_get_from_cache(&self, key: &Key) -> Option<&Value> {
        let db_index = Self::db_index(key);

        self.get(&db_index).and_then(|db| db.get_from_puts(key))
    }

    pub fn unsafe_get_from_db(&self, key: &Key) -> Option<&Value> {
        let db_index = Self::db_index(key);

        self.get(&db_index)
            .unwrap_or_else(|| {
                dbg!(&self.map.keys(), &key, &db_index);
                panic!()
            })
            .db_get(key)
    }

    pub fn open_db(&mut self, key: &Key) -> &mut Database {
        let db_index = Self::db_index(key);

        self.entry(db_index).or_insert_with(|| {
            let db_name = format!(
                "{}..{}",
                db_index * DB_MAX_SIZE,
                (db_index + 1) * DB_MAX_SIZE
            );

            SizedDatabase::open(Self::folder(), &db_name, |key| key).unwrap()
        })
    }

    fn db_index(key: &Key) -> usize {
        *key as usize / DB_MAX_SIZE
    }
}

impl AnyDatabaseGroup for AddressIndexToEmptyAddressData {
    fn import() -> Self {
        Self {
            map: BTreeMap::default(),
            metadata: Metadata::import(&Self::full_path()),
        }
    }

    fn export(&mut self, height: usize, date: WNaiveDate) -> color_eyre::Result<()> {
        mem::take(&mut self.map)
            .into_par_iter()
            .try_for_each(|(_, db)| db.export())?;

        self.metadata.export(height, date)?;

        Ok(())
    }

    fn reset_metadata(&mut self) {
        self.metadata.reset();
    }

    fn folder<'a>() -> &'a str {
        "address_index_to_empty_address_data"
    }
}
