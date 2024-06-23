use std::{
    collections::BTreeMap,
    fs, mem,
    ops::{Deref, DerefMut},
};

use allocative::Allocative;
use rayon::prelude::*;

use crate::{
    structs::{AddressData, WNaiveDate},
    utils::time,
};

use super::{databases_folder_path, AnyDatabaseGroup, Metadata, SizedDatabase};

type Key = u32;
type Value = AddressData;
type Database = SizedDatabase<Key, Value>;

#[derive(Allocative)]
pub struct AddressIndexToAddressData {
    pub metadata: Metadata,

    map: BTreeMap<usize, Database>,
}

impl Deref for AddressIndexToAddressData {
    type Target = BTreeMap<usize, Database>;

    fn deref(&self) -> &Self::Target {
        &self.map
    }
}

impl DerefMut for AddressIndexToAddressData {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.map
    }
}

const DB_MAX_SIZE: usize = 500_000;

impl AddressIndexToAddressData {
    pub fn unsafe_insert(&mut self, key: Key, value: Value) -> Option<Value> {
        self.metadata.called_insert();

        self.open_db(&key).unsafe_insert(key, value)
    }

    pub fn remove(&mut self, key: &Key) -> Option<Value> {
        self.metadata.called_remove();

        self.open_db(key).remove(key)
    }

    /// Doesn't check if the database is open contrary to `safe_get` which does and opens if needed
    /// Though it makes it easy to use with rayon.
    pub fn unsafe_get_from_cache(&self, key: &Key) -> Option<&Value> {
        let db_index = Self::db_index(key);

        self.get(&db_index).unwrap().get_from_puts(key)
    }

    pub fn unsafe_get_from_db(&self, key: &Key) -> Option<&Value> {
        let db_index = Self::db_index(key);

        self.get(&db_index).unwrap().db_get(key)
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

    pub fn iter<F>(&mut self, callback: &mut F)
    where
        F: FnMut((&Key, &Value)),
    {
        time("Iter through address_index_to_address_data", || {
            self.open_all();

            // MUST CLEAR MAP, otherwise some weird shit in happening later in the export I think
            mem::take(&mut self.map)
                .values()
                .for_each(|database| database.iter(callback));
        });
    }

    fn open_all(&mut self) {
        fs::read_dir(databases_folder_path(Self::folder()))
            .unwrap()
            .map(|entry| {
                entry
                    .unwrap()
                    .path()
                    .file_name()
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .to_owned()
            })
            .filter(|file_name| file_name.contains(".."))
            .for_each(|path| {
                self.open_db(&path.split("..").next().unwrap().parse::<u32>().unwrap());
            });
    }

    fn db_index(key: &Key) -> usize {
        *key as usize / DB_MAX_SIZE
    }
}

impl AnyDatabaseGroup for AddressIndexToAddressData {
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

        self.metadata.export(height, date).unwrap();

        Ok(())
    }

    fn reset_metadata(&mut self) {
        self.metadata.reset();
    }

    fn folder<'a>() -> &'a str {
        "address_index_to_address_data"
    }
}
