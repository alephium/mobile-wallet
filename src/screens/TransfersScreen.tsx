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
import { useWindowDimensions } from 'react-native'

import BarChart, { fakeData } from '../components/charts/BarChart'
import InWalletScrollScreen from '../components/layout/InWalletScrollScreen'
import { ScreenSection } from '../components/layout/Screen'
import TransactionsList from '../components/TransactionsList'
import { useAppSelector } from '../hooks/redux'
import InWalletTabsParamList from '../navigation/inWalletRoutes'
import RootStackParamList from '../navigation/rootStackRoutes'
import { selectAddressIds } from '../store/addressesSlice'
import { AddressHash } from '../types/addresses'

type ScreenProps = StackScreenProps<InWalletTabsParamList & RootStackParamList, 'TransfersScreen'>

const TransfersScreen = ({ navigation }: ScreenProps) => {
  const addressHashes = useAppSelector(selectAddressIds) as AddressHash[]
  const { width } = useWindowDimensions()

  return (
    <InWalletScrollScreen>
      <BarChart width={width} height={300} data={fakeData} />
      <ScreenSection>
        <TransactionsList addressHashes={addressHashes} />
      </ScreenSection>
    </InWalletScrollScreen>
  )
}

export default TransfersScreen
