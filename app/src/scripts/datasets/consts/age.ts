export const xthCohorts = [
  {
    key: "sth",
    name: "Short Term Holders",
    legend: "STH",
  },
  {
    key: "lth",
    name: "Long Term Holders",
    legend: "LTH",
  },
] as const;

export const upToCohorts = [
  { key: "up_to_1d", name: "Up To 1 Day", legend: "1D" },
  { key: "up_to_1w", name: "Up To 1 Week", legend: "1W" },
  { key: "up_to_1m", name: "Up To 1 Month", legend: "1M" },
  { key: "up_to_2m", name: "Up To 2 Months", legend: "2M" },
  { key: "up_to_3m", name: "Up To 3 Months", legend: "3M" },
  { key: "up_to_4m", name: "Up To 4 Months", legend: "4M" },
  { key: "up_to_5m", name: "Up To 5 Months", legend: "5M" },
  { key: "up_to_6m", name: "Up To 6 Months", legend: "6M" },
  { key: "up_to_1y", name: "Up To 1 Year", legend: "1Y" },
  { key: "up_to_2y", name: "Up To 2 Years", legend: "2Y" },
  { key: "up_to_3y", name: "Up To 3 Years", legend: "3Y" },
  { key: "up_to_5y", name: "Up To 5 Years", legend: "5Y" },
  { key: "up_to_7y", name: "Up To 7 Years", legend: "7Y" },
  { key: "up_to_10y", name: "Up To 10 Years", legend: "10Y" },
  { key: "up_to_15y", name: "Up To 15 Years", legend: "15Y" },
] as const;

export const fromXToYCohorts = [
  {
    key: "from_1d_to_1w",
    name: "From 1 Day To 1 Week",
    legend: "1D - 1W",
  },
  {
    key: "from_1w_to_1m",
    name: "From 1 Week To 1 Month",
    legend: "1W - 1M",
  },
  {
    key: "from_1m_to_3m",
    name: "From 1 Month To 3 Months",
    legend: "1M - 3M",
  },
  {
    key: "from_3m_to_6m",
    name: "From 3 Months To 6 Months",
    legend: "3M - 6M",
  },
  {
    key: "from_6m_to_1y",
    name: "From 6 Months To 1 Year",
    legend: "6M - 1Y",
  },
  {
    key: "from_1y_to_2y",
    name: "From 1 Year To 2 Years",
    legend: "1Y - 2Y",
  },
  {
    key: "from_2y_to_3y",
    name: "From 2 Years To 3 Years",
    legend: "2Y - 3Y",
  },
  {
    key: "from_3y_to_5y",
    name: "From 3 Years To 5 Years",
    legend: "3Y - 5Y",
  },
  {
    key: "from_5y_to_7y",
    name: "From 5 Years To 7 Years",
    legend: "5Y - 7Y",
  },
  {
    key: "from_7y_to_10y",
    name: "From 7 Years To 10 Years",
    legend: "7Y - 10Y",
  },
  {
    key: "from_10y_to_15y",
    name: "From 10 Years To 15 Years",
    legend: "10Y - 15Y",
  },
] as const;

export const fromXCohorts = [
  {
    key: "from_1y",
    name: "From 1 Year",
    legend: "1Y+",
  },
  {
    key: "from_2y",
    name: "From 2 Years",
    legend: "2Y+",
  },
  {
    key: "from_4y",
    name: "From 4 Years",
    legend: "4Y+",
  },
  {
    key: "from_10y",
    name: "From 10 Years",
    legend: "10Y+",
  },
  {
    key: "from_15y",
    name: "From 15 Years",
    legend: "15Y+",
  },
] as const;

export const yearCohorts = [
  { key: "year_2009", name: "2009" },
  { key: "year_2010", name: "2010" },
  { key: "year_2011", name: "2011" },
  { key: "year_2012", name: "2012" },
  { key: "year_2013", name: "2013" },
  { key: "year_2014", name: "2014" },
  { key: "year_2015", name: "2015" },
  { key: "year_2016", name: "2016" },
  { key: "year_2017", name: "2017" },
  { key: "year_2018", name: "2018" },
  { key: "year_2019", name: "2019" },
  { key: "year_2020", name: "2020" },
  { key: "year_2021", name: "2021" },
  { key: "year_2022", name: "2022" },
  { key: "year_2023", name: "2023" },
  { key: "year_2024", name: "2024" },
] as const;

export const ageCohorts = [
  {
    key: "",
    name: "",
  },
  ...xthCohorts,
  ...upToCohorts,
  ...fromXToYCohorts,
  ...fromXCohorts,
  ...yearCohorts,
] as const;
