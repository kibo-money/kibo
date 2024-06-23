use crate::structs::WAmount;

#[derive(Debug, Default)]
pub struct OutputState {
    pub count: f64,
    pub volume: WAmount,
}

impl OutputState {
    pub fn iterate(&mut self, count: f64, volume: WAmount) {
        self.count += count;
        self.volume += volume;
    }
}
