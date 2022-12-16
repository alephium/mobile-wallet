/*
Copyright 2018 - 2022 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

import { AddressKeyPair } from '@alephium/sdk'

import { AddressMetadata, AddressPartial } from './addresses'

export type Mnemonic = string

export type StoredWalletAuthType = 'pin' | 'biometrics'

export type WalletMetadata = {
  id: string
  name: string
  authType: StoredWalletAuthType
  isMnemonicBackedUp: boolean
  addresses: AddressMetadata[]
}

export interface ActiveWalletState {
  name: string
  mnemonic: Mnemonic
  metadataId: string
  isMnemonicBackedUp?: boolean
  authType?: StoredWalletAuthType
}

export type GeneratedWallet = ActiveWalletState & { firstAddress: AddressKeyPair }

export interface CredentialsState {
  pin?: string
}

export type WalletUnlockedWithoutUsingPinPayload = {
  wallet: ActiveWalletState
  addressesToInitialize?: AddressPartial[]
}

export type WalletUnlockedUsingPinPayload = CredentialsState & WalletUnlockedWithoutUsingPinPayload

export type SwitchedWalletUsingPinPayload = CredentialsState & {
  wallet: ActiveWalletState
  addressesToInitialize: AddressPartial[]
}
