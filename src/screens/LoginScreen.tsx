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

import { StackScreenProps } from '@react-navigation/stack'
import { useCallback, useState } from 'react'

import ConfirmWithAuthModal from '../components/ConfirmWithAuthModal'
import Screen from '../components/layout/Screen'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import RootStackParamList from '../navigation/rootStackRoutes'
import { deriveAddressesFromStoredMetadata, rememberActiveWallet } from '../persistent-storage/wallets'
import { switchedWalletsUsingPin, unlockedWalletUsingPin } from '../store/activeWalletSlice'
import { ActiveWalletState } from '../types/wallet'
import { useRestoreNavigationState } from '../utils/navigation'

type ScreenProps = StackScreenProps<RootStackParamList, 'LoginScreen'>

const LoginScreen = ({
  navigation,
  route: {
    params: { walletIdToLogin, workflow }
  }
}: ScreenProps) => {
  const restoreNavigationState = useRestoreNavigationState()
  const addressesStatus = useAppSelector((state) => state.addresses.status)
  const dispatch = useAppDispatch()

  const [isPinModalVisible, setIsPinModalVisible] = useState(true)

  const handleSuccessfulLogin = useCallback(
    async (pin?: string, wallet?: ActiveWalletState) => {
      if (!pin || !wallet) return

      setIsPinModalVisible(false)

      await rememberActiveWallet(wallet.metadataId)

      if (workflow === 'wallet-switch') {
        const addressesToInitialize = await deriveAddressesFromStoredMetadata(wallet.metadataId, wallet.mnemonic)

        dispatch(switchedWalletsUsingPin({ wallet, addressesToInitialize, pin }))
      } else if (workflow === 'app-login') {
        let addressesToInitialize = undefined

        if (addressesStatus === 'uninitialized') {
          addressesToInitialize = await deriveAddressesFromStoredMetadata(wallet.metadataId, wallet.mnemonic)
        }

        dispatch(unlockedWalletUsingPin({ wallet, addressesToInitialize, pin }))
      }

      const resetNavigationState = workflow === 'wallet-switch'
      restoreNavigationState(resetNavigationState)
    },
    [addressesStatus, dispatch, restoreNavigationState, workflow]
  )

  return (
    <Screen style={{ marginTop: 40 }}>
      {isPinModalVisible && (
        <ConfirmWithAuthModal usePin onConfirm={handleSuccessfulLogin} walletId={walletIdToLogin} />
      )}
    </Screen>
  )
}

export default LoginScreen
