
import {VERSION, USE_VERSION, CHAIN_TYPE} from '../constant'
import {ChainId} from './chainId'

export const NEAR_MAINNET = 'https://rpc.mainnet.near.org'
export const NEAR_MAIN_CHAINID = ChainId.NEAR
export const NEAR_MAIN_EXPLORER = 'https://nearblocks.io'

export const NEAR_TESTNET = 'https://rpc.testnet.near.org'
export const NEAR_TEST_CHAINID = ChainId.NEAR_TEST
export const NEAR_TEST_EXPLORER = 'https://testnet.nearblocks.io'

const symbol = 'NEAR'

const bridgeToken = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [NEAR_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: NEAR_MAINNET,
    nodeRpcList: [],
    chainID: NEAR_MAIN_CHAINID,
    lookHash: NEAR_MAIN_EXPLORER + '/txns/',
    lookAddr: NEAR_MAIN_EXPLORER + '/address/',
    lookBlock: NEAR_MAIN_EXPLORER + '/blocks/',
    explorer: NEAR_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Near',
    networkName: 'Near mainnet',
    networkLogo: 'NEAR',
    type: 'main',
    label: NEAR_MAIN_CHAINID,
    chainType: NEAR_MAIN_CHAINID,
    hotType: CHAIN_TYPE.HOT
  },
  [NEAR_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: NEAR_TESTNET,
    nodeRpcList: [],
    chainID: NEAR_TEST_CHAINID,
    lookHash: NEAR_TEST_EXPLORER + '/txns/',
    lookAddr: NEAR_TEST_EXPLORER + '/address/',
    lookBlock: NEAR_TEST_EXPLORER + '/blocks/',
    explorer: NEAR_TEST_EXPLORER,
    symbol: symbol,
    name: 'Near',
    networkName: 'Near testnet',
    networkLogo: 'NEAR',
    type: 'test',
    label: NEAR_TEST_CHAINID,
    chainType: NEAR_TEST_CHAINID
  },
}