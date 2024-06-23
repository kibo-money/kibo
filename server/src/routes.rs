use std::collections::{BTreeMap, HashMap};

use derive_deref::{Deref, DerefMut};
use itertools::Itertools;
use parser::{Json, Serialization};

use crate::{paths::Paths, Grouped};

#[derive(Clone, Debug)]
pub struct Route {
    pub url_path: String,
    pub file_path: String,
    pub values_type: String,
    pub serialization: Serialization,
}

#[derive(Clone, Default, Deref, DerefMut)]
pub struct Routes(pub Grouped<HashMap<String, Route>>);

const DATASETS_PATH: &str = "../datasets_bkp";

impl Routes {
    pub fn build() -> Self {
        let path_to_type: BTreeMap<String, String> =
            Json::import(&format!("{DATASETS_PATH}/disk_path_to_type.json")).unwrap();

        let mut routes = Routes::default();

        path_to_type.into_iter().for_each(|(key, value)| {
            let mut split_key = key.split('/').collect_vec();

            let mut split_last = split_key.pop().unwrap().split('.').rev().collect_vec();
            let last = split_last.pop().unwrap().to_owned();
            let serialization = split_last.pop().map_or_else(
                || {
                    if *split_key.get(1).unwrap() == "price" {
                        Serialization::Json
                    } else {
                        Serialization::Binary
                    }
                },
                Serialization::from_extension,
            );
            let split_key = split_key.iter().skip(2).collect_vec();
            let map_key = split_key.iter().join("_");
            let url_path = split_key.iter().join("-");

            let file_path = key.to_owned();
            let values_type = value.to_owned();

            if last == "date" {
                routes.date.insert(
                    map_key,
                    Route {
                        url_path: format!("/date-to-{url_path}"),
                        file_path,
                        values_type,
                        serialization,
                    },
                );
            } else if last == "height" {
                routes.height.insert(
                    map_key,
                    Route {
                        url_path: format!("/height-to-{url_path}"),
                        file_path,
                        values_type,
                        serialization,
                    },
                );
            } else if last == "last" {
                routes.last.insert(
                    map_key,
                    Route {
                        url_path: format!("/{url_path}"),
                        file_path,
                        values_type,
                        serialization,
                    },
                );
            } else {
                dbg!(&key, value, &last);
                panic!("")
            }
        });

        routes
    }

    pub fn generate_grouped_keys_to_url_path_file(&self) {
        let transform = |map: &HashMap<String, Route>| -> BTreeMap<String, String> {
            map.iter()
                .map(|(key, route)| (key.to_owned(), route.url_path.to_owned()))
                .collect()
        };

        let date_paths = transform(&self.date);
        let height_paths = transform(&self.height);
        let last_paths = transform(&self.last);

        let paths = Paths(Grouped {
            date: date_paths,
            height: height_paths,
            last: last_paths,
        });

        let _ = Json::export(
            &format!("{DATASETS_PATH}/grouped_keys_to_url_path.json"),
            &paths,
        );
    }

    pub fn to_full_paths(&self, host: String) -> Paths {
        let url = {
            let scheme = if host.contains("0.0.0.0") || host.contains("localhost") {
                "http"
            } else {
                "https"
            };

            format!("{scheme}://{host}")
        };

        let transform = |map: &HashMap<String, Route>| -> BTreeMap<String, String> {
            map.iter()
                .map(|(key, route)| {
                    (
                        key.to_owned(),
                        format!("{url}{}", route.url_path.to_owned()),
                    )
                })
                .collect()
        };

        let date_paths = transform(&self.date);
        let height_paths = transform(&self.height);
        let last_paths = transform(&self.last);

        Paths(Grouped {
            date: date_paths,
            height: height_paths,
            last: last_paths,
        })
    }
}
