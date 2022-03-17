import { ChainId, JSBI, Percent, Token, WETH } from 'anyswap-sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

// import { injected, terra } from '../connectors'
// import { injected, walletconnect, walletlink } from '../connectors'
import { injected, walletconnect } from '../connectors'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const EVM_ADDRESS_REGEXP = /^0x[A-Fa-f0-9]{40}$/

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const STORAGE_METHODS = {
  getData: 'getData',
  setKeyData: 'setKeyData',
  clearKeyData: 'clearKeyData'
}
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
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  OKEXCHAIN: {
    connector: injected,
    name: 'OKEx',
    iconName: 'OKT.png',
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
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  }
  // WALLET_LINK: {
  //   connector: walletlink,
  //   name: 'Coinbase Wallet',
  //   iconName: 'coinbaseWalletIcon.svg',
  //   description: 'Use Coinbase Wallet app on mobile device',
  //   href: null,
  //   color: '#315CF5'
  // },
  // BITKEEP: {
  //   connector: injected,
  //   name: 'BitKeep',
  //   iconName: 'BitKeep.jpg',
  //   description: 'Easy-to-use browser extension.',
  //   href: null,
  //   color: '#E8831D'
  // },
  // TERRA: {
  //   connector: terra,
  //   name: 'Terra',
  //   iconName: 'TERRA.png',
  //   description: 'Easy-to-use browser extension.',
  //   href: null,
  //   color: '#E8831D'
  // },
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

// used for rewards deadlines
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7)

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
// export const BETTER_TRADE_LESS_HOPS_THRESHOLD = new Percent(JSBI.BigInt(50), JSBI.BigInt(10000))
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))

export const ZERO_PERCENT = new Percent('0')
export const ONE_HUNDRED_PERCENT = new Percent('1')

// TODO: SDK should have two maps, WETH map and WNATIVE map.
const WRAPPED_NATIVE_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.ROPSTEN]: [WETH[ChainId.ROPSTEN]],
  [ChainId.RINKEBY]: [WETH[ChainId.RINKEBY]],
  [ChainId.GÖRLI]: [WETH[ChainId.GÖRLI]],
  [ChainId.KOVAN]: [WETH[ChainId.KOVAN]],
  [ChainId.HTTEST]: [WETH[ChainId.HTTEST]],
  [ChainId.HTMAIN]: [WETH[ChainId.HTMAIN]],
  [ChainId.FTMMAIN]: [WETH[ChainId.FTMMAIN]],
  [ChainId.MATICMAIN]: [WETH[ChainId.MATICMAIN]],
  [ChainId.XDAIMAIN]: [WETH[ChainId.XDAIMAIN]],
  [ChainId.BNBMAIN]: [WETH[ChainId.BNBMAIN]],
  [ChainId.BNBTEST]: [WETH[ChainId.BNBTEST]],
  [ChainId.OKEX]: [WETH[ChainId.OKEX]],
  [ChainId.HARMONY]: [WETH[ChainId.HARMONY]],
  [ChainId.AVALANCHE]: [WETH[ChainId.AVALANCHE]]
  // [ChainId.ARBITRUM]: [WETH[ChainId.ARBITRUM]],
  // [ChainId.AVALANCHE]: [WETH[ChainId.AVALANCHE]],
}

// Default Ethereum chain tokens
export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD Coin')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 8, 'WBTC', 'Wrapped BTC')
export const RUNE = new Token(ChainId.MAINNET, '0x3155BA85D5F96b2d030a4966AF206230e46849cb', 18, 'RUNE', 'RUNE.ETH')

export const BSC: { [key: string]: Token } = {
  DAI: new Token(ChainId.BNBMAIN, '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3', 18, 'DAI', 'Dai Stablecoin'),
  USD: new Token(ChainId.BNBMAIN, '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56', 18, 'BUSD', 'Binance USD'),
  USDC: new Token(ChainId.BNBMAIN, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', 18, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.BNBMAIN, '0x55d398326f99059fF775485246999027B3197955', 18, 'USDT', 'Tether USD'),
  BTCB: new Token(ChainId.BNBMAIN, '0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c', 18, 'BTCB', 'Bitcoin')
}

export const FANTOM: { [key: string]: Token } = {
  USDC: new Token(ChainId.FTMMAIN, '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6, 'USDC', 'USD Coin'),
  WBTC: new Token(ChainId.FTMMAIN, '0x321162Cd933E2Be498Cd2267a90534A804051b11', 8, 'WBTC', 'Wrapped Bitcoin'),
  DAI: new Token(ChainId.FTMMAIN, '0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E', 18, 'DAI', 'Dai Stablecoin'),
  WETH: new Token(ChainId.FTMMAIN, '0x74b23882a30290451A17c44f4F05243b6b58C76d', 18, 'WETH', 'Wrapped Ether')
}

export const MATIC: { [key: string]: Token } = {
  USDC: new Token(ChainId.MATICMAIN, '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 6, 'USDC', 'USD Coin'),
  WBTC: new Token(ChainId.MATICMAIN, '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6', 8, 'WBTC', 'Wrapped Bitcoin'),
  DAI: new Token(ChainId.MATICMAIN, '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063', 18, 'DAI', 'Dai Stablecoin'),
  WETH: new Token(ChainId.MATICMAIN, '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619', 18, 'WETH', 'Wrapped Ether'),
  USDT: new Token(ChainId.MATICMAIN, '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', 6, 'USDT', 'Tether USD'),
  TEL: new Token(ChainId.MATICMAIN, '0xdF7837DE1F2Fa4631D716CF2502f8b230F1dcc32', 2, 'TEL', 'Telcoin'),
  SUSHI: new Token(ChainId.MATICMAIN, '0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a', 18, 'SUSHI', 'SushiToken'),
  AAVE: new Token(ChainId.MATICMAIN, '0xD6DF932A45C0f255f85145f286eA0b292B21C90B', 18, 'AAVE', 'Aave'),
  FRAX: new Token(ChainId.MATICMAIN, '0x104592a158490a9228070E0A8e5343B499e125D0', 18, 'FRAX', 'Frax'),
  FXS: new Token(ChainId.MATICMAIN, '0x3e121107F6F22DA4911079845a470757aF4e1A1b', 18, 'FXS', 'Frax Share'),
  DMAGIC: new Token(ChainId.MATICMAIN, '0x61dAECaB65EE2A1D5b6032df030f3fAA3d116Aa7', 18, 'DMAGIC', 'Dark Magic'),
  DRAX: new Token(ChainId.MATICMAIN, '0x1Ba3510A9ceEb72E5CdBa8bcdDe9647E1f20fB4b', 18, 'DRAX', 'Drax')
}

export const OKEX: { [key: string]: Token } = {
  DAI: new Token(ChainId.OKEX, '0x21cDE7E32a6CAF4742d00d44B07279e7596d26B9', 18, 'DAI', 'Dai Stablecoin'),
  USDC: new Token(ChainId.OKEX, '0xc946DAf81b08146B1C7A8Da2A851Ddf2B3EAaf85', 18, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.OKEX, '0x382bB369d343125BfB2117af9c149795C6C65C50', 18, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.OKEX, '0x506f731F7656e2FB34b587B912808f2a7aB640BD', 18, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.OKEX, '0xEF71CA2EE68F45B9Ad6F72fbdb33d707b872315C', 18, 'WETH', 'Wrapped Ether')
}

export const HECO: { [key: string]: Token } = {
  DAI: new Token(ChainId.HTMAIN, '0x3D760a45D0887DFD89A2F5385a236B29Cb46ED2a', 18, 'DAI', 'Dai Stablecoin'),
  USDC: new Token(ChainId.HTMAIN, '0x9362Bbef4B8313A8Aa9f0c9808B80577Aa26B73B', 18, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.HTMAIN, '0xa71EdC38d189767582C38A3145b5873052c3e47a', 18, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.HTMAIN, '0x66a79D23E58475D2738179Ca52cd0b41d73f0BEa', 18, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.HTMAIN, '0x64FF637fB478863B7468bc97D30a5bF3A428a1fD', 18, 'WETH', 'Wrapped Ether')
}

export const HARMONY: { [key: string]: Token } = {
  DAI: new Token(ChainId.HARMONY, '0xEf977d2f931C1978Db5F6747666fa1eACB0d0339', 18, 'DAI', 'Dai Stablecoin'),
  USDC: new Token(ChainId.HARMONY, '0x985458E523dB3d53125813eD68c274899e9DfAb4', 6, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.HARMONY, '0x3C2B8Be99c50593081EAA2A724F0B8285F5aba8f', 6, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.HARMONY, '0x3095c7557bCb296ccc6e363DE01b760bA031F2d9', 8, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.HARMONY, '0x6983D1E6DEf3690C4d616b13597A09e6193EA013', 18, 'WETH', 'Wrapped Ether')
}

export const XDAI: { [key: string]: Token } = {
  USDC: new Token(ChainId.XDAIMAIN, '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83', 6, 'USDC', 'USD Coin'),
  USDT: new Token(ChainId.XDAIMAIN, '0x4ECaBa5870353805a9F068101A40E0f32ed605C6', 6, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.XDAIMAIN, '0x8e5bBbb09Ed1ebdE8674Cda39A0c169401db4252', 8, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.XDAIMAIN, '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1', 18, 'WETH', 'Wrapped Ether')
}

export const AVALANCHE: { [key: string]: Token } = {
  DAI: new Token(ChainId.AVALANCHE, '0xbA7dEebBFC5fA1100Fb055a87773e1E99Cd3507a', 18, 'DAI', 'Dai Stablecoin'),
  USDT: new Token(ChainId.AVALANCHE, '0xde3A24028580884448a5397872046a019649b084', 6, 'USDT', 'Tether USD'),
  WBTC: new Token(ChainId.AVALANCHE, '0x408D4cD0ADb7ceBd1F1A1C33A0Ba2098E1295bAB', 8, 'WBTC', 'Wrapped Bitcoin'),
  WETH: new Token(ChainId.AVALANCHE, '0xf20d962a6c8f70c731bd838a3a388D7d48fA6e15', 18, 'WETH', 'Wrapped Ether')
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WRAPPED_NATIVE_ONLY,
  [ChainId.MAINNET]: [...WRAPPED_NATIVE_ONLY[ChainId.MAINNET], DAI, USDC, USDT, COMP, MKR, WBTC, RUNE],
  [ChainId.FTMMAIN]: [...WRAPPED_NATIVE_ONLY[ChainId.FTMMAIN], FANTOM.DAI, FANTOM.USDC, FANTOM.WBTC, FANTOM.WETH],
  [ChainId.BNBMAIN]: [...WRAPPED_NATIVE_ONLY[ChainId.BNBMAIN], BSC.DAI, BSC.USD, BSC.USDC, BSC.USDT, BSC.BTCB],
  [ChainId.MATICMAIN]: [
    ...WRAPPED_NATIVE_ONLY[ChainId.MATICMAIN],
    MATIC.USDC,
    MATIC.WBTC,
    MATIC.DAI,
    MATIC.WETH,
    MATIC.USDT,
    MATIC.TEL,
    MATIC.SUSHI,
    MATIC.AAVE,
    MATIC.FRAX,
    MATIC.FXS,
    MATIC.DMAGIC,
    MATIC.DRAX
  ],
  [ChainId.HTMAIN]: [...WRAPPED_NATIVE_ONLY[ChainId.HTMAIN], HECO.USDC, HECO.DAI, HECO.USDT, HECO.WBTC, HECO.WETH],
  [ChainId.XDAIMAIN]: [...WRAPPED_NATIVE_ONLY[ChainId.XDAIMAIN], XDAI.USDC, XDAI.USDT, XDAI.WBTC, XDAI.WETH]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
    // [DUCK.address]: [USDP, WETH[ChainId.MAINNET]],
    // [BAB.address]: [BAC, WETH[ChainId.MAINNET]],
    // [HBTC.address]: [CREAM, WETH[ChainId.MAINNET]],
    // [FRAX.address]: [FXS, WETH[ChainId.MAINNET]],
    // [IBETH.address]: [ALPHA, WETH[ChainId.MAINNET]],
    // [PONT.address]: [PWING, WETH[ChainId.MAINNET]]
  }
}
