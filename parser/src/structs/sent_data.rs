use super::WAmount;

#[derive(Default, Debug)]
pub struct SentData {
    pub volume: WAmount,
    pub count: u32,
}

impl SentData {
    pub fn send(&mut self, amount: WAmount) {
        self.volume += amount;
        self.count += 1;
    }
}
