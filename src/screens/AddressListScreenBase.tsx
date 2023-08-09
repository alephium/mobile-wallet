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

import { StyleProp, ViewStyle } from 'react-native'
import styled from 'styled-components/native'

import { ScreenSection } from '~/components/layout/Screen'
import ScrollScreen from '~/components/layout/ScrollScreen'
import { useAppSelector } from '~/hooks/redux'
import AddressBox from '~/screens/SendReceive/AddressBox'
import { selectAllAddresses } from '~/store/addressesSlice'
import { AddressHash } from '~/types/addresses'

interface AddressListScreenBaseProps {
  onAddressPress: (addressHash: AddressHash) => void
  style?: StyleProp<ViewStyle>
}

const AddressListScreenBase = ({ onAddressPress, style }: AddressListScreenBaseProps) => {
  const addresses = useAppSelector(selectAllAddresses)

  return (
    <ScrollScreen style={style}>
      <ScreenSection>
        <AddressList>
          {addresses.map((address) => (
            <AddressBox key={address.hash} addressHash={address.hash} onPress={() => onAddressPress(address.hash)} />
          ))}
        </AddressList>
      </ScreenSection>
    </ScrollScreen>
  )
}

export default AddressListScreenBase

const AddressList = styled.View`
  gap: 20px;
`