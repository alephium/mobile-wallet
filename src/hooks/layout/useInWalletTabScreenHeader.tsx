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

import { StackNavigationProp } from '@react-navigation/stack'
import { ReactNode, useCallback, useEffect } from 'react'

import { DefaultHeaderProps } from '../../components/headers/DefaultHeader'
import InWalletTabsParamList from '../../navigation/inWalletRoutes'
import RootStackParamList from '../../navigation/rootStackRoutes'

const useInWalletTabScreenHeader = (
  renderHeader: (props: Partial<DefaultHeaderProps>) => ReactNode,
  navigation: StackNavigationProp<InWalletTabsParamList & RootStackParamList>
) => {
  const updateHeader = useCallback(
    (scrollY: number) => {
      navigation.setOptions({
        header: () => renderHeader({ scrollY })
      })
    },
    [navigation, renderHeader]
  )

  useEffect(() => {
    updateHeader(0)
  }, [updateHeader])

  return updateHeader
}

export default useInWalletTabScreenHeader