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

import { useFocusEffect } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { useCallback, useEffect } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ScreenSection } from '~/components/layout/Screen'
import ScrollScreen from '~/components/layout/ScrollScreen'
import { useSendContext } from '~/contexts/SendContext'
import { useAppSelector } from '~/hooks/redux'
import { SendNavigationParamList } from '~/navigation/SendNavigation'
import AddressBox from '~/screens/SendReceive/AddressBox'
import { BackButton, ContinueButton } from '~/screens/SendReceive/ScreenHeader'
import ScreenIntro from '~/screens/SendReceive/ScreenIntro'
import { selectAllAddresses, selectDefaultAddress } from '~/store/addressesSlice'

interface ScreenProps extends StackScreenProps<SendNavigationParamList, 'OriginScreen'> {
  style?: StyleProp<ViewStyle>
}

const OriginScreen = ({ navigation, style, route: { params } }: ScreenProps) => {
  const { fromAddress, setFromAddress, setToAddress } = useSendContext()
  const addresses = useAppSelector(selectAllAddresses)
  const defaultAddress = useAppSelector(selectDefaultAddress)

  useEffect(() => {
    if (params?.toAddressHash) setToAddress(params.toAddressHash)
  }, [params?.toAddressHash, setToAddress])

  useFocusEffect(
    useCallback(() => {
      if (!fromAddress && defaultAddress) setFromAddress(defaultAddress.hash)

      navigation.getParent()?.setOptions({
        headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        headerRight: () => <ContinueButton onPress={() => navigation.navigate('AssetsScreen')} />
      })
    }, [defaultAddress, fromAddress, navigation, setFromAddress])
  )

  return (
    <ScrollScreen style={[style, { paddingBottom: 80 }]}>
      <ScreenIntro title="Origin" subtitle="Select the address from which to send the transaction." surtitle="SEND" />
      <ScreenSection>
        <AddressList>
          {addresses.map((address) => (
            <AddressBox
              key={address.hash}
              addressHash={address.hash}
              isSelected={address.hash === fromAddress}
              onPress={() => setFromAddress(address.hash)}
            />
          ))}
        </AddressList>
      </ScreenSection>
    </ScrollScreen>
  )
}

export default OriginScreen

const AddressList = styled.View`
  gap: 20px;
`
