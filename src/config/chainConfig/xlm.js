import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const XLM_MAINNET = 'https://horizon.stellar.org'
export const XLM_MAIN_CHAINID = ChainId.XLM
export const XLM_MAIN_EXPLORER = 'https://steexp.com'

export const XLM_TESTNET = 'https://horizon-testnet.stellar.org'
export const XLM_TEST_CHAINID = ChainId.XLM_TEST
export const XLM_TEST_EXPLORER = 'https://testnet.steexp.com'

const symbol = 'XLM'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [XLM_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: XLM_MAINNET,
    nodeRpcList: [],
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
    chainType: XLM_MAIN_CHAINID
  },
  [XLM_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: XLM_TESTNET,
    chainID: XLM_TEST_CHAINID,
    nodeRpcList: [],
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
    chainType: XLM_TEST_CHAINID
  },
}