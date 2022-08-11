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

import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { clamp } from 'lodash'
import { memo } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import Animated, {
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming
} from 'react-native-reanimated'
import styled from 'styled-components/native'

import { useInWalletLayoutContext } from '../contexts/InWalletLayoutContext'
import { BORDER_RADIUS } from '../style/globalStyle'
import FooterMenuItem from './FooterMenuItem'

interface FooterMenuProps extends BottomTabBarProps {
  style?: StyleProp<ViewStyle>
}

const footerDistanceFromBottom = 35
const footerMenuItemsPadding = 5
const footerTabHeight = 60

const totalFooterHeight = footerMenuItemsPadding * 2 + footerTabHeight
const topFooterPosition = footerDistanceFromBottom + totalFooterHeight

const scrollRange = [0, 80]
const translateRange = [0, topFooterPosition]

const FooterMenu = ({ state, descriptors, navigation, style }: FooterMenuProps) => {
  const { scrollY } = useInWalletLayoutContext()

  const scrollDirection = useSharedValue<'up' | 'down'>('down')

  const lastScrollY = useSharedValue(0)
  const lastTranslateY = useSharedValue(0)

  const translateYValue = useDerivedValue(() => {
    if (scrollY === undefined) return 0

    let value = lastTranslateY.value

    if (scrollDirection.value === 'down' && lastScrollY.value > scrollY.value) {
      scrollDirection.value = 'up'
    }

    if (scrollDirection.value === 'up' && lastScrollY.value < scrollY.value) {
      scrollDirection.value = 'down'
    }

    if (scrollDirection.value === 'up') {
      // Always show the footer when scrolling up.
      value = scrollRange[0]
    } else if (scrollDirection.value === 'down') {
      value =
        value >= scrollRange[0] && value <= scrollRange[1] // value is within range
          ? value + (scrollY.value - lastScrollY.value) // move it according to scrolled distance
          : clamp(value, scrollRange[0], scrollRange[1]) // avoid overshooting

      // Completely hide the footer when it touches the bottom of the screen
      if (scrollY.value > footerDistanceFromBottom * (scrollRange[1] / translateRange[1])) {
        value = scrollRange[1]
      }
    }

    lastScrollY.value = scrollY.value
    lastTranslateY.value = value

    return value
  })

  const footerStyle = useAnimatedStyle(() => {
    const translateY = withTiming(interpolate(translateYValue.value, scrollRange, translateRange), {
      duration: 100
    })

    return {
      transform: [{ translateY }]
    }
  })

  return (
    <Animated.View style={[style, footerStyle]}>
      <MenuItems>
        {state.routes.map((route, index) => (
          <FooterMenuItem
            options={descriptors[route.key].options}
            isFocused={state.index === index}
            routeName={route.name}
            target={route.key}
            navigation={navigation}
            height={footerTabHeight}
            key={route.name}
          />
        ))}
      </MenuItems>
    </Animated.View>
  )
}

export default memo(styled(FooterMenu)`
  position: absolute;
  bottom: ${footerDistanceFromBottom}px;
  width: 100%;
  align-items: center;
`)

const MenuItems = styled.View`
  width: 75%;
  max-width: 350px;
  min-width: 300px;
  flex-direction: row;
  background-color: ${({ theme }) => theme.bg.primary};
  border-radius: ${BORDER_RADIUS}px;
  ${({ theme }) => theme.shadow.tertiary};
  padding: ${footerMenuItemsPadding}px;
`
