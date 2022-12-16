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

import { AddressHash } from '../types/addresses'
import { AddressConfirmedTransaction } from '../types/transactions'

type RootStackParamList = {
  LandingScreen: undefined
  NewWalletIntroScreen: undefined
  NewWalletNameScreen: undefined
  PinCodeCreationScreen: undefined
  AddBiometricsScreen: undefined
  NewWalletSuccessPage: undefined
  ImportWalletSeedScreen: undefined
  ImportWalletAddressDiscoveryScreen: undefined
  InWalletScreen: undefined
  LoginScreen: {
    walletIdToLogin?: string
    workflow: 'wallet-switch' | 'app-login'
  }
  SplashScreen: undefined
  SwitchWalletScreen: undefined
  AddressScreen: {
    addressHash: AddressHash
  }
  NewAddressScreen: undefined
  EditAddressScreen: {
    addressHash: AddressHash
  }
  SettingsScreen: undefined
  SwitchNetworkScreen: undefined
  SwitchWalletAfterDeletionScreen: undefined
  TransactionScreen: {
    // TODO: Make all params serializable to help with state persistance
    tx: AddressConfirmedTransaction
  }
  ReceiveScreen: {
    addressHash: AddressHash
  }
  SendScreen: {
    addressHash: AddressHash
  }
  SecurityScreen: undefined
  AddressDiscoveryScreen?: {
    isImporting?: boolean
  }
}

export default RootStackParamList
