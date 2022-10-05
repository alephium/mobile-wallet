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
import { StyleProp, useWindowDimensions, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import BalanceSummary from '../components/BalanceSummary'
import Button from '../components/buttons/Button'
import LineChart, { fakeData } from '../components/charts/LineChart'
import InWalletScrollScreen from '../components/layout/InWalletScrollScreen'
import { ScreenSection } from '../components/layout/Screen'
import { useAppDispatch } from '../hooks/redux'
import InWalletTabsParamList from '../navigation/inWalletRoutes'
import { deleteAllWallets } from '../storage/wallets'
import { walletFlushed } from '../store/activeWalletSlice'

interface ScreenProps extends StackScreenProps<InWalletTabsParamList, 'DashboardScreen'> {
  style?: StyleProp<ViewStyle>
}

const DashboardScreen = ({ navigation, style }: ScreenProps) => {
  const dispatch = useAppDispatch()
  const { width } = useWindowDimensions()

  const handleDeleteAllWallets = () => {
    deleteAllWallets()
    dispatch(walletFlushed())
    navigation.getParent()?.navigate('LandingScreen')
  }

  return (
    <InWalletScrollScreen style={style}>
      <LineChart width={width} height={300} data={fakeData} />
      <ScreenSection>
        <BalanceSummary />
      </ScreenSection>
      <Buttons style={{ marginBottom: 120, marginTop: 600 }}>
        <Button title="Delete all wallets" onPress={handleDeleteAllWallets} />
      </Buttons>
    </InWalletScrollScreen>
  )
}

export default DashboardScreen

const Buttons = styled.View`
  flex-direction: row;
`
