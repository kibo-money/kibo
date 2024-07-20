use crate::structs::Amount;

#[derive(Debug, Default)]
pub struct OutputState {
    pub count: f64,
    pub volume: Amount,
}

impl OutputState {
    pub fn iterate(&mut self, count: f64, volume: Amount) {
        self.count += count;
        self.volume += volume;
    }
}
