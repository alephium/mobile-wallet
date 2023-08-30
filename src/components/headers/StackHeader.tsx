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

import Ionicons from '@expo/vector-icons/Ionicons'
import { StackHeaderProps } from '@react-navigation/stack'

import Button from '~/components/buttons/Button'
import BaseHeader, { BaseHeaderProps } from '~/components/headers/BaseHeader'

type StackHeaderCustomProps = StackHeaderProps & BaseHeaderProps

const StackHeader = ({ navigation, options, headerTitle, ...props }: StackHeaderCustomProps) => {
  let HeaderLeft = null

  if (navigation.canGoBack()) {
    HeaderLeft = (
      <Button
        onPress={navigation.goBack}
        Icon={() => <Ionicons name="arrow-back-outline" color="#ffffff" size={26} />}
        round
      />
    )
  }

  return <BaseHeader HeaderLeft={HeaderLeft} headerTitle={headerTitle} {...props} />
}

export default StackHeader