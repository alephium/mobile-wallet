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
import { area, curveCatmullRom, line } from 'd3-shape'
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg'
import { useTheme } from 'styled-components/native'

type Point = [number, number]
type ChartData = Point[]

interface LineChartProps {
  data: ChartData
  width: number
  height: number
}

const strokeWidth = 7

export const fakeData: ChartData = new Array(Math.round(Math.random() * 100))
  .fill([0, 0])
  .map(([x, y], index) => [index, 100 - (index * 2 + Math.round(Math.random() * 100 - 50))])

const LineChart = ({ data, width, height }: LineChartProps) => {
  const theme = useTheme()

  const limits = {
    x: [0, data.reduce((acc, [x]) => Math.max(acc, x), 0)],
    y: [0, data.reduce((acc, [, y]) => Math.max(acc, y), 0)]
  }
  limits.x[0] = data.reduce((acc, [x]) => Math.min(acc, x), limits.x[1])
  limits.y[0] = data.reduce((acc, [, y]) => Math.min(acc, y), limits.y[1])

  const scale = {
    x: scaleLinear(limits.x, [strokeWidth, width]),
    y: scaleLinear(limits.y, [-strokeWidth, height])
  }

  const makeLine = line()
    .x((d: Point) => scale.x(d[0]))
    .y((d: Point) => scale.y(d[1]))
    .curve(curveCatmullRom.alpha(0.5))

  const makeArea = area()
    .x((d: Point) => scale.x(d[0]))
    .y1((d: Point) => scale.y(d[1]))
    .y0((d: Point) => scale.y(limits.y[1]))
    .curve(curveCatmullRom.alpha(0.5))

  return (
    <Svg width={width} height={height}>
      <Defs>
        <LinearGradient id="lineGradient">
          <Stop offset="0%" stopColor="#FFCD82" />
          <Stop offset="25%" stopColor="#F95B50" />
          <Stop offset="50%" stopColor="#EA3D74" />
          <Stop offset="75%" stopColor="#6A5DF8" />
          <Stop offset="100%" stopColor="#49D2ED" />
        </LinearGradient>
        <LinearGradient id="areaGradient" gradientTransform="rotate(90)">
          <Stop offset="0%" stopColor="#FFCD82" />
          <Stop offset="50%" stopColor={theme.bg.secondary} />
        </LinearGradient>
      </Defs>
      <Path
        d={makeLine(data) || ''}
        fill="none"
        stroke="url(#lineGradient)"
        strokeLinecap="round"
        strokeWidth={strokeWidth}
      />
      <Path d={makeArea(data) || ''} stroke="none" fill="url(#areaGradient)" strokeWidth="0" />
    </Svg>
  )
}

export default LineChart
