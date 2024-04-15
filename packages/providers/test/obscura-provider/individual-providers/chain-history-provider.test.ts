import { Mina } from '@palladxyz/mina-core'

import { Obscura } from '../../../src'

const nodeUrl =
  process.env['ARCHIVE_OBSCURA_URL'] ||
  'https://mina-berkeley.obscura.build/v1/bfce6350-4f7a-4b63-be9b-8981dec92050/graphql'
const publicKey =
  process.env['PUBLIC_KEY'] ||
  'B62qkAqbeE4h1M5hop288jtVYxK1MsHVMMcBpaWo8qdsAztgXaHH1xq'

describe.skip('Obscura Chain History Provider (Functional)', () => {
  let provider: ReturnType<typeof Obscura.createChainHistoryProvider>

  beforeEach(() => {
    provider = Obscura.createChainHistoryProvider(nodeUrl)
  })

  describe('healthCheck', () => {
    it('should return a health check response', async () => {
      // This test depends on the actual response from the server
      const response = await provider.healthCheck()
      expect(response.ok).toBe(true)
    })
  })

  describe('transactionsByAddresses', () => {
    it('should return transaction history for a public key', async () => {
      // This test now depends on the actual response from the server
      const response = (await provider.transactionsByAddresses({
        addresses: [publicKey]
      })) as Mina.TransactionBody[]
      // TODO: check why pageResults is undefined

      // TODO: investigate pagination
      const transaction = response[0]

      expect(transaction).toHaveProperty('amount')
      expect(transaction).toHaveProperty('blockHeight')
      expect(transaction).toHaveProperty('dateTime')
      expect(transaction).toHaveProperty('failureReason')
      expect(transaction).toHaveProperty('fee')
      expect(transaction).toHaveProperty('from')
      expect(transaction).toHaveProperty('hash')
      expect(transaction).toHaveProperty('isDelegation')
      expect(transaction).toHaveProperty('kind')
      expect(transaction).toHaveProperty('to')
      expect(transaction).toHaveProperty('token')
    })
  })

  //TODO: Other tests...
})
