import {VERSION, USE_VERSION, CHAIN_TYPE} from '../constant'
import {ChainId} from './chainId'

export const APT_MAINNET = 'https://fullnode.mainnet.aptoslabs.com'
export const APT_MAIN_CHAINID = ChainId.APT
export const APT_MAIN_EXPLORER = 'https://explorer.aptoslabs.com'

export const APT_TESTNET = 'https://testnet.aptoslabs.com'
export const APT_TEST_CHAINID = ChainId.APT_TEST
export const APT_TEST_EXPLORER = 'https://explorer.aptoslabs.com'

const symbol = 'APT'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [APT_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: APT_MAINNET,
    nodeRpcList: [],
    chainID: APT_MAIN_CHAINID,
    lookHash: APT_MAIN_EXPLORER + '/txn/',
    lookAddr: APT_MAIN_EXPLORER + '/account/',
    lookBlock: APT_MAIN_EXPLORER + '/block/',
    explorer: APT_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Aptos',
    networkName: 'Aptos mainnet',
    networkLogo: 'APT',
    type: 'main',
    label: APT_MAIN_CHAINID,
    chainType: APT_MAIN_CHAINID,
    hotType: CHAIN_TYPE.HOT
  },
  [APT_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: APT_TESTNET,
    chainID: APT_TEST_CHAINID,
    nodeRpcList: [],
    lookHash: APT_TEST_EXPLORER + '/txn/',
    lookAddr: APT_TEST_EXPLORER + '/account/',
    lookBlock: APT_TEST_EXPLORER + '/block/',
    explorer: APT_TEST_EXPLORER,
    symbol: symbol,
    name: 'Aptos',
    networkName: 'Aptos testnet',
    networkLogo: 'APT',
    type: 'test',
    label: APT_TEST_CHAINID,
    chainType: APT_TEST_CHAINID
  },
}