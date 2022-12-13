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
import Checkbox from 'expo-checkbox'
import { Import, Search, X } from 'lucide-react-native'
import { useCallback, useEffect, useState } from 'react'
import { ActivityIndicator, BackHandler, ScrollView, View } from 'react-native'
import { Bar as ProgressBar } from 'react-native-progress'
import styled, { useTheme } from 'styled-components/native'

import Amount from '../components/Amount'
import AppText from '../components/AppText'
import Button from '../components/buttons/Button'
import HighlightRow from '../components/HighlightRow'
import Screen, { BottomScreenSection, ScreenSection, ScreenSectionTitle } from '../components/layout/Screen'
import SpinnerModal from '../components/SpinnerModal'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import RootStackParamList from '../navigation/rootStackRoutes'
import {
  addressDiscoveryStopped,
  addressesDiscovered,
  selectAllDiscoveredAddresses
} from '../store/addressDiscoverySlice'
import { newAddressesStoredAndInitialized, selectAllAddresses } from '../store/addressesSlice'
import { AddressHash } from '../types/addresses'
import { getRandomLabelColor } from '../utils/colors'

type ScreenProps = StackScreenProps<RootStackParamList, 'AddressDiscoveryScreen'>

const AddressDiscoveryScreen = ({ navigation, route: { params } }: ScreenProps) => {
  const dispatch = useAppDispatch()
  const theme = useTheme()
  const addresses = useAppSelector(selectAllAddresses)
  const discoveredAddresses = useAppSelector(selectAllDiscoveredAddresses)
  const { loading, status, progress } = useAppSelector((state) => state.addressDiscovery)

  const [addressSelections, setAddressSelections] = useState<Record<AddressHash, boolean>>({})
  const [importLoading, setImportLoading] = useState(false)

  const isImporting = params?.isImporting
  const selectedAddressesToImport = discoveredAddresses.filter(({ hash }) => addressSelections[hash])

  const startScan = useCallback(() => dispatch(addressesDiscovered()), [dispatch])

  const stopScan = () => dispatch(addressDiscoveryStopped())

  const importAddresses = async () => {
    setImportLoading(true)

    const newAddresses = selectedAddressesToImport.map((address) => ({
      ...address,
      settings: { isMain: false, color: getRandomLabelColor() }
    }))

    await dispatch(newAddressesStoredAndInitialized(newAddresses))

    navigation.navigate(isImporting ? 'NewWalletSuccessPage' : 'InWalletScreen')

    setImportLoading(false)
  }

  const toggleAddressSelection = (hash: AddressHash) => {
    if (loading) return

    setAddressSelections({
      ...addressSelections,
      [hash]: !addressSelections[hash]
    })
  }

  useEffect(() => {
    discoveredAddresses.forEach(({ hash }) => {
      if (addressSelections[hash] === undefined) {
        setAddressSelections({ ...addressSelections, [hash]: true })
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discoveredAddresses])

  const cancelAndGoToWelcomeScreen = useCallback(() => {
    dispatch(addressDiscoveryStopped())
    navigation.navigate('NewWalletSuccessPage')
  }, [dispatch, navigation])

  // Start scanning and override back navigation when in wallet import flow
  useFocusEffect(
    useCallback(() => {
      if (!isImporting) return

      startScan()

      navigation.setOptions({
        headerLeft: () => null,
        headerRight: () => (
          <Button
            onPress={cancelAndGoToWelcomeScreen}
            icon={<X size={24} color={theme.font.primary} />}
            type="transparent"
          />
        )
      })

      const subscription = BackHandler.addEventListener('hardwareBackPress', () => true)

      return subscription.remove
    }, [cancelAndGoToWelcomeScreen, isImporting, navigation, startScan, theme.font.primary])
  )

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
        <View>
          <ScreenSection>
            <AppText bold>Scan the blockchain to find your active addresses. This process might take a while.</AppText>
          </ScreenSection>
          <ScreenSection>
            <ScreenSectionTitle>Current addresses</ScreenSectionTitle>
            {addresses.map((address, index) => (
              <HighlightRow
                key={address.hash}
                title={address.settings.label || address.hash}
                subtitle={address.settings.label ? address.hash : undefined}
                truncate
                isTopRounded={index === 0}
                isBottomRounded={index === addresses.length - 1}
              >
                <Amount value={BigInt(address.networkData.availableBalance)} fadeDecimals bold />
              </HighlightRow>
            ))}
          </ScreenSection>
          {(loading || discoveredAddresses.length > 0) && (
            <ScreenSection>
              <ScreenSectionTitle>Newly discovered addresses</ScreenSectionTitle>

              {loading && (
                <ScanningIndication>
                  <Row style={{ marginBottom: 10 }}>
                    <ActivityIndicator size="small" color={theme.font.tertiary} style={{ marginRight: 10 }} />
                    <AppText color={theme.font.secondary}>Scanning...</AppText>
                  </Row>
                  <ProgressBar progress={progress} color={theme.global.accent} />
                </ScanningIndication>
              )}

              {discoveredAddresses.map(({ hash, balance }, index) => (
                <HighlightRow
                  key={hash}
                  title={hash}
                  truncate
                  isTopRounded={index === 0}
                  isBottomRounded={index === discoveredAddresses.length - 1}
                  onPress={() => toggleAddressSelection(hash)}
                >
                  <Row>
                    <AmountStyled value={BigInt(balance)} color={theme.font.secondary} fadeDecimals />
                    <Checkbox
                      value={addressSelections[hash]}
                      disabled={loading}
                      onValueChange={() => toggleAddressSelection(hash)}
                    />
                  </Row>
                </HighlightRow>
              ))}
            </ScreenSection>
          )}
        </View>
        <BottomScreenSection>
          {status === 'idle' && (
            <ButtonStyled
              icon={<Search size={24} color={theme.font.contrast} />}
              title="Start scanning"
              onPress={startScan}
            />
          )}
          {status === 'started' && (
            <ButtonStyled
              icon={<X size={24} color={theme.font.contrast} />}
              title="Stop scanning"
              onPress={stopScan}
              type="secondary"
            />
          )}
          {status === 'stopped' && (
            <ContinueButton
              icon={<Search size={24} color={theme.font.contrast} />}
              title="Continue scanning"
              onPress={startScan}
            />
          )}
          {(status === 'stopped' || status === 'finished') && (
            <ButtonStyled
              icon={<Import size={24} color={theme.font.contrast} />}
              title="Import addresses"
              onPress={importAddresses}
              disabled={selectedAddressesToImport.length === 0}
            />
          )}
        </BottomScreenSection>
      </ScrollView>
      <SpinnerModal isActive={importLoading} text="Importing addresses..." />
    </Screen>
  )
}

export default AddressDiscoveryScreen

const Row = styled.View`
  flex-direction: row;
`

const ScanningIndication = styled.View`
  margin-bottom: 20px;
  align-items: center;
`

const AmountStyled = styled(Amount)`
  margin-right: 10px;
`

const ButtonStyled = styled(Button)`
  width: 100%;
`

const ContinueButton = styled(ButtonStyled)`
  margin-bottom: 24px;
`