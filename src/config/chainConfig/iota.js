
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const IOTA_MAINNET = 'https://chrysalis-nodes.iota.cafe'
export const IOTA_MAIN_CHAINID = ChainId.IOTA
export const IOTA_MAIN_EXPLORER = 'https://explorer.iota.org/mainnet'

export const IOTA_TESTNET = 'https://api.lb-0.h.chrysalis-devnet.iota.cafe'
export const IOTA_TEST_CHAINID = ChainId.IOTA_TEST
export const IOTA_TEST_EXPLORER = 'https://explorer.iota.org/devnet'

const symbol = 'IOTA'

const bridgeToken = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [IOTA_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: IOTA_MAINNET,
    nodeRpcList: [],
    chainID: IOTA_MAIN_CHAINID,
    lookHash: IOTA_MAIN_EXPLORER + '/message/',
    lookAddr: IOTA_MAIN_EXPLORER + '/addr/',
    lookBlock: IOTA_MAIN_EXPLORER + '/blocks/',
    explorer: IOTA_MAIN_EXPLORER,
    symbol: symbol,
    name: 'IOTA',
    networkName: 'IOTA mainnet',
    networkLogo: 'IOTA',
    type: 'main',
    label: IOTA_MAIN_CHAINID,
    chainType: 'NOWALLET'
  },
  [IOTA_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: IOTA_TESTNET,
    nodeRpcList: [],
    chainID: IOTA_TEST_CHAINID,
    lookHash: IOTA_TEST_EXPLORER + '/message/',
    lookAddr: IOTA_TEST_EXPLORER + '/addr/',
    lookBlock: IOTA_TEST_EXPLORER + '/blocks/',
    explorer: IOTA_TEST_EXPLORER,
    symbol: symbol,
    name: 'IOTA',
    networkName: 'IOTA testnet',
    networkLogo: 'IOTA',
    type: 'test',
    label: IOTA_TEST_CHAINID,
    chainType: 'NOWALLET'
  },
}