use allocative::Allocative;
use color_eyre::eyre::eyre;

#[derive(Debug, Default, Allocative)]
pub struct UTXOState {
    pub count: usize,
}

impl UTXOState {
    pub fn increment(&mut self, utxo_count: usize) {
        self.count += utxo_count;
    }

    pub fn decrement(&mut self, utxo_count: usize) -> color_eyre::Result<()> {
        if self.count < utxo_count {
            dbg!(self.count, utxo_count);

            return Err(eyre!("self.count smaller than utxo_count"));
        }

        self.count -= utxo_count;

        Ok(())
    }
}
