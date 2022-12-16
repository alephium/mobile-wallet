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

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import {
  ActiveWalletState,
  GeneratedWallet,
  SwitchedWalletUsingPinPayload,
  WalletUnlockedUsingPinPayload,
  WalletUnlockedWithoutUsingPinPayload
} from '../types/wallet'
import { appBecameInactive, appReset } from './appSlice'

const sliceName = 'activeWallet'

const initialState: ActiveWalletState = {
  name: '',
  mnemonic: '',
  isMnemonicBackedUp: undefined,
  metadataId: '',
  authType: undefined
}

const resetState = () => initialState

const activeWalletSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    newWalletGenerated: (_, action: PayloadAction<GeneratedWallet>) => {
      const { name, mnemonic, metadataId, isMnemonicBackedUp } = action.payload

      return {
        name,
        mnemonic,
        authType: 'pin',
        metadataId,
        isMnemonicBackedUp
      }
    },
    biometricsEnabled: (state) => {
      state.authType = 'biometrics'
    },
    biometricsDisabled: (state) => {
      state.authType = 'pin'
    },
    mnemonicBackedUp: (state) => {
      state.isMnemonicBackedUp = true
    },
    walletDeleted: resetState,
    switchedWalletsUsingPin: (_, action: PayloadAction<SwitchedWalletUsingPinPayload>) => action.payload.wallet,
    switchedWalletsWithoutUsingPin: (_, action: PayloadAction<WalletUnlockedWithoutUsingPinPayload>) =>
      action.payload.wallet,
    unlockedWalletUsingPin: (_, action: PayloadAction<WalletUnlockedUsingPinPayload>) => action.payload.wallet,
    unlockedWalletUsingBiometrics: (_, action: PayloadAction<WalletUnlockedWithoutUsingPinPayload>) =>
      action.payload.wallet
  },
  extraReducers: (builder) => {
    builder.addCase(appBecameInactive, resetState).addCase(appReset, resetState)
  }
})

export const {
  newWalletGenerated,
  biometricsEnabled,
  biometricsDisabled,
  mnemonicBackedUp,
  walletDeleted,
  unlockedWalletUsingBiometrics,
  switchedWalletsWithoutUsingPin,
  switchedWalletsUsingPin,
  unlockedWalletUsingPin
} = activeWalletSlice.actions

export default activeWalletSlice
