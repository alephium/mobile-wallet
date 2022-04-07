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
import { Text } from 'react-native'
import styled from 'styled-components/native'

import Button from '../../components/buttons/Button'
import Input from '../../components/inputs/Input'
import Screen from '../../components/layout/Screen'
import RootStackParamList from '../../navigation/rootStackRoutes'

type ScreenProps = StackScreenProps<RootStackParamList, 'NewWalletNameScreen'>

const NewWalletNameScreen = ({ navigation }: ScreenProps) => {
  return (
    <Screen>
      <InstructionsContainer>
        <InstructionsFirstLine>Alright, let’s get to it.</InstructionsFirstLine>
        <InstructionsSecondLine>How should we call this wallet?</InstructionsSecondLine>
      </InstructionsContainer>
      <InputContainer>
        <StyledInput label="Wallet name" autoFocus />
      </InputContainer>
      <ActionsContainer>
        <Button title="Next" type="primary" wide />
      </ActionsContainer>
    </Screen>
  )
}

const InstructionsContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const InstructionsFirstLine = styled(Text)`
  font-size: 16px;
  color: ${({ theme }) => theme.font.secondary};
  margin-bottom: 10px;
`

const InstructionsSecondLine = styled(Text)`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.font.primary};
`

const InputContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`

const StyledInput = styled(Input)`
  width: 80%;
`

const ActionsContainer = styled.View`
  flex: 1.5;
  justify-content: center;
  align-items: center;
`

export default NewWalletNameScreen
