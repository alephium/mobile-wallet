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

import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { Circle as ProgressBar } from 'react-native-progress'
import styled, { useTheme } from 'styled-components/native'

import NavigationStackHeader, { NavigationStackHeaderProps } from '~/components/headers/NavigationStackHeader'
import { BackupMnemonicNavigationParamList } from '~/navigation/BackupMnemonicNavigation'
import { ReceiveNavigationParamList } from '~/navigation/ReceiveNavigation'
import { SendNavigationParamList } from '~/navigation/SendNavigation'

interface ProgressHeaderProps extends NavigationStackHeaderProps {
  workflow: 'send' | 'receive' | 'backup'
}

const workflowSteps: Record<
  ProgressHeaderProps['workflow'],
  (keyof ReceiveNavigationParamList)[] | (keyof SendNavigationParamList)[] | (keyof BackupMnemonicNavigationParamList)[]
> = {
  receive: ['AddressScreen', 'QRCodeScreen'],
  send: ['DestinationScreen', 'OriginScreen', 'AssetsScreen', 'VerifyScreen'],
  backup: ['BackupIntroScreen', 'VerifyMnemonicScreen', 'VerificationSuccessScreen']
}

const ProgressHeader = ({ route, workflow, options, ...props }: ProgressHeaderProps) => {
  const theme = useTheme()

  const [progress, setProgress] = useState(0)

  const steps = workflowSteps[workflow]

  useEffect(() => {
    const routeName = getFocusedRouteNameFromRoute(route) ?? steps[0]
    const currentStepIndex = steps.findIndex((step) => step === routeName)

    if (currentStepIndex !== -1) setProgress((currentStepIndex + 1) / steps.length)
  }, [route, steps])

  return (
    <NavigationStackHeader
      options={{
        ...options,
        headerRight: () => (
          <HeaderRightContainer>
            {options.headerRight && <HeaderRightOptionWrapper>{options.headerRight({})}</HeaderRightOptionWrapper>}
          </HeaderRightContainer>
        ),
        headerTitleRight: () => (
          <ProgressBar
            progress={progress}
            color={progress === 1 ? theme.global.valid : theme.global.accent}
            unfilledColor={theme.border.primary}
            fill="transparent"
            borderWidth={0}
            size={28}
            style={{ marginBottom: -1 }}
            pointerEvents="none"
            thickness={3}
          />
        )
      }}
      showCompactComponents
      showBorderBottom
      route={route}
      {...props}
    />
  )
}

export default ProgressHeader

export const BackButtonStyled = styled.Pressable`
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.bg.secondary};
  align-items: center;
  justify-content: center;
`

const HeaderRightContainer = styled.View`
  flex: 1;
  align-items: flex-end;
  justify-content: center;
`

const HeaderRightOptionWrapper = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  justify-content: center;
`
