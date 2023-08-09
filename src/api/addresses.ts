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

import { explorer } from '@alephium/web3'
import dayjs from 'dayjs'

import client from '~/api/client'
import {
  Address,
  AddressBalancesSyncResult,
  AddressesHistoricalBalanceResult,
  AddressHash,
  AddressTokensSyncResult,
  AddressTransactionsSyncResult
} from '~/types/addresses'
import { CHART_DATE_FORMAT } from '~/utils/constants'

export const fetchAddressesTokens = async (addressHashes: AddressHash[]): Promise<AddressTokensSyncResult[]> => {
  const results = []
  let pageTotalResults
  let page = 1

  for (const hash of addressHashes) {
    const tokenBalances = []

    while (pageTotalResults === undefined || pageTotalResults === 100) {
      const pageResults = await client.explorer.addresses.getAddressesAddressTokensBalance(hash, { limit: 100, page })

      tokenBalances.push(...pageResults)

      pageTotalResults = pageResults.length
      page += 1
    }

    results.push({
      hash,
      tokenBalances
    })
  }

  return results
}

export const fetchAddressesTransactions = async (
  addressHashes: AddressHash[]
): Promise<AddressTransactionsSyncResult[]> => {
  const results = []

  for (const addressHash of addressHashes) {
    const txNumber = await client.explorer.addresses.getAddressesAddressTotalTransactions(addressHash)
    const transactions = await client.explorer.addresses.getAddressesAddressTransactions(addressHash, { page: 1 })
    const mempoolTransactions = await client.explorer.addresses.getAddressesAddressMempoolTransactions(addressHash)

    results.push({
      hash: addressHash,
      txNumber,
      transactions,
      mempoolTransactions
    })
  }

  return results
}

export const fetchAddressesBalances = async (addressHashes: AddressHash[]): Promise<AddressBalancesSyncResult[]> => {
  const results = []

  for (const addressHash of addressHashes) {
    const balances = await client.explorer.addresses.getAddressesAddressBalance(addressHash)

    results.push({
      hash: addressHash,
      ...balances
    })
  }

  return results
}

// TODO: Same as in desktop wallet, move to SDK?
export const fetchAddressTransactionsNextPage = async (address: Address) => {
  let nextPage = address.transactionsPageLoaded
  let nextPageTransactions = [] as explorer.Transaction[]

  if (!address.allTransactionPagesLoaded) {
    nextPage += 1
    nextPageTransactions = await client.explorer.addresses.getAddressesAddressTransactions(address.hash, {
      page: nextPage
    })
  }

  return {
    hash: address.hash,
    transactions: nextPageTransactions,
    page: nextPage
  }
}

// TODO: Same as in desktop wallet, move to SDK?
export const fetchAddressesTransactionsNextPage = async (addresses: Address[], nextPage: number) => {
  const addressHashes = addresses.filter((address) => !address.allTransactionPagesLoaded).map((address) => address.hash)
  const transactions = await client.explorer.addresses.postAddressesTransactions({ page: nextPage }, addressHashes)

  return transactions
}

export const fetchAddressesHistoricalBalances = async (
  addresssHashes: AddressHash[]
): Promise<AddressesHistoricalBalanceResult> => {
  const addressesBalances = []
  const now = dayjs()
  const thisMoment = now.valueOf()
  const oneYearAgo = now.subtract(12, 'month').valueOf()

  for (const addressHash of addresssHashes) {
    const balances = []
    const data = await client.explorer.addresses.getAddressesAddressAmountHistory(
      addressHash,
      { fromTs: oneYearAgo, toTs: thisMoment, 'interval-type': explorer.IntervalType.Daily },
      { format: 'text' }
    )

    try {
      const { amountHistory } = JSON.parse(data)

      for (const [timestamp, balance] of amountHistory) {
        balances.push({
          date: dayjs(timestamp).format(CHART_DATE_FORMAT),
          balance: BigInt(balance).toString()
        })
      }
    } catch (e) {
      console.error('Could not parse amount history data', e)
    }

    addressesBalances.push({
      address: addressHash,
      balances
    })
  }

  return addressesBalances
}
