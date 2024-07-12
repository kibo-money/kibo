use std::{
    collections::{BTreeMap, HashMap},
    fs,
};

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

const DATASETS_PATH: &str = "../datasets";

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

    pub fn generate_front_end_files(&self) {
        self.generate_json_group_files();
        self.generate_definition_files();
    }

    fn generate_json_group_files(&self) {
        let map_to_group = |map: &HashMap<String, Route>| -> BTreeMap<String, String> {
            map.iter()
                .map(|(key, route)| (key.to_owned(), route.url_path.to_owned()))
                .collect()
        };

        let date_group = map_to_group(&self.date);
        let height_group = map_to_group(&self.height);
        let last_group = map_to_group(&self.last);

        let groups = Paths(Grouped {
            date: date_group,
            height: height_group,
            last: last_group,
        });

        let _ = Json::export(
            &format!("{DATASETS_PATH}/grouped_keys_to_url_path.json"),
            &groups,
        );
    }

    fn generate_definition_files(&self) {
        let map_to_type = |name: &str, map: &HashMap<String, Route>| -> String {
            let paths = map
                .values()
                .map(|route| format!("\"{}\"", route.url_path))
                .join(" | ");

            format!("export type {}Path = {};\n", name, paths)
        };

        let date_type = map_to_type("Date", &self.date);

        let height_type = map_to_type("Height", &self.height);

        let last_type = map_to_type("Last", &self.last);

        fs::write(
            format!("{DATASETS_PATH}/paths.d.ts"),
            format!("{date_type}\n{height_type}\n{last_type}"),
        )
        .unwrap();
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
