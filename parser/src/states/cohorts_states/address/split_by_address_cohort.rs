use allocative::Allocative;

use crate::structs::{AddressData, AddressSize, AddressSplit, AddressType};

use super::AddressCohortId;

#[derive(Default, Allocative)]
pub struct SplitByAddressCohort<T> {
    pub all: T,

    pub plankton: T,
    pub shrimp: T,
    pub crab: T,
    pub fish: T,
    pub shark: T,
    pub whale: T,
    pub humpback: T,
    pub megalodon: T,

    pub p2pk: T,
    pub p2pkh: T,
    pub p2sh: T,
    pub p2wpkh: T,
    pub p2wsh: T,
    pub p2tr: T,
}

impl<T> SplitByAddressCohort<T> {
    pub fn get(&self, split: &AddressSplit) -> Option<&T> {
        match &split {
            AddressSplit::All => Some(&self.all),

            AddressSplit::Type(address_type) => match address_type {
                AddressType::P2PK => Some(&self.p2pk),
                AddressType::P2PKH => Some(&self.p2pkh),
                AddressType::P2SH => Some(&self.p2sh),
                AddressType::P2WPKH => Some(&self.p2wpkh),
                AddressType::P2WSH => Some(&self.p2wsh),
                AddressType::P2TR => Some(&self.p2tr),
                AddressType::MultiSig => None,
                AddressType::Unknown => None,
                AddressType::OpReturn => None,
                AddressType::PushOnly => None,
                AddressType::Empty => None,
            },

            AddressSplit::Size(address_size) => match address_size {
                AddressSize::Plankton => Some(&self.plankton),
                AddressSize::Shrimp => Some(&self.shrimp),
                AddressSize::Crab => Some(&self.crab),
                AddressSize::Fish => Some(&self.fish),
                AddressSize::Shark => Some(&self.shark),
                AddressSize::Whale => Some(&self.whale),
                AddressSize::Humpback => Some(&self.humpback),
                AddressSize::Megalodon => Some(&self.megalodon),
                AddressSize::Empty => None,
            },
        }
    }

    pub fn iterate(
        &mut self,
        address_data: &AddressData,
        iterate: impl Fn(&mut T) -> color_eyre::Result<()>,
    ) -> color_eyre::Result<()> {
        if let Some(state) = self.get_mut_from_split(&AddressSplit::All) {
            iterate(state)?;
        }

        if let Some(state) = self.get_mut_from_split(&AddressSplit::Type(address_data.address_type))
        {
            iterate(state)?;
        }

        if let Some(state) = self.get_mut_from_split(&AddressSplit::Size(AddressSize::from_amount(
            address_data.amount,
        ))) {
            iterate(state)?;
        }

        Ok(())
    }

    fn get_mut_from_split(&mut self, split: &AddressSplit) -> Option<&mut T> {
        match &split {
            AddressSplit::All => Some(&mut self.all),

            AddressSplit::Type(address_type) => match address_type {
                AddressType::P2PK => Some(&mut self.p2pk),
                AddressType::P2PKH => Some(&mut self.p2pkh),
                AddressType::P2SH => Some(&mut self.p2sh),
                AddressType::P2WPKH => Some(&mut self.p2wpkh),
                AddressType::P2WSH => Some(&mut self.p2wsh),
                AddressType::P2TR => Some(&mut self.p2tr),
                AddressType::MultiSig => None,
                AddressType::Unknown => None,
                AddressType::OpReturn => None,
                AddressType::PushOnly => None,
                AddressType::Empty => None,
            },

            AddressSplit::Size(address_size) => match address_size {
                AddressSize::Plankton => Some(&mut self.plankton),
                AddressSize::Shrimp => Some(&mut self.shrimp),
                AddressSize::Crab => Some(&mut self.crab),
                AddressSize::Fish => Some(&mut self.fish),
                AddressSize::Shark => Some(&mut self.shark),
                AddressSize::Whale => Some(&mut self.whale),
                AddressSize::Humpback => Some(&mut self.humpback),
                AddressSize::Megalodon => Some(&mut self.megalodon),
                AddressSize::Empty => None,
            },
        }
    }

    pub fn get_mut_from_id(&mut self, id: &AddressCohortId) -> &mut T {
        match id {
            AddressCohortId::All => &mut self.all,

            AddressCohortId::Plankton => &mut self.plankton,
            AddressCohortId::Shrimp => &mut self.shrimp,
            AddressCohortId::Crab => &mut self.crab,
            AddressCohortId::Fish => &mut self.fish,
            AddressCohortId::Shark => &mut self.shark,
            AddressCohortId::Whale => &mut self.whale,
            AddressCohortId::Humpback => &mut self.humpback,
            AddressCohortId::Megalodon => &mut self.megalodon,

            AddressCohortId::P2PK => &mut self.p2pk,
            AddressCohortId::P2PKH => &mut self.p2pkh,
            AddressCohortId::P2SH => &mut self.p2sh,
            AddressCohortId::P2WPKH => &mut self.p2wpkh,
            AddressCohortId::P2WSH => &mut self.p2wsh,
            AddressCohortId::P2TR => &mut self.p2tr,
        }
    }

    pub fn as_vec(&self) -> Vec<(&T, AddressCohortId)> {
        vec![
            (&self.all, AddressCohortId::All),
            (&self.plankton, AddressCohortId::Plankton),
            (&self.shrimp, AddressCohortId::Shrimp),
            (&self.crab, AddressCohortId::Crab),
            (&self.fish, AddressCohortId::Fish),
            (&self.shark, AddressCohortId::Shark),
            (&self.whale, AddressCohortId::Whale),
            (&self.humpback, AddressCohortId::Humpback),
            (&self.megalodon, AddressCohortId::Megalodon),
            (&self.p2pk, AddressCohortId::P2PK),
            (&self.p2pkh, AddressCohortId::P2PKH),
            (&self.p2sh, AddressCohortId::P2SH),
            (&self.p2wpkh, AddressCohortId::P2WPKH),
            (&self.p2wsh, AddressCohortId::P2WSH),
            (&self.p2tr, AddressCohortId::P2TR),
        ]
    }

    pub fn as_mut_vec(&mut self) -> Vec<(&mut T, AddressCohortId)> {
        vec![
            (&mut self.all, AddressCohortId::All),
            (&mut self.plankton, AddressCohortId::Plankton),
            (&mut self.shrimp, AddressCohortId::Shrimp),
            (&mut self.crab, AddressCohortId::Crab),
            (&mut self.fish, AddressCohortId::Fish),
            (&mut self.shark, AddressCohortId::Shark),
            (&mut self.whale, AddressCohortId::Whale),
            (&mut self.humpback, AddressCohortId::Humpback),
            (&mut self.megalodon, AddressCohortId::Megalodon),
            (&mut self.p2pk, AddressCohortId::P2PK),
            (&mut self.p2pkh, AddressCohortId::P2PKH),
            (&mut self.p2sh, AddressCohortId::P2SH),
            (&mut self.p2wpkh, AddressCohortId::P2WPKH),
            (&mut self.p2wsh, AddressCohortId::P2WSH),
            (&mut self.p2tr, AddressCohortId::P2TR),
        ]
    }
}
