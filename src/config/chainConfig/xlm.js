import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const XLM_MAINNET = 'https://horizon.stellar.org/'
export const XLM_MAIN_CHAINID = ChainId.XLM
export const XLM_MAIN_EXPLORER = 'https://steexp.com'

export const XLM_TESTNET = 'https://horizon-testnet.stellar.org/'
export const XLM_TEST_CHAINID = ChainId.XLM_TEST
export const XLM_TEST_EXPLORER = 'https://testnet.steexp.com'

export const tokenList = [

]

const symbol = 'XLM'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [XLM_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + XLM_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: XLM_MAINNET,
    chainID: XLM_MAIN_CHAINID,
    lookHash: XLM_MAIN_EXPLORER + '/tx/',
    lookAddr: XLM_MAIN_EXPLORER + '/account/',
    lookBlock: XLM_MAIN_EXPLORER + '/ledgers/',
    explorer: XLM_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Stellar',
    networkName: 'Stellar mainnet',
    networkLogo: 'XLM',
    type: 'main',
    label: XLM_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'XLM',
    anyToken: '',
    chainType: XLM_MAIN_CHAINID
  },
  [XLM_TEST_CHAINID]: {
    tokenListUrl: tokenListUrl + XLM_TEST_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: XLM_TESTNET,
    chainID: XLM_TEST_CHAINID,
    lookHash: XLM_TEST_EXPLORER + '/tx/',
    lookAddr: XLM_TEST_EXPLORER + '/account/',
    lookBlock: XLM_TEST_EXPLORER + '/ledgers/',
    explorer: XLM_TEST_EXPLORER,
    symbol: symbol,
    name: 'Stellar',
    networkName: 'Stellar testnet',
    networkLogo: 'XLM',
    type: 'test',
    label: XLM_TEST_CHAINID,
    isSwitch: 1,
    suffix: 'XLM',
    anyToken: '',
    chainType: XLM_TEST_CHAINID
  },
}