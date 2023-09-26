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

import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit'

import { walletSwitched, walletUnlocked } from '~/store/activeWalletSlice'
import { appReset } from '~/store/appSlice'
import { newWalletImportedWithMetadata } from '~/store/wallet/walletActions'

const sliceName = 'walletGeneration'

export type WalletGenerationMethod = 'create' | 'import'

interface WalletGenerationState {
  method: WalletGenerationMethod | null
  walletName: string
  qrCodeImportedEncryptedMnemonic: string | null
}

const initialState: WalletGenerationState = {
  method: null,
  walletName: '',
  qrCodeImportedEncryptedMnemonic: ''
}

const walletGenerationSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    methodSelected: (state, action: PayloadAction<WalletGenerationMethod>) => {
      state.method = action.payload
    },
    newWalletNameEntered: (state, action: PayloadAction<string>) => {
      state.walletName = action.payload
    },
    qrCodeFromDesktopWalletScanned: (state, action: PayloadAction<string>) => {
      state.qrCodeImportedEncryptedMnemonic = action.payload
    }
  },
  extraReducers(builder) {
    builder.addCase(newWalletImportedWithMetadata, (state) => {
      state.qrCodeImportedEncryptedMnemonic = ''
    })
    builder.addMatcher(isAnyOf(appReset, walletUnlocked, walletSwitched), () => initialState)
  }
})

export const { methodSelected, newWalletNameEntered, qrCodeFromDesktopWalletScanned } = walletGenerationSlice.actions

export default walletGenerationSlice
