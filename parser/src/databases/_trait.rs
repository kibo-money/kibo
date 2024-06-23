use std::{fs, io};

use crate::{structs::WNaiveDate, utils::log};

use super::databases_folder_path;

pub trait AnyDatabaseGroup
where
    Self: Sized,
{
    fn import() -> Self;

    fn export(&mut self, height: usize, date: WNaiveDate) -> color_eyre::Result<()>;

    fn folder<'a>() -> &'a str;

    fn reset(&mut self) -> color_eyre::Result<(), io::Error> {
        log(&format!("Reset {}", Self::folder()));

        self.reset_metadata();

        fs::remove_dir_all(Self::full_path())?;

        Ok(())
    }

    fn full_path() -> String {
        databases_folder_path(Self::folder())
    }

    fn reset_metadata(&mut self);
}
