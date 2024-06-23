use derive_deref::{Deref, DerefMut};

use crate::{states::OneShotStates, structs::SplitByLiquidity};

use super::SplitByAddressCohort;

#[derive(Deref, DerefMut, Default)]
pub struct AddressCohortsOneShotStates(pub SplitByAddressCohort<SplitByLiquidity<OneShotStates>>);
