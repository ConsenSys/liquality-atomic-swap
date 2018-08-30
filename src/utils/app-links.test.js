/* eslint-env jest */
import { generateLink, generateSwapState } from './app-links'

it('generates correct own link', () => {
  const swapState = {
    assets: {
      a: { currency: 'eth', value: 50 },
      b: { currency: 'btc', value: 10 }
    },
    wallets: {
      a: { addresses: ['0xe66D664507EF1251fC6B8cCf1fD1684274A3e9e3'] },
      b: { addresses: ['12wghKSUJCEgwwQjAuLVHoHuqZ18pPCjUK'] }
    },
    counterParty: {
      eth: { address: '0x3461e2e8a76a0554c8dC62cF42d8C75A333319EB' },
      btc: { address: '19xQT3DfkTzVp7w6hoHP2d2zhra8mGHzn3' }
    },
    transactions: {
      a: { fund: { hash: '0xd2e451e21d625564844d5aa74c9a0a4c9b5a607303ccd738e95dbea83cec9304' } },
      b: { fund: {} }
    }
  }

  expect(generateLink(swapState)).toBe('http://localhost/#aFundHash=0xd2e451e21d625564844d5aa74c9a0a4c9b5a607303ccd738e95dbea83cec9304&ccy1=eth&ccy1Addr=0xe66D664507EF1251fC6B8cCf1fD1684274A3e9e3&ccy1CounterPartyAddr=0x3461e2e8a76a0554c8dC62cF42d8C75A333319EB&ccy1v=50&ccy2=btc&ccy2Addr=12wghKSUJCEgwwQjAuLVHoHuqZ18pPCjUK&ccy2CounterPartyAddr=19xQT3DfkTzVp7w6hoHP2d2zhra8mGHzn3&ccy2v=10&isPartyB=false&secretHash=secrethash')
})

it('generates correct counter party link', () => {
  const swapState = {
    assets: {
      a: { currency: 'eth', value: 50 },
      b: { currency: 'btc', value: 10 }
    },
    wallets: {
      a: { addresses: ['0xe66D664507EF1251fC6B8cCf1fD1684274A3e9e3'] },
      b: { addresses: ['12wghKSUJCEgwwQjAuLVHoHuqZ18pPCjUK'] }
    },
    counterParty: {
      eth: { address: '0x3461e2e8a76a0554c8dC62cF42d8C75A333319EB' },
      btc: { address: '19xQT3DfkTzVp7w6hoHP2d2zhra8mGHzn3' }
    },
    transactions: {
      a: { fund: { hash: '0xd2e451e21d625564844d5aa74c9a0a4c9b5a607303ccd738e95dbea83cec9304' } },
      b: { fund: {} }
    }
  }

  expect(generateLink(swapState, true)).toBe('http://localhost/#bFundHash=0xd2e451e21d625564844d5aa74c9a0a4c9b5a607303ccd738e95dbea83cec9304&ccy1=btc&ccy1Addr=19xQT3DfkTzVp7w6hoHP2d2zhra8mGHzn3&ccy1CounterPartyAddr=12wghKSUJCEgwwQjAuLVHoHuqZ18pPCjUK&ccy1v=10&ccy2=eth&ccy2Addr=0x3461e2e8a76a0554c8dC62cF42d8C75A333319EB&ccy2CounterPartyAddr=0xe66D664507EF1251fC6B8cCf1fD1684274A3e9e3&ccy2v=50&isPartyB=true&secretHash=secrethash')
})

it('generates correct swap state', () => {
  const swapState = {
    assets: {
      a: { currency: 'eth', value: 50 },
      b: { currency: 'btc', value: 10 }
    },
    wallets: {
      a: { addresses: ['0xe66D664507EF1251fC6B8cCf1fD1684274A3e9e3'] },
      b: { addresses: ['12wghKSUJCEgwwQjAuLVHoHuqZ18pPCjUK'] }
    },
    counterParty: {
      eth: { address: '0x3461e2e8a76a0554c8dC62cF42d8C75A333319EB' },
      btc: { address: '19xQT3DfkTzVp7w6hoHP2d2zhra8mGHzn3' }
    },
    transactions: {
      a: { fund: { hash: '0xd2e451e21d625564844d5aa74c9a0a4c9b5a607303ccd738e95dbea83cec9304' }, claim: {} },
      b: { fund: {}, claim: {} }
    },
    isPartyB: false
  }

  expect(generateSwapState({hash: '#aFundHash=0xd2e451e21d625564844d5aa74c9a0a4c9b5a607303ccd738e95dbea83cec9304&ccy1=eth&ccy1Addr=0xe66D664507EF1251fC6B8cCf1fD1684274A3e9e3&ccy1CounterPartyAddr=0x3461e2e8a76a0554c8dC62cF42d8C75A333319EB&ccy1v=50&ccy2=btc&ccy2Addr=12wghKSUJCEgwwQjAuLVHoHuqZ18pPCjUK&ccy2CounterPartyAddr=19xQT3DfkTzVp7w6hoHP2d2zhra8mGHzn3&ccy2v=10&isPartyB=false&secretHash=secrethash'})).toEqual(swapState)
})
