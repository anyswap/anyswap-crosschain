
import { AbstractConnector } from '@web3-react/abstract-connector'
import JSBI from 'jsbi'
// import { injected, terra } from '../connectors'
import {
  injected,
  walletconnect,
  walletlink,
  bsc,
  clover,
  xdefi,
  gnosissafe,
  bitkeep,
  // tally
} from '../connectors'
// import { injected, walletconnect } from '../connectors'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}
// console.log(injected)
export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  BITKEEP: {
    connector: bitkeep,
    name: 'BitKeep',
    iconName: 'BitKeep.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  tokenpocket: {
    connector: injected,
    name: 'TokenPocket',
    iconName: 'TPT.jpg',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#269964',
  },
  trustwallet: {
    connector: walletconnect,
    name: 'Trust Wallet',
    iconName: 'TWT.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#269964',
  },
  gnosissafe: {
    connector: gnosissafe,
    name: 'Gnosis Safe',
    iconName: 'GnosisSafe.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#269964',
  },
  Binance: {
    connector: bsc,
    name: 'Binance',
    iconName: 'BNB.svg',
    description: 'Login using Binance hosted wallet',
    href: null,
    color: '#F0B90B',
    mobile: true,
  },
  OKEXCHAIN: {
    connector: injected,
    name: 'OKX Wallet',
    iconName: 'OKX.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  COIN98: {
    connector: injected,
    name: 'Coin98',
    iconName: 'Coin98.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  tally: {
    connector: injected,
    name: 'Tally Ho',
    iconName: 'tally.png',
    description: 'Connect to Tally Ho Wallet.',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  Clover: {
    connector: clover,
    name: 'Clover',
    iconName: 'clv.png',
    description: 'Login using Clover hosted wallet',
    href: null,
    color: '#269964',
  },
  Xdefi: {
    // connector: injected,
    connector: xdefi,
    name: 'XDEFI',
    iconName: 'XDEFI.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#269964',
  },
  huobi: {
    connector: walletconnect,
    name: 'Huobi',
    iconName: 'HT.png',
    description: 'Connect to Huobi Wallet.',
    href: null,
    color: '#4196FC',
    mobile: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
// for non expert mode disable swaps above this

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
// export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))

