use std::{
    collections::{BTreeMap, BTreeSet},
    fmt::Debug,
    fs,
};

use allocative::Allocative;
use derive_deref::{Deref, DerefMut};

// https://docs.rs/sanakirja/latest/sanakirja/index.html
// https://pijul.org/posts/2021-02-06-rethinking-sanakirja/
//
// Seems indeed much faster than ReDB and LMDB (heed)
// But a lot has changed code wise between them so a retest wouldn't hurt
//
// Possible compression: https://pijul.org/posts/sanakirja-zstd/
use sanakirja::{
    btree::{self, page, page_unsized, BTreeMutPage, Db_},
    direct_repr, Commit, Env, Error, MutTxn, RootDb, Storable, UnsizedStorable,
};

use crate::io::OUTPUTS_FOLDER_PATH;

pub type SizedDatabase<Key, Value> = Database<Key, Key, Value, page::Page<Key, Value>>;

pub type UnsizedDatabase<KeyTree, KeyDB, Value> =
    Database<KeyTree, KeyDB, Value, page_unsized::Page<KeyDB, Value>>;

#[derive(Allocative)]
#[allocative(bound = "KeyTree: Allocative, KeyDB, Value: Allocative, Page")]
/// There is no `cached_gets` since it's much cheaper and faster to do a parallel search first using `unsafe_get` than caching gets along the way.
pub struct Database<KeyTree, KeyDB, Value, Page>
where
    KeyTree: Ord + Clone + Debug,
    KeyDB: Ord + ?Sized + Storable,
    Value: Storable + PartialEq,
    Page: BTreeMutPage<KeyDB, Value>,
{
    pub cached_puts: BTreeMap<KeyTree, Value>,
    pub cached_dels: BTreeSet<KeyTree>,
    #[allocative(skip)]
    db: Db_<KeyDB, Value, Page>,
    #[allocative(skip)]
    txn: MutTxn<Env, ()>,
    #[allocative(skip)]
    key_tree_to_key_db: fn(&KeyTree) -> &KeyDB,
}

pub const SANAKIRJA_MAX_KEY_SIZE: usize = 510;
const ROOT_DB: usize = 0;
const PAGE_SIZE: u64 = 4096 * 256; // 1mo - Must be a multiplier of 4096

impl<KeyDB, KeyTree, Value, Page> Database<KeyTree, KeyDB, Value, Page>
where
    KeyTree: Ord + Clone + Debug,
    KeyDB: Ord + ?Sized + Storable,
    Value: Storable + PartialEq,
    Page: BTreeMutPage<KeyDB, Value>,
{
    pub fn open(
        folder: &str,
        file: &str,
        key_tree_to_key_db: fn(&KeyTree) -> &KeyDB,
    ) -> color_eyre::Result<Self> {
        let mut txn = Self::init_txn(folder, file)?;

        let db = txn
            .root_db(ROOT_DB)
            .unwrap_or_else(|| unsafe { btree::create_db_(&mut txn).unwrap() });

        Ok(Self {
            cached_puts: BTreeMap::default(),
            cached_dels: BTreeSet::default(),
            db,
            txn,
            key_tree_to_key_db,
        })
    }

    pub fn iter<F>(&self, callback: &mut F)
    where
        F: FnMut((&KeyDB, &Value)),
    {
        btree::iter(&self.txn, &self.db, None)
            .unwrap()
            .for_each(|entry| callback(entry.unwrap()));
    }

    pub fn get(&self, key: &KeyTree) -> Option<&Value> {
        if let Some(cached_put) = self.get_from_puts(key) {
            return Some(cached_put);
        }

        self.db_get(key)
    }

    pub fn db_get(&self, key: &KeyTree) -> Option<&Value> {
        let k = (self.key_tree_to_key_db)(key);

        let option = btree::get(&self.txn, &self.db, k, None).unwrap();

        if let Some((k_found, v)) = option {
            if k == k_found {
                return Some(v);
            }
        }

        None
    }

    #[inline(always)]
    pub fn get_from_puts(&self, key: &KeyTree) -> Option<&Value> {
        self.cached_puts.get(key)
    }

    #[inline(always)]
    pub fn get_mut_from_puts(&mut self, key: &KeyTree) -> Option<&mut Value> {
        self.cached_puts.get_mut(key)
    }

    #[inline(always)]
    pub fn remove(&mut self, key: &KeyTree) -> Option<Value> {
        self.remove_from_puts(key).or_else(|| {
            self.db_remove(key);

            None
        })
    }

    #[inline(always)]
    pub fn db_remove(&mut self, key: &KeyTree) {
        self.cached_dels.insert(key.clone());
    }

    pub fn update(&mut self, key: KeyTree, value: Value) -> Option<Value> {
        self.cached_dels.insert(key.clone());

        self.cached_puts.insert(key, value)
    }

    #[inline(always)]
    pub fn remove_from_puts(&mut self, key: &KeyTree) -> Option<Value> {
        self.cached_puts.remove(key)
    }

    #[inline(always)]
    pub fn insert(&mut self, key: KeyTree, value: Value) -> Option<Value> {
        self.cached_dels.remove(&key);

        self.unsafe_insert(key, value)
    }

    #[inline(always)]
    pub fn unsafe_insert(&mut self, key: KeyTree, value: Value) -> Option<Value> {
        self.cached_puts.insert(key, value)
    }

    fn init_txn(folder: &str, file: &str) -> color_eyre::Result<MutTxn<Env, ()>> {
        let path = databases_folder_path(folder);

        fs::create_dir_all(&path)?;

        let env = unsafe { Env::new_nolock(format!("{path}/{file}"), PAGE_SIZE, 1).unwrap() };

        let txn = Env::mut_txn_begin(env)?;

        Ok(txn)
    }

    pub fn export(mut self) -> color_eyre::Result<(), Error> {
        if self.cached_dels.is_empty() && self.cached_puts.is_empty() {
            return Ok(());
        }

        self.cached_dels
            .into_iter()
            .try_for_each(|key| -> Result<(), Error> {
                btree::del(
                    &mut self.txn,
                    &mut self.db,
                    (self.key_tree_to_key_db)(&key),
                    None,
                )?;

                Ok(())
            })?;

        self.cached_puts
            .into_iter()
            .try_for_each(|(key, value)| -> Result<(), Error> {
                btree::put(
                    &mut self.txn,
                    &mut self.db,
                    (self.key_tree_to_key_db)(&key),
                    &value,
                )?;

                Ok(())
            })?;

        self.txn.set_root(ROOT_DB, self.db.db.into());

        self.txn.commit()
    }
}

#[derive(
    Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Deref, DerefMut, Default, Copy, Allocative,
)]
pub struct U8x19([u8; 19]);
direct_repr!(U8x19);
impl From<&[u8]> for U8x19 {
    fn from(slice: &[u8]) -> Self {
        let mut arr = Self::default();
        arr.copy_from_slice(slice);
        arr
    }
}

#[derive(
    Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Deref, DerefMut, Default, Copy, Allocative,
)]
pub struct U8x31([u8; 31]);
direct_repr!(U8x31);
impl From<&[u8]> for U8x31 {
    fn from(slice: &[u8]) -> Self {
        let mut arr = Self::default();
        arr.copy_from_slice(slice);
        arr
    }
}

pub fn databases_folder_path(folder: &str) -> String {
    format!("{OUTPUTS_FOLDER_PATH}/databases/{folder}")
}
