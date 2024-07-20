use crate::structs::Amount;

#[derive(Debug, Default)]
pub struct InputState {
    pub count: f64,
    pub volume: Amount,
}

impl InputState {
    pub fn iterate(&mut self, count: f64, volume: Amount) {
        self.count += count;
        self.volume += volume;
    }
}
