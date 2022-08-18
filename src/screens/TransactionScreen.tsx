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
import dayjs from 'dayjs'
import { openBrowserAsync } from 'expo-web-browser'
import { ChevronRight as ChevronRightIcon } from 'lucide-react-native'
import { ScrollView } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import AddressBadge from '../components/AddressBadge'
import Amount from '../components/Amount'
import HighlightRow from '../components/HighlightRow'
import IOList from '../components/IOList'
import Screen, { BottomModalScreenTitle, ScreenSection } from '../components/layout/Screen'
import { useAppSelector } from '../hooks/redux'
import RootStackParamList from '../navigation/rootStackRoutes'

type ScreenProps = StackScreenProps<RootStackParamList, 'TransactionScreen'>

const TransactionScreen = ({
  navigation,
  route: {
    params: { tx, isOut, amount }
  }
}: ScreenProps) => {
  const theme = useTheme()
  const explorerBaseUrl = useAppSelector((state) => state.network.settings.explorerUrl)
  const explorerTxUrl = `${explorerBaseUrl}/#/transactions/${tx.hash}`

  return (
    <Screen>
      <ScrollView>
        <ScreenSectionRow>
          <BottomModalScreenTitle>Transaction</BottomModalScreenTitle>
          <ExplorerLink onPress={() => openBrowserAsync(explorerTxUrl)}>
            <ExplorerLinkText>See in explorer</ExplorerLinkText>
            <ChevronRightIcon size={24} color={theme.global.accent} />
          </ExplorerLink>
        </ScreenSectionRow>
        <ScreenSection>
          <HighlightRow title="Amount" isTopRounded hasBottomBorder>
            <Amount value={amount} fadeDecimals fullPrecision suffix="ALPH" />
          </HighlightRow>
          <HighlightRow title="Timestamp" hasBottomBorder>
            <BoldText>{dayjs(tx.timestamp).fromNow()}</BoldText>
          </HighlightRow>
          <HighlightRow title="Status" hasBottomBorder>
            <BoldText>Confirmed</BoldText>
          </HighlightRow>
          <HighlightRow title="From" hasBottomBorder>
            {isOut ? (
              <AddressContainer>
                <AddressBadge address={tx.address} />
              </AddressContainer>
            ) : (
              <AddressContainer>
                <IOList isOut={isOut} tx={tx} />
              </AddressContainer>
            )}
          </HighlightRow>
          <HighlightRow title="To" hasBottomBorder>
            {!isOut ? (
              <AddressContainer>
                <AddressBadge address={tx.address} />
              </AddressContainer>
            ) : (
              <AddressContainer>
                <IOList isOut={isOut} tx={tx} />
              </AddressContainer>
            )}
          </HighlightRow>
          <HighlightRow title="Fee" isBottomRounded>
            <Amount value={BigInt(tx.gasPrice) * BigInt(tx.gasAmount)} fadeDecimals fullPrecision suffix="ALPH" />
          </HighlightRow>
        </ScreenSection>
      </ScrollView>
    </Screen>
  )
}

export default TransactionScreen

const BoldText = styled.Text`
  font-weight: 600;
`

const AddressContainer = styled.View`
  max-width: 200px;
`

const ScreenSectionRow = styled(ScreenSection)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const ExplorerLink = styled.Pressable`
  flex-direction: row;
`

const ExplorerLinkText = styled.Text`
  color: ${({ theme }) => theme.global.accent};
  font-size: 16px;
  font-weight: 700;
  margin-right: 10px;
`