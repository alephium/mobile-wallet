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

import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import { useSharedValue } from 'react-native-reanimated'

const scrollDirectionDeltaThreshold = 10

export type ScrollDirection = 'up' | 'down' | undefined

const useVerticalScroll = () => {
  const scrollY = useSharedValue(0)
  const scrollDirection = useSharedValue<ScrollDirection>(undefined)

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newScrollY = e.nativeEvent.contentOffset.y
    const delta = scrollY.value - newScrollY
    const direction = delta > 0 ? 'up' : 'down'

    if (newScrollY === 0) {
      scrollDirection.value = undefined
    } else if (direction === 'up' && delta > scrollDirectionDeltaThreshold) {
      scrollDirection.value = 'up'
    } else if (direction === 'down' && delta < -scrollDirectionDeltaThreshold) {
      scrollDirection.value = 'down'
    }

    scrollY.value = newScrollY
  }

  return { handleScroll, scrollY, scrollDirection }
}

export default useVerticalScroll