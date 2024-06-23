use allocative::Allocative;

use super::{AddressSize, AddressType};

#[derive(Default, Allocative)]
pub enum AddressSplit {
    #[default]
    All,
    Type(AddressType),
    Size(AddressSize),
}
