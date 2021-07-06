import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

const navLang = navigator.language

export const ETH_MAINNET = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_NETWORK_URL : 'https://ethmainnet.anyswap.exchange'
export const ETH_MAIN_CHAINID = 1
export const ETH_MAIN_EXPLORER = navLang === 'zh-CN' ? 'https://cn.etherscan.com' : 'https://etherscan.io'

export const ETH_TESTNET = 'https://rinkeby.infura.io/v3/613a4ccfe37f4870a2c3d922e58fa2bd'
export const ETH_TEST_CHAINID = 4
export const ETH_TEST_EXPLORER = 'https://rinkeby.etherscan.io'

export const tokenList = [
  {
    "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "chainId": ETH_MAIN_CHAINID,
    "decimals": 6,
    "name": "USDC",
    "symbol": "USDC"
  }
]
export const testTokenList = [

]

const symbol = 'ETH'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c',
    bridgeRouterToken: '0x765277eebeca2e31912c9946eae1021199b39c61',
    bridgeInitChain: '56'
  },
  [VERSION.V2]: {
    bridgeInitToken: '0x7ea2be2df7ba6e54b1a9c70676f668455e329d29',
    bridgeRouterToken: '0x6b7a87899490ece95443e979ca9485cbe7e71522',
    bridgeInitChain: '56'
  },
  [VERSION.V2_T1]: {
    bridgeInitToken: '0xd4143e8db48a8f73afcdf13d7b3305f28da38116',
    bridgeRouterToken: '0x750bfe8490175c2a9a9387b19aa2aae2d75db638',
    bridgeInitChain: '97'
  },
  [VERSION.V3]: {
    bridgeInitToken: '0x0dcb0cb0120d355cde1ce56040be57add0185baa',
    bridgeRouterToken: '0xdc42728b0ea910349ed3c6e1c9dc06b5fb591f98',
    bridgeInitChain: '42161',
    nativeToken: '0x0dcb0cb0120d355cde1ce56040be57add0185baa'
  },
}

export default {
  [ETH_MAIN_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + ETH_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '0xeefBa1e63905eF1D7ACbA5a8513c70307C1cE441',
    v1FactoryToken: '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95',
    v2FactoryToken: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
    timelock: '0x9a8541Ddf3a932a9A922B607e9CF7301f1d47bD1',
    nodeRpc: ETH_MAINNET,
    chainID: ETH_MAIN_CHAINID,
    lookHash: ETH_MAIN_EXPLORER + '/tx/',
    lookAddr: ETH_MAIN_EXPLORER + '/address/',
    lookBlock: ETH_MAIN_EXPLORER + '/block/',
    explorer: ETH_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Ethereum',
    networkName: 'ETH mainnet',
    type: 'main',
    label: ETH_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'ERC20',
    anyToken: '0xf99d58e463a2e07e5692127302c20a191861b4d6'
  },
  [ETH_TEST_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + ETH_TEST_CHAINID,
    tokenList: formatSwapTokenList(symbol, testTokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: ETH_TESTNET,
    chainID: ETH_TEST_CHAINID,
    lookHash: ETH_TEST_EXPLORER + '/tx/',
    lookAddr: ETH_TEST_EXPLORER + '/address/',
    lookBlock: ETH_TEST_EXPLORER + '/block/',
    explorer: ETH_TEST_EXPLORER,
    symbol: symbol,
    name: 'Ethereum',
    networkName: 'ETH rinkeby',
    type: 'test',
    label: ETH_TEST_CHAINID,
    isSwitch: 1,
    suffix: 'ERC20'
  },
}