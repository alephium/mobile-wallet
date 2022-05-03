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

import { Address } from '../contexts/addresses'

export const checkAddressValidity = (address: string) => {
  const match = address.match(/^[1-9A-HJ-NP-Za-km-z]+$/)

  return match === null ? false : match[0] === address && address
}

export const sortAddressList = (addresses: Address[]): Address[] =>
  addresses.sort((a, b) => {
    // Always keep main address to the top of the list
    if (a.settings.isMain) return -1
    if (b.settings.isMain) return 1
    return (b.lastUsed ?? 0) - (a.lastUsed ?? 0)
  })
