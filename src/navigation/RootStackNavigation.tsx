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

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { useTheme } from 'styled-components'

import useBottomModalOptions from '../hooks/useBottomModalOptions'
import AddressScreen from '../screens/AddressScreen'
import EditAddressScreen from '../screens/EditAddressScreen'
import LandingScreen from '../screens/LandingScreen'
import LoginScreen from '../screens/LoginScreen'
import AddBiometricsScreen from '../screens/new-wallet/AddBiometricsScreen'
import ImportWalletSeedScreen from '../screens/new-wallet/ImportWalletSeedScreen'
import NewWalletIntroScreen from '../screens/new-wallet/NewWalletIntroScreen'
import NewWalletNameScreen from '../screens/new-wallet/NewWalletNameScreen'
import NewWalletSuccessPage from '../screens/new-wallet/NewWalletSuccessPage'
import PinCodeCreationScreen from '../screens/new-wallet/PinCodeCreationScreen'
import NewAddressScreen from '../screens/NewAddressScreen'
import SplashScreen from '../screens/SplashScreen'
import SwitchWalletScreen from '../screens/SwitchWalletScreen'
import InWalletTabsNavigation from './InWalletNavigation'
import RootStackParamList from './rootStackRoutes'

const rootStackNavigationRef = createNavigationContainerRef<RootStackParamList>()
const RootStack = createStackNavigator<RootStackParamList>()
const InWalletNavigator = createBottomTabNavigator()

const RootStackNavigation = () => {
  const theme = useTheme()
  const bottomModalOptions = useBottomModalOptions()

  console.log('RootStackNavigation renders')

  return (
    <NavigationContainer ref={rootStackNavigationRef}>
      <RootStack.Navigator
        initialRouteName={'SplashScreen'}
        screenOptions={{
          headerStyle: { elevation: 0, shadowOpacity: 0, backgroundColor: 'transparent' },
          cardStyle: { backgroundColor: theme.bg.secondary },
          headerTitle: ''
        }}
      >
        <RootStack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="LandingScreen" component={LandingScreen} options={{ headerShown: false }} />
        <RootStack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />

        {/* NEW WALLET */}
        <RootStack.Screen name="NewWalletIntroScreen" component={NewWalletIntroScreen} />
        <RootStack.Screen name="NewWalletNameScreen" component={NewWalletNameScreen} />
        <RootStack.Screen name="ImportWalletSeedScreen" component={ImportWalletSeedScreen} />
        <RootStack.Screen name="PinCodeCreationScreen" component={PinCodeCreationScreen} />
        <RootStack.Screen name="AddBiometricsScreen" component={AddBiometricsScreen} />
        <RootStack.Screen name="NewWalletSuccessPage" component={NewWalletSuccessPage} />

        {/* IN WALLET TABS */}
        <RootStack.Screen name="DashboardScreen" component={InWalletTabsNavigation} options={{ headerShown: false }} />

        <RootStack.Screen name="SwitchWalletScreen" component={SwitchWalletScreen} options={bottomModalOptions} />
        <RootStack.Screen name="AddressScreen" component={AddressScreen} options={bottomModalOptions} />

        <RootStack.Screen
          name="NewAddressScreen"
          component={NewAddressScreen}
          options={{ headerTitle: 'New address' }}
        />
        <RootStack.Screen
          name="EditAddressScreen"
          component={EditAddressScreen}
          options={{ headerTitle: 'Edit Address' }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  )
}

// Navigating without the navigation prop:
// https://reactnavigation.org/docs/navigating-without-navigation-prop
export const navigateRootStack = (
  name: keyof RootStackParamList,
  params?: StackScreenProps<RootStackParamList>['route']['params']
) => {
  if (rootStackNavigationRef.isReady()) {
    rootStackNavigationRef.navigate(name, params)
  }
}

export default RootStackNavigation
