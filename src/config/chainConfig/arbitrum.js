import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const ARBITRUM_MAINNET = 'https://arb-mainnet.g.alchemy.com/v2/u04Uw5dp98OohbK6fylEVaEd2OD2Rxaj'
export const ARBITRUM_MAIN_CHAINID = 42161
export const ARBITRUM_MAIN_EXPLORER = 'https://mainnet-arb-explorer.netlify.app'

export const ARBITRUM_TESTNET = 'https://kovan4.arbitrum.io/rpc'
export const ARBITRUM_TEST_CHAINID = 212984383488152
export const ARBITRUM_TEST_EXPLORER = 'https://explorer.arbitrum.io/#/'

export const tokenList = []

const symbol = 'ETH'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeRouterToken: '',
    bridgeInitChain: ''
  },
  [VERSION.V3]: {
    bridgeInitToken: '0x461d52769884ca6235b685ef2040f47d30c94eb5',
    bridgeRouterToken: '0x2bf9b864cdc97b08b6d79ad4663e71b8ab65c45c',
    bridgeInitChain: '1',
    nativeToken: '0x461d52769884ca6235b685ef2040f47d30c94eb5'
  },
}

export default {
  
  [ARBITRUM_MAIN_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + ARBITRUM_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x9e73d56dd1942743ffdf055449b052a806b854be',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: ARBITRUM_MAINNET,
    chainID: ARBITRUM_MAIN_CHAINID,
    lookHash: ARBITRUM_MAIN_EXPLORER + '/tx/',
    lookAddr: ARBITRUM_MAIN_EXPLORER + '/address/',
    lookBlock: ARBITRUM_MAIN_EXPLORER + '/block/',
    explorer: ARBITRUM_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Arbitrum',
    networkName: 'ARBITRUM mainnet',
    networkLogo: 'ARBITRUM',
    type: 'main',
    label: ARBITRUM_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'ARBITRUM',
    anyToken: ''
  },
  [ARBITRUM_TEST_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + ARBITRUM_TEST_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: ARBITRUM_TESTNET,
    chainID: ARBITRUM_TEST_CHAINID,
    lookHash: ARBITRUM_TEST_EXPLORER + '/tx/',
    lookAddr: ARBITRUM_TEST_EXPLORER + '/address/',
    lookBlock: ARBITRUM_TEST_EXPLORER + '/block/',
    explorer: ARBITRUM_TEST_EXPLORER,
    symbol: symbol,
    name: 'Arbitrum',
    networkName: 'ARBITRUM mainnet',
    networkLogo: 'ARBITRUM',
    type: 'main',
    label: ARBITRUM_TEST_CHAINID,
    isSwitch: 1,
    suffix: 'ARBITRUM'
  },
}