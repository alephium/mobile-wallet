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

import dayjs from 'dayjs'
import updateLocale from 'dayjs/plugin/updateLocale'
import { StatusBar } from 'expo-status-bar'
import { difference } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ViewProps } from 'react-native'
import { RootSiblingParent } from 'react-native-root-siblings'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { Provider } from 'react-redux'
import { DefaultTheme, ThemeProvider } from 'styled-components/native'

import client from '~/api/client'
import { useAppDispatch, useAppSelector } from '~/hooks/redux'
import useInterval from '~/hooks/useInterval'
import useLoadStoredSettings from '~/hooks/useLoadStoredSettings'
import RootStackNavigation from '~/navigation/RootStackNavigation'
import {
  makeSelectAddressesUnknownTokens,
  selectAddressIds,
  syncAddressesData,
  syncAddressesDataWhenPendingTxsConfirm,
  syncAddressesHistoricBalances
} from '~/store/addressesSlice'
import { syncNetworkTokensInfo, syncUnknownTokensInfo } from '~/store/assets/assetsActions'
import { selectIsTokensMetadataUninitialized } from '~/store/assets/assetsSelectors'
import { apiClientInitFailed, apiClientInitSucceeded } from '~/store/networkSlice'
import { selectAllPendingTransactions } from '~/store/pendingTransactionsSlice'
import { store } from '~/store/store'
import { makeSelectAddressesHashesWithPendingTransactions } from '~/store/transactions/transactionSelectors'
import { themes } from '~/style/themes'

dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'some sec',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: '1mo',
    MM: '%dmo',
    y: '1y',
    yy: '%dy'
  }
})

const App = () => {
  const [theme, setTheme] = useState<DefaultTheme>(themes.light)

  useEffect(
    () =>
      store.subscribe(() => {
        setTheme(themes[store.getState().settings.theme])
      }),
    []
  )

  return (
    <Provider store={store}>
      <Main>
        <ThemeProvider theme={theme}>
          <RootStackNavigation />
          <StatusBar style={theme.name === 'light' ? 'dark' : 'light'} />
        </ThemeProvider>
      </Main>
    </Provider>
  )
}

const Main = ({ children, ...props }: ViewProps) => {
  const dispatch = useAppDispatch()
  const addressesStatus = useAppSelector((s) => s.addresses.status)
  const network = useAppSelector((s) => s.network)
  const addressIds = useAppSelector(selectAddressIds)
  const assetsInfo = useAppSelector((s) => s.assetsInfo)
  const isLoadingTokensMetadata = useAppSelector((s) => s.assetsInfo.loading)
  const isSyncingAddressData = useAppSelector((s) => s.addresses.syncingAddressData)
  const isTokensMetadataUninitialized = useAppSelector(selectIsTokensMetadataUninitialized)
  const selectAddressesHashesWithPendingTransactions = useMemo(makeSelectAddressesHashesWithPendingTransactions, [])
  const addressesWithPendingTxs = useAppSelector(selectAddressesHashesWithPendingTransactions)
  const pendingTxs = useAppSelector(selectAllPendingTransactions)

  const selectAddressesUnknownTokens = useMemo(makeSelectAddressesUnknownTokens, [])
  const unknownTokens = useAppSelector(selectAddressesUnknownTokens)
  const checkedUnknownTokenIds = useAppSelector((s) => s.assetsInfo.checkedUnknownTokenIds)
  const unknownTokenIds = unknownTokens.map((token) => token.id)
  const newUnknownTokens = difference(unknownTokenIds, checkedUnknownTokenIds)

  useLoadStoredSettings()

  const initializeClient = useCallback(async () => {
    try {
      client.init(network.settings.nodeHost, network.settings.explorerApiHost)
      const { networkId } = await client.node.infos.getInfosChainParams()
      // TODO: Check if connection to explorer also works
      dispatch(apiClientInitSucceeded({ networkId, networkName: network.name }))
      console.log(`Client initialized. Current network: ${network.name}`)
    } catch (e) {
      dispatch(apiClientInitFailed())
      console.error('Could not connect to network: ', network.name)
      console.error(e)
    }
  }, [network.settings.nodeHost, network.settings.explorerApiHost, network.name, dispatch])

  useEffect(() => {
    if (network.status === 'connecting') {
      initializeClient()
    }
  }, [initializeClient, network.status])

  const shouldInitialize = network.status === 'offline'
  useInterval(initializeClient, 2000, !shouldInitialize)

  useEffect(() => {
    if (network.status === 'online') {
      if (assetsInfo.status === 'uninitialized' && !isLoadingTokensMetadata) {
        dispatch(syncNetworkTokensInfo())
      }
      if (addressesStatus === 'uninitialized') {
        if (!isSyncingAddressData && addressIds.length > 0) {
          dispatch(syncAddressesData())
          dispatch(syncAddressesHistoricBalances())
        }
      } else if (addressesStatus === 'initialized') {
        if (!isTokensMetadataUninitialized && !isLoadingTokensMetadata && newUnknownTokens.length > 0) {
          dispatch(syncUnknownTokensInfo(newUnknownTokens))
        }
      }
    }
  }, [
    addressIds.length,
    addressesStatus,
    assetsInfo.status,
    dispatch,
    isLoadingTokensMetadata,
    isSyncingAddressData,
    isTokensMetadataUninitialized,
    network.status,
    newUnknownTokens
  ])

  const refreshAddressDataWhenPendingTxsConfirm = useCallback(() => {
    dispatch(syncAddressesDataWhenPendingTxsConfirm({ addresses: addressesWithPendingTxs, pendingTxs }))
  }, [addressesWithPendingTxs, dispatch, pendingTxs])

  useInterval(refreshAddressDataWhenPendingTxsConfirm, 5000, pendingTxs.length === 0)

  return (
    <RootSiblingParent>
      <SafeAreaProvider {...props} style={[{ backgroundColor: 'black' }, props.style]}>
        {children}
      </SafeAreaProvider>
    </RootSiblingParent>
  )
}

export default App
