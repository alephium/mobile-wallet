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
import * as Clipboard from 'expo-clipboard'
import { Book, ClipboardIcon, Contact2, Scan } from 'lucide-react-native'
import { usePostHog } from 'posthog-react-native'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { StyleProp, ViewStyle } from 'react-native'
import styled, { useTheme } from 'styled-components/native'

import Button from '~/components/buttons/Button'
import Input from '~/components/inputs/Input'
import BoxSurface from '~/components/layout/BoxSurface'
import { ScreenSection } from '~/components/layout/Screen'
import ScrollScreen from '~/components/layout/ScrollScreen'
import { useSendContext } from '~/contexts/SendContext'
import { PossibleNextScreenAfterDestination, SendNavigationParamList } from '~/navigation/SendNavigation'
import { BackButton, ContinueButton } from '~/screens/SendReceive/ScreenHeader'
import ScreenIntro from '~/screens/SendReceive/ScreenIntro'
import { AddressHash } from '~/types/addresses'
import { validateIsAddressValid } from '~/utils/forms'

interface ScreenProps extends StackScreenProps<SendNavigationParamList, 'DestinationScreen'> {
  style?: StyleProp<ViewStyle>
}

type FormData = {
  toAddressHash: AddressHash
}

const requiredErrorMessage = 'This field is required'

const DestinationScreen = ({ navigation, style, route: { params } }: ScreenProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({ defaultValues: { toAddressHash: '' } })
  const theme = useTheme()
  const { setToAddress, setFromAddress, toAddress } = useSendContext()
  const posthog = usePostHog()

  const [nextScreen, setNextScreen] = useState<PossibleNextScreenAfterDestination>('OriginScreen')

  const handlePastePress = async () => {
    const text = await Clipboard.getStringAsync()
    setValue('toAddressHash', text)

    posthog?.capture('Send: Pasted destination address')
  }

  useEffect(() => {
    if (params?.fromAddressHash) {
      setFromAddress(params.fromAddressHash)
      setNextScreen('AssetsScreen')
    } else {
      setNextScreen('OriginScreen')
    }
  }, [params?.fromAddressHash, setFromAddress, setToAddress])

  useFocusEffect(
    useCallback(() => {
      const onContinue = (formData: FormData) => {
        setToAddress(formData.toAddressHash)
        navigation.navigate(nextScreen)
      }

      navigation.getParent()?.setOptions({
        headerLeft: () => <BackButton onPress={() => navigation.goBack()} />,
        headerRight: () => <ContinueButton onPress={handleSubmit(onContinue)} />
      })
    }, [handleSubmit, navigation, nextScreen, setToAddress])
  )

  useEffect(() => {
    if (toAddress) {
      setValue('toAddressHash', toAddress)
    }
  }, [setValue, toAddress])

  return (
    <ScrollScreen style={style}>
      <ScreenIntro
        title="Destination"
        subtitle="Send to an address, a contact, or one of your other addresses."
        surtitle="SEND"
      />
      <ScreenSection>
        <BoxSurface>
          <Controller
            name="toAddressHash"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Destination address"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.toAddressHash?.type === 'required' ? requiredErrorMessage : errors.toAddressHash?.message}
              />
            )}
            rules={{
              required: true,
              validate: validateIsAddressValid
            }}
            control={control}
          />
        </BoxSurface>
      </ScreenSection>
      <ScreenSection>
        <ButtonsRow>
          <Button color={theme.global.accent} compact Icon={Scan} title="Scan" />
          <Button color={theme.global.accent} compact Icon={ClipboardIcon} title="Paste" onPress={handlePastePress} />
          <Button
            color={theme.global.accent}
            compact
            Icon={Contact2}
            title="Contacts"
            onPress={() => navigation.navigate('SelectContactScreen', { nextScreen })}
          />
          <Button
            color={theme.global.accent}
            compact
            Icon={Book}
            title="Addresses"
            onPress={() => navigation.navigate('SelectAddressScreen', { nextScreen })}
          />
        </ButtonsRow>
      </ScreenSection>
    </ScrollScreen>
  )
}

export default DestinationScreen

const ButtonsRow = styled.View`
  flex-direction: row;
  gap: 15px;
  flex-wrap: wrap;
`
