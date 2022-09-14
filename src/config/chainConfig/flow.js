
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const FLOW_MAINNET = 'https://rest-mainnet.onflow.org/v1/'
export const FLOW_MAIN_CHAINID = ChainId.FLOW
export const FLOW_MAIN_EXPLORER = 'https://flowscan.org'

export const FLOW_TESTNET = 'https://rest-testnet.onflow.org/v1/'
export const FLOW_TEST_CHAINID = ChainId.FLOW_TEST
export const FLOW_TEST_EXPLORER = 'https://testnet.flowscan.org'

const symbol = 'FLOW'

const bridgeToken = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [FLOW_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: FLOW_MAINNET,
    nodeRpcList: [],
    chainID: FLOW_MAIN_CHAINID,
    lookHash: FLOW_MAIN_EXPLORER + '/transaction/',
    lookAddr: FLOW_MAIN_EXPLORER + '/account/',
    lookBlock: FLOW_MAIN_EXPLORER + '/block/',
    explorer: FLOW_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Flow',
    networkName: 'Flow mainnet',
    networkLogo: 'FLOW',
    type: 'main',
    label: FLOW_MAIN_CHAINID,
    chainType: FLOW_MAIN_CHAINID
  },
  [FLOW_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: FLOW_TESTNET,
    nodeRpcList: [],
    chainID: FLOW_TEST_CHAINID,
    lookHash: FLOW_TEST_EXPLORER + '/transaction/',
    lookAddr: FLOW_TEST_EXPLORER + '/account/',
    lookBlock: FLOW_TEST_EXPLORER + '/block/',
    explorer: FLOW_TEST_EXPLORER,
    symbol: symbol,
    name: 'Flow',
    networkName: 'Flow testnet',
    networkLogo: 'FLOW',
    type: 'test',
    label: FLOW_TEST_CHAINID,
    chainType: FLOW_TEST_CHAINID
  },
}