pub enum UTXOFilter {
    To(u32),
    FromTo { from: u32, to: u32 },
    From(u32),
    Year(u32),
}

impl UTXOCheck for UTXOFilter {
    fn check(&self, days_old: &u32, year: &u32) -> bool {
        match self {
            UTXOFilter::From(from) => from <= days_old,
            UTXOFilter::To(to) => to > days_old,
            UTXOFilter::FromTo { from, to } => from <= days_old && to > days_old,
            UTXOFilter::Year(_year) => _year == year,
        }
    }

    fn check_days_old(&self, days_old: &u32) -> bool {
        match self {
            UTXOFilter::From(from) => from <= days_old,
            UTXOFilter::To(to) => to > days_old,
            UTXOFilter::FromTo { from, to } => from <= days_old && to > days_old,
            UTXOFilter::Year(_) => unreachable!(),
        }
    }
}

pub trait UTXOCheck {
    fn check(&self, days_old: &u32, year: &u32) -> bool;

    fn check_days_old(&self, days_old: &u32) -> bool;
}
