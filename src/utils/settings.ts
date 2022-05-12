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

import { isEqual } from 'lodash'

import { networkPresetSettings } from '../storage/settings'
import { NetworkSettings, NetworkType } from '../types/network'

export const getNetworkName = (settings: NetworkSettings) => {
  return (Object.entries(networkPresetSettings).find(([, presetSettings]) => {
    return isEqual(presetSettings, settings)
  })?.[0] || NetworkType.custom) as NetworkType
}
