use crate::structs::Price;

#[derive(Debug, Default)]
pub struct RealizedState {
    pub realized_profit: Price,
    pub realized_loss: Price,
}

impl RealizedState {
    pub fn iterate(&mut self, realized_profit: Price, realized_loss: Price) {
        self.realized_profit += realized_profit;
        self.realized_loss += realized_loss;
    }
}
