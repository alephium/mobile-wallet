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

import { scaleLinear } from 'd3-scale'
import { useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import Svg, { Circle, Line, Rect, Text } from 'react-native-svg'
import { useTheme } from 'styled-components/native'

import { formatFiatAmountForDisplay } from '../../utils/numbers'

const padding = {
  left: 50,
  bottom: 50,
  fromCenterLine: 8,
  right: 32,
  yLabelBottom: 8,
  barText: 6,
  selectText: 8
}

const bar = {
  radius: 4,
  width: 11
}

type Point = [number, number]
type ChartData = Point[]

interface Dimensions {
  width: number
  height: number
  x: number
  y: number
}

interface BarChartProps {
  data: ChartData
  width: number
  height: number
}

export const fakeData: ChartData = new Array(10)
  .fill([0, 0])
  .map(([x, y], index) => [Math.floor((index + 1) * 1000 * 60 * 60 * 24 * 30), Math.round(Math.random() * 2000) - 1000])

const BarChart = ({ data, width, height }: BarChartProps) => {
  const theme = useTheme()
  const [selectedIndex, setSelectedIndex] = useState<number>()

  const hh = height / 2

  const onBarPress = (index: number) => () => {
    setSelectedIndex(selectedIndex == index ? undefined : index)
  }

  const limits = {
    x: [0, data.reduce((acc, [x]) => Math.max(acc, x), 0)],
    y: [
      -data.reduce((acc, [, y]) => Math.max(acc, Math.abs(y)), 0),
      data.reduce((acc, [, y]) => Math.max(acc, Math.abs(y)), 0)
    ]
  }

  limits.x[0] = data.reduce((acc, [x]) => Math.min(acc, x), limits.x[1])

  const scale = {
    x: scaleLinear(limits.x, [padding.left, width - bar.width - padding.right]),
    y: scaleLinear(limits.y, [
      hh * -1 + (padding.bottom + padding.fromCenterLine),
      hh - (padding.bottom + padding.fromCenterLine)
    ])
  }

  const [xLabelDims, setXLabelDims] = useState<Dimensions[]>([])
  const [selectLabelDims, setSelectLabelDims] = useState<Dimensions>({ x: 0, y: 0, width: 0, height: 0 })

  const onXLabelLayout = (index: number) => (event: LayoutChangeEvent) => {
    const { layout } = event.nativeEvent
    xLabelDims[index] = layout
    setXLabelDims([...xLabelDims])
  }

  const onSelectLabelLayout = (event: LayoutChangeEvent) => {
    const { layout } = event.nativeEvent
    setSelectLabelDims(layout)
  }

  // eslint-disable-next-line react/display-name
  const toBar = (isSelected?: boolean) => (p: Point, index: number) => {
    const x = scale.x(p[0])
    const y = scale.y(p[1])
    return (
      <Rect
        key={'bar' + index}
        onPress={onBarPress(index)}
        fill={isSelected ? theme.global.accent : y > 0 ? theme.global.valid : theme.global.alert}
        x={x}
        y={y < 0 ? hh + padding.fromCenterLine : hh + y * -1 - padding.fromCenterLine}
        width={bar.width}
        height={Math.max(y, y * -1)}
        rx={bar.radius}
      />
    )
  }

  const bars = data.map(toBar())

  let selectedBar = null
  if (selectedIndex) {
    const pSelected = data[selectedIndex]
    const x = scale.x(pSelected[0])
    const dotX = x + bar.width / 2
    const dotY = scale.y(pSelected[1])
    const finalY = dotY < 0 ? hh - padding.fromCenterLine * 1.5 : hh + padding.fromCenterLine * 1.5

    const { width: labelWidth, height: labelHeight } = selectLabelDims

    // Dimensions haven't been measured yet
    if (labelWidth === 0) return null

    const text = formatFiatAmountForDisplay(pSelected[1])
    const textX = x < width / 2 ? x + bar.width * 2 + padding.barText : x - labelWidth - bar.width - padding.barText
    const textY =
      dotY < 0
        ? hh - dotY - padding.fromCenterLine + labelHeight
        : hh - dotY - padding.fromCenterLine + labelHeight + padding.selectText

    selectedBar = (
      <>
        {toBar(true)(data[selectedIndex], selectedIndex)}
        <Circle fill={theme.global.accent} x={dotX} y={finalY} r={4} />
        <Rect
          x={textX - padding.selectText}
          y={textY - padding.selectText - labelHeight}
          width={labelWidth + padding.selectText * 2}
          height={24}
          fill={theme.bg.tertiary}
          rx={4}
        />
        <Text
          onLayout={onSelectLabelLayout}
          x={textX}
          y={textY}
          fill={theme.global.accent}
          fontSize={12}
          fontWeight={600}
        >
          {text}
        </Text>
      </>
    )
  }

  const centerLine = <Line x1={0} x2={width} y1={hh} y2={hh} stroke={'#00000017'} stroke-width={'2'} />

  const yOffset = scale.y(0)

  const ticks = {
    y: scale.y.ticks(4).flatMap((tickValue: number, index: number) => {
      if (tickValue === 0) return [null]
      const yPos = scale.y(tickValue) - yOffset + hh

      return [
        <Line
          key={'line' + index}
          x1={0}
          x2={width}
          y1={yPos}
          y2={yPos}
          stroke={'#00000017'}
          strokeDasharray={'3 3'}
        />,
        <Text
          key={'text' + index}
          x={0}
          y={yPos - padding.yLabelBottom}
          fill={theme.font.tertiary}
          fontSize={12}
          fontWeight={600}
        >
          {' '}
          {(tickValue > 0 ? '-' : '+') + Math.abs(tickValue) + ' $'}
        </Text>
      ]
    }),
    x: scale.x.ticks().map((tickValue: number, index) => {
      if ((index + 1) % 2 == 0) return null

      // Note: during development/runtime this can be undefined for some reason
      if (!data) return null
      if (!data[index]) return null

      const xValue = data[index][0]
      const date = new Date(xValue)
      const text = date.getDay().toString().padStart(2, '0') + '/' + date.getMonth().toString().padStart(2, '0')

      const { width: labelWidth, height: labelHeight } =
        xLabelDims[index] ?? ({ x: 0, y: 0, width: 0, height: 0 } as Dimensions)
      const [x, y] = [scale.x(xValue) + bar.width / 2 - labelWidth / 2, height - labelHeight]

      return (
        <Text
          onLayout={onXLabelLayout(index)}
          key={index}
          fontSize={12}
          fontWeight={600}
          x={x}
          y={y}
          fill={theme.font.tertiary}
        >
          {text}
        </Text>
      )
    })
  }

  return (
    <Svg width={width} height={height}>
      {bars}
      {centerLine}
      {ticks.y}
      {ticks.x}
      {selectedBar}
    </Svg>
  )
}

export default BarChart
