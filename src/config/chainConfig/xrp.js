import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const XRP_MAINNET = ''
export const XRP_MAIN_CHAINID = ChainId.XRP
export const XRP_MAIN_EXPLORER = 'https://xrpscan.com'

export const XRP_TESTNET = ''
export const XRP_TEST_CHAINID = ChainId.XRP_TEST
export const XRP_TEST_EXPLORER = 'https://xrpscan.com'

const symbol = 'XRP'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  },
  [VERSION.V7]: {
    bridgeInitToken: 'xrp',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: 'XRP'
  },
}

export default {
  [XRP_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: XRP_MAINNET,
    nodeRpcList: [],
    chainID: XRP_MAIN_CHAINID,
    lookHash: XRP_MAIN_EXPLORER + '/tx/',
    lookAddr: XRP_MAIN_EXPLORER + '/account/',
    lookBlock: XRP_MAIN_EXPLORER + '/block/',
    explorer: XRP_MAIN_EXPLORER,
    symbol: symbol,
    name: 'XRP Ledger',
    networkName: 'XRP Ledger mainnet',
    networkLogo: 'XRP',
    type: 'main',
    label: XRP_MAIN_CHAINID,
    chainType: 'NOWALLET'
  },
  [XRP_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: XRP_TESTNET,
    chainID: XRP_TEST_CHAINID,
    nodeRpcList: [],
    lookHash: XRP_TEST_EXPLORER + '/tx/',
    lookAddr: XRP_TEST_EXPLORER + '/account/',
    lookBlock: XRP_TEST_EXPLORER + '/block/',
    explorer: XRP_TEST_EXPLORER,
    symbol: symbol,
    name: 'XRP Ledger',
    networkName: 'XRP Ledger testnet',
    networkLogo: 'XRP',
    type: 'test',
    label: XRP_TEST_CHAINID,
    chainType: 'NOWALLET'
  },
}