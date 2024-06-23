use crate::structs::WAmount;

#[derive(Debug, Default)]
pub struct InputState {
    pub count: f64,
    pub volume: WAmount,
}

impl InputState {
    pub fn iterate(&mut self, count: f64, volume: WAmount) {
        self.count += count;
        self.volume += volume;
    }
}
