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

import { formatAmountForDisplay } from '@alephium/sdk'
import { useEffect, useState } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { useAppSelector } from '../hooks/redux'
import { selectAllAddresses } from '../store/addressesSlice'
import Amount from './Amount'

interface BalanceSummaryProps {
  style?: StyleProp<ViewStyle>
}

const BalanceSummary = ({ style }: BalanceSummaryProps) => {
  const [usdPrice, setUsdPrice] = useState(0)
  const addresses = useAppSelector(selectAllAddresses)
  const totalBalance = addresses.reduce((acc, address) => acc + BigInt(address.networkData.details.balance), BigInt(0))
  const balanceFormatted = formatAmountForDisplay(totalBalance)
  const balanceInUsd = usdPrice * parseFloat(balanceFormatted)

  const fetchPrice = async () => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=alephium&vs_currencies=usd')
      const data = await response.json()
      setUsdPrice(data.alephium.usd)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchPrice()
  }, [])

  return (
    <View style={style}>
      <AmountInUsd fiat={balanceInUsd} fadeDecimals suffix="$" />
      <AmountStyled value={totalBalance} fadeDecimals />
    </View>
  )
}

export default BalanceSummary

const AmountInUsd = styled(Amount)`
  font-weight: bold;
  font-size: 38px;
  margin-bottom: 10px;
`

const AmountStyled = styled(Amount)`
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 40px;
`
