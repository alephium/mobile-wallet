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

import { ReactNode } from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import styled, { css } from 'styled-components/native'

interface ListProps {
  children: ReactNode[]
  style?: StyleProp<ViewStyle>
}

const List = ({ style, children }: ListProps) => <View style={style}>{children}</View>

export default styled(List)`
  border-radius: 12px;
  background-color: white;
`

export const ListItem = styled(View)<{ isLast?: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: 20px 15px;

  ${({ isLast, theme }) =>
    !isLast &&
    css`
      border-bottom-color: ${({ theme }) => theme.border.secondary};
      border-bottom-width: 1px;
    `};
`
