use std::{collections::BTreeSet, time::Instant};

use chrono::Datelike;
use export::ExportedData;
use itertools::Itertools;

use parse::ParseData;

use crate::{
    actions::{export, find_first_inserted_unsafe_height, parse},
    bitcoin::{check_if_height_safe, BitcoinDB, NUMBER_OF_UNSAFE_BLOCKS},
    databases::Databases,
    datasets::{AllDatasets, ComputeData},
    states::{AddressCohortsDurableStates, States, UTXOCohortsDurableStates},
    structs::{DateData, WNaiveDate},
    utils::{generate_allocation_files, log, time},
};

pub fn iter_blocks(bitcoin_db: &BitcoinDB, block_count: usize) -> color_eyre::Result<()> {
    let should_insert = true;
    let should_export = true;
    let study_ram_usage = false;

    log("Starting...");

    let mut datasets = AllDatasets::import()?;
    // RAM: 200MB at this point

    log("Imported datasets");

    let mut databases = Databases::import();
    // RAM: 200MB too

    log("Imported databases");

    let mut states = States::import().unwrap_or_default();

    log("Imported states");

    let first_unsafe_heights =
        find_first_inserted_unsafe_height(&mut states, &mut databases, &mut datasets);

    let mut height = first_unsafe_heights.min();

    log(&format!("Starting parsing at height: {height}"));

    let mut block_iter = bitcoin_db.iter_block(height, block_count);

    let mut next_block_opt = None;
    let mut blocks_loop_date = None;

    'parsing: loop {
        let instant = Instant::now();

        let mut processed_heights = BTreeSet::new();
        let mut processed_dates = BTreeSet::new();

        'days: loop {
            let mut blocks_loop_i = 0;

            if next_block_opt.is_some() {
                blocks_loop_date.take();
            }

            'blocks: loop {
                let current_block_opt = next_block_opt.take().or_else(|| block_iter.next());

                next_block_opt = block_iter.next();

                if let Some(current_block) = current_block_opt {
                    let timestamp = current_block.header.time;

                    let current_block_date = WNaiveDate::from_timestamp(timestamp);
                    let current_block_height = height + blocks_loop_i;

                    if states.address_cohorts_durable_states.is_none()
                        && datasets
                            .address
                            .needs_durable_states(current_block_height, current_block_date)
                    {
                        states.address_cohorts_durable_states =
                            Some(AddressCohortsDurableStates::init(
                                &mut databases.address_index_to_address_data,
                            ));
                    }

                    if states.utxo_cohorts_durable_states.is_none()
                        && datasets
                            .utxo
                            .needs_durable_states(current_block_height, current_block_date)
                    {
                        states.utxo_cohorts_durable_states =
                            Some(UTXOCohortsDurableStates::init(&states.date_data_vec));
                    }

                    let next_block_date = next_block_opt
                        .as_ref()
                        .map(|next_block| WNaiveDate::from_timestamp(next_block.header.time));

                    // Always run for the first block of the loop
                    if blocks_loop_date.is_none() {
                        blocks_loop_date.replace(current_block_date);

                        if states
                            .date_data_vec
                            .last()
                            .map(|date_data| *date_data.date < *current_block_date)
                            .unwrap_or(true)
                        {
                            states
                                .date_data_vec
                                .push(DateData::new(current_block_date, vec![]));
                        }

                        log(&format!(
                            "Processing {current_block_date} (height: {height})..."
                        ));
                    }

                    let blocks_loop_date = blocks_loop_date.unwrap();

                    if current_block_date > blocks_loop_date {
                        panic!("current block should always have the same date as the current blocks loop");
                    }

                    let is_date_last_block = next_block_date
                        // Do NOT change `blocks_loop_date` to `current_block_date` !!!
                        .map_or(true, |next_block_date| blocks_loop_date < next_block_date);

                    processed_heights.insert(current_block_height);

                    if should_insert && first_unsafe_heights.inserted <= current_block_height {
                        let compute_addresses = databases.check_if_needs_to_compute_addresses(
                            current_block_height,
                            blocks_loop_date,
                        );

                        parse(ParseData {
                            bitcoin_db,
                            block: current_block,
                            block_index: blocks_loop_i,
                            compute_addresses,
                            databases: &mut databases,
                            datasets: &mut datasets,
                            date: blocks_loop_date,
                            first_date_height: height,
                            height: current_block_height,
                            is_date_last_block,
                            states: &mut states,
                            timestamp,
                        });
                    }

                    blocks_loop_i += 1;

                    if is_date_last_block {
                        processed_dates.insert(blocks_loop_date);

                        height += blocks_loop_i;

                        let is_new_month = next_block_date
                            .map_or(true, |next_block_date| next_block_date.day() == 1);

                        let is_close_to_the_end =
                            height > (block_count - (NUMBER_OF_UNSAFE_BLOCKS * 3));

                        if is_new_month || is_close_to_the_end {
                            break 'days;
                        }

                        break 'blocks;
                    }
                } else {
                    break 'parsing;
                }
            }
        }

        // Don't remember why -1
        let last_height = height - 1;

        log(&format!(
            "Parsing month took {} seconds (last height: {last_height})\n",
            instant.elapsed().as_secs_f32(),
        ));

        if first_unsafe_heights.computed <= last_height {
            time("Computing datasets", || {
                datasets.compute(ComputeData {
                    dates: &processed_dates.into_iter().collect_vec(),
                    heights: &processed_heights.into_iter().collect_vec(),
                })
            });
        }

        if should_export {
            let is_safe = check_if_height_safe(height, block_count);

            export(ExportedData {
                databases: is_safe.then_some(&mut databases),
                datasets: &mut datasets,
                date: blocks_loop_date.unwrap(),
                height: last_height,
                states: is_safe.then_some(&states),
            })?;

            if study_ram_usage {
                time("Exporing allocation files", || {
                    generate_allocation_files(&datasets, &databases, &states, last_height)
                })?;
            }
        } else {
            log("Skipping export");
        }

        println!();
    }

    Ok(())
}
