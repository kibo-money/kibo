use super::{Address, WAmount};

#[derive(Debug)]
pub struct PartialTxoutData {
    pub amount: WAmount,
    pub address: Option<Address>,
    pub address_index_opt: Option<u32>,
}

impl PartialTxoutData {
    pub fn new(address: Option<Address>, amount: WAmount, address_index_opt: Option<u32>) -> Self {
        Self {
            address,
            amount,
            address_index_opt,
        }
    }
}
