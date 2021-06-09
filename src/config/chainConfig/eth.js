import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

const navLang = navigator.language

export const ETH_MAINNET = process.env.NODE_ENV === 'development' ? process.env.REACT_APP_NETWORK_URL : 'https://ethmainnet.anyswap.exchange'
export const ETH_MAIN_CHAINID = 1
export const ETH_MAIN_EXPLORER = navLang === 'zh-CN' ? 'https://cn.etherscan.com' : 'https://etherscan.io'

export const ETH_TESTNET = 'https://rinkeby.infura.io/v3/0e40cfd5e7a64b2d9aea8427e4bd52a0'
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
    bridgeInitToken: '0x332730a4f6e03d9c55829435f10360e13cfa41ff',
    bridgeRouterToken: '0xa649325aa7c5093d12d6f98eb4378deae68ce23f',
    bridgeInitChain: '97',
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