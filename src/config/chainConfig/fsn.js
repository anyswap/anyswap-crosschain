import {formatSwapTokenList} from './methods'
import {tokenListUrl} from '../constant'

export const FSN_MAINNET = 'https://mainnet.anyswap.exchange'
export const FSN_MAINNET1 = 'https://mainnet.anyswap.exchange'
export const FSN_MAIN_CHAINID = 32659
export const FSN_MAIN_EXPLORER = 'https://fsnex.com'

// export const FSN_TESTNET = 'https://testnet.anyswap.exchange'
export const FSN_TESTNET = 'https://testnet.fsn.dev/api'
export const FSN_TEST_CHAINID = 46688
export const FSN_TEST_EXPLORER = 'https://fsnex.com'

export const tokenList = [

]
export const testTokenList = [

]

const symbol = 'FSN'

export default {
  [FSN_MAIN_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + FSN_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    bridgeInitToken: '',
    bridgeRouterToken: '',
    bridgeInitChain: '',
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: FSN_MAINNET,
    rpc1: FSN_MAINNET1,
    chainID: FSN_MAIN_CHAINID,
    lookHash: FSN_MAIN_EXPLORER + '/transaction/',
    lookAddr: FSN_MAIN_EXPLORER + '/address/',
    lookBlock: FSN_MAIN_EXPLORER + '/block/',
    explorer: FSN_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Fusion',
    networkName: 'FSN mainnet',
    type: 'main',
    label: FSN_MAIN_CHAINID,
    isSwitch: 1,
    underlying: [],
    suffix: 'Fusion'
  },
  [FSN_TEST_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + FSN_TEST_CHAINID,
    tokenList: formatSwapTokenList(symbol, testTokenList),
    bridgeInitToken: '',
    bridgeRouterToken: '',
    bridgeInitChain: '',
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: FSN_TESTNET,
    chainID: FSN_TEST_CHAINID,
    lookHash: FSN_TEST_EXPLORER + '/transaction/',
    lookAddr: FSN_TEST_EXPLORER + '/address/',
    lookBlock: FSN_TEST_EXPLORER + '/block/',
    explorer: FSN_TEST_EXPLORER,
    symbol: symbol,
    name: 'Fusion',
    networkName: 'ETH testnet',
    type: 'test',
    label: FSN_TEST_CHAINID,
    isSwitch: 1,
    underlying: [],
    suffix: 'Fusion'
  }
}