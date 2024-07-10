use crate::structs::Price;

#[derive(Debug, Default)]
pub struct RealizedState {
    pub realized_profit: Price,
    pub realized_loss: Price,
    pub value_created: Price,
    pub value_destroyed: Price,
}

impl RealizedState {
    pub fn iterate(
        &mut self,
        realized_profit: Price,
        realized_loss: Price,
        value_created: Price,
        value_destroyed: Price,
    ) {
        self.realized_profit += realized_profit;
        self.realized_loss += realized_loss;
        self.value_created += value_created;
        self.value_destroyed += value_destroyed;
    }
}
