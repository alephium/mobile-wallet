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
import { usePostHog } from 'posthog-react-native'
import React, { useState } from 'react'
import styled from 'styled-components/native'

import AppText from '~/components/AppText'
import { ScreenSection } from '~/components/layout/Screen'
import ScrollScreen, { ScrollScreenProps } from '~/components/layout/ScrollScreen'
import SpinnerModal from '~/components/SpinnerModal'
import usePersistAddressSettings from '~/hooks/layout/usePersistAddressSettings'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import RootStackParamList from '~/navigation/rootStackRoutes'
import AddressForm from '~/screens/Addresses/Address/AddressForm'
import { addressSettingsSaved, selectAddressByHash } from '~/store/addressesSlice'
import { AddressSettings } from '~/types/addresses'

interface EditAddressScreenProps extends StackScreenProps<RootStackParamList, 'EditAddressScreen'>, ScrollScreenProps {}

const EditAddressScreen = ({ navigation, route: { params }, ...props }: EditAddressScreenProps) => {
  const dispatch = useAppDispatch()
  const addressHash = params.addressHash
  const address = useAppSelector((s) => selectAddressByHash(s, addressHash))
  const persistAddressSettings = usePersistAddressSettings()
  const posthog = usePostHog()

  const [loading, setLoading] = useState(false)

  if (!address) return null

  const handleSavePress = async (settings: AddressSettings) => {
    if (address.settings.isDefault && !settings.isDefault) return

    setLoading(true)

    try {
      await persistAddressSettings({ ...address, settings })
      dispatch(addressSettingsSaved({ ...address, settings }))

      posthog?.capture('Address: Editted address settings')
    } catch (e) {
      console.error(e)

      posthog?.capture('Error', { message: 'Could not edit address settings' })
    }

    setLoading(false)
    navigation.goBack()
  }

  return (
    <ScrollScreen
      usesKeyboard
      verticalGap
      headerOptions={{ headerTitle: 'Address settings', type: 'stack' }}
      {...props}
    >
      <ScreenSection>
        <HashEllipsed numberOfLines={1} ellipsizeMode="middle" color="secondary">
          {addressHash}
        </HashEllipsed>
      </ScreenSection>

      <AddressForm
        initialValues={address.settings}
        onSubmit={handleSavePress}
        buttonText="Save"
        disableIsMainToggle={address.settings.isDefault}
        addressHash={address.hash}
      />
      <SpinnerModal isActive={loading} text="Saving address..." />
    </ScrollScreen>
  )
}

export default EditAddressScreen

const HashEllipsed = styled(AppText)`
  max-width: 50%;
  margin-top: 8px;
`