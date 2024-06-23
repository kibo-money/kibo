use std::thread;

use crate::{
    databases::Databases,
    datasets::AllDatasets,
    states::States,
    structs::WNaiveDate,
    utils::{log, time},
};

pub struct ExportedData<'a> {
    pub databases: Option<&'a mut Databases>,
    pub datasets: &'a mut AllDatasets,
    pub date: WNaiveDate,
    pub height: usize,
    pub states: Option<&'a States>,
}

pub fn export(
    ExportedData {
        databases,
        datasets,
        states,
        height,
        date,
    }: ExportedData,
) -> color_eyre::Result<()> {
    log("Exporting... (Don't close !!)");

    time("Total save time", || -> color_eyre::Result<()> {
        time("Datasets saved", || datasets.export())?;

        thread::scope(|s| {
            if let Some(databases) = databases {
                s.spawn(|| time("Databases saved", || databases.export(height, date)));
            }

            if let Some(states) = states {
                s.spawn(|| time("States saved", || states.export()));
            }
        });

        Ok(())
    })?;

    Ok(())
}
