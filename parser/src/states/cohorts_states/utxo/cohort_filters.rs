use super::{SplitByUTXOCohort, UTXOFilter};

pub const UTXO_FILTERS: SplitByUTXOCohort<UTXOFilter> = SplitByUTXOCohort {
    up_to_1d: UTXOFilter::To(1),
    up_to_1w: UTXOFilter::To(7),
    up_to_1m: UTXOFilter::To(30),
    up_to_2m: UTXOFilter::To(2 * 30),
    up_to_3m: UTXOFilter::To(3 * 30),
    up_to_4m: UTXOFilter::To(4 * 30),
    up_to_5m: UTXOFilter::To(5 * 30),
    up_to_6m: UTXOFilter::To(6 * 30),
    up_to_1y: UTXOFilter::To(365),
    up_to_2y: UTXOFilter::To(2 * 365),
    up_to_3y: UTXOFilter::To(3 * 365),
    up_to_5y: UTXOFilter::To(5 * 365),
    up_to_7y: UTXOFilter::To(7 * 365),
    up_to_10y: UTXOFilter::To(10 * 365),
    up_to_15y: UTXOFilter::To(15 * 365),

    from_1d_to_1w: UTXOFilter::FromTo { from: 1, to: 7 },
    from_1w_to_1m: UTXOFilter::FromTo { from: 7, to: 30 },
    from_1m_to_3m: UTXOFilter::FromTo {
        from: 30,
        to: 3 * 30,
    },
    from_3m_to_6m: UTXOFilter::FromTo {
        from: 3 * 30,
        to: 6 * 30,
    },
    from_6m_to_1y: UTXOFilter::FromTo {
        from: 6 * 30,
        to: 365,
    },
    from_1y_to_2y: UTXOFilter::FromTo {
        from: 365,
        to: 2 * 365,
    },
    from_2y_to_3y: UTXOFilter::FromTo {
        from: 2 * 365,
        to: 3 * 365,
    },
    from_3y_to_5y: UTXOFilter::FromTo {
        from: 3 * 365,
        to: 5 * 365,
    },
    from_5y_to_7y: UTXOFilter::FromTo {
        from: 5 * 365,
        to: 7 * 365,
    },
    from_7y_to_10y: UTXOFilter::FromTo {
        from: 7 * 365,
        to: 10 * 365,
    },
    from_10y_to_15y: UTXOFilter::FromTo {
        from: 10 * 365,
        to: 15 * 365,
    },

    from_1y: UTXOFilter::From(365),
    from_2y: UTXOFilter::From(2 * 365),
    from_4y: UTXOFilter::From(4 * 365),
    from_10y: UTXOFilter::From(10 * 365),
    from_15y: UTXOFilter::From(15 * 365),

    year_2009: UTXOFilter::Year(2009),
    year_2010: UTXOFilter::Year(2010),
    year_2011: UTXOFilter::Year(2011),
    year_2012: UTXOFilter::Year(2012),
    year_2013: UTXOFilter::Year(2013),
    year_2014: UTXOFilter::Year(2014),
    year_2015: UTXOFilter::Year(2015),
    year_2016: UTXOFilter::Year(2016),
    year_2017: UTXOFilter::Year(2017),
    year_2018: UTXOFilter::Year(2018),
    year_2019: UTXOFilter::Year(2019),
    year_2020: UTXOFilter::Year(2020),
    year_2021: UTXOFilter::Year(2021),
    year_2022: UTXOFilter::Year(2022),
    year_2023: UTXOFilter::Year(2023),
    year_2024: UTXOFilter::Year(2024),

    sth: UTXOFilter::To(155),
    lth: UTXOFilter::From(155),
};
