import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const OPTIMISM_MAIN_CHAINID = ''
export const OPTIMISM_MAINNET = getLocalRPC(OPTIMISM_MAIN_CHAINID, '')
export const OPTIMISM_MAIN_EXPLORER = ''

export const OPTIMISM_TEST_CHAINID = 69
export const OPTIMISM_TESTNET = getLocalRPC(OPTIMISM_TEST_CHAINID, 'https://kovan.optimism.io')
export const OPTIMISM_TEST_EXPLORER = 'https://kovan-l2-explorer.surge.sh'

export const tokenList = []

const symbol = 'OPTIMISM'

const bridgeToken = {
  [VERSION.V3]: {
    bridgeInitToken: '0x461d52769884ca6235b685ef2040f47d30c94eb5',
    bridgeInitChain: '1',
    nativeToken: '0x461d52769884ca6235b685ef2040f47d30c94eb5'
  },
  [VERSION.V2_T2]: {
    bridgeInitToken: '',
    bridgeInitChain: '4',
    nativeToken: ''
  },
}

export default {
  
  [OPTIMISM_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + OPTIMISM_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x9e73d56dd1942743ffdf055449b052a806b854be',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: OPTIMISM_MAINNET,
    chainID: OPTIMISM_MAIN_CHAINID,
    lookHash: OPTIMISM_MAIN_EXPLORER + '/tx/',
    lookAddr: OPTIMISM_MAIN_EXPLORER + '/address/',
    lookBlock: OPTIMISM_MAIN_EXPLORER + '/block/',
    explorer: OPTIMISM_MAIN_EXPLORER,
    symbol: symbol,
    name: 'OPTIMISM',
    networkName: 'OPTIMISM mainnet',
    networkLogo: 'OPTIMISM',
    type: 'main',
    label: OPTIMISM_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'OPTIMISM',
    anyToken: ''
  },
  [OPTIMISM_TEST_CHAINID]: {
    tokenListUrl: tokenListUrl + OPTIMISM_TEST_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x332730a4f6e03d9c55829435f10360e13cfa41ff',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: OPTIMISM_TESTNET,
    chainID: OPTIMISM_TEST_CHAINID,
    lookHash: OPTIMISM_TEST_EXPLORER + '/tx/',
    lookAddr: OPTIMISM_TEST_EXPLORER + '/address/',
    lookBlock: OPTIMISM_TEST_EXPLORER + '/block/',
    explorer: OPTIMISM_TEST_EXPLORER,
    symbol: symbol,
    name: 'OPTIMISM',
    networkName: 'OPTIMISM Rinkeby',
    networkLogo: 'OPTIMISM',
    type: 'main',
    label: OPTIMISM_TEST_CHAINID,
    isSwitch: 1,
    suffix: 'OPTIMISM'
  },
}