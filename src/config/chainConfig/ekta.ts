import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const EKTA_MAIN_CHAINID = ChainId.EKTA
export const EKTA_MAINNET = getLocalRPC(EKTA_MAIN_CHAINID, 'https://main.ekta.io')
export const EKTA_MAIN_EXPLORER = 'https://ektascan.io'

export const EKTA_TEST_CHAINID = ChainId.EKTA_TEST
export const EKTA_TESTNET = getLocalRPC(EKTA_TEST_CHAINID, 'https://test.ekta.io:8545')
export const EKTA_TEST_EXPLORER = 'https://test.ektascan.io'

const symbol = 'EKTA'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [EKTA_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: EKTA_MAINNET,
    nodeRpcList: [
      EKTA_MAINNET,
    ],
    chainID: EKTA_MAIN_CHAINID,
    lookHash: EKTA_MAIN_EXPLORER + '/tx/',
    lookAddr: EKTA_MAIN_EXPLORER + '/address/',
    lookBlock: EKTA_MAIN_EXPLORER + '/block/',
    explorer: EKTA_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Ekta',
    networkName: 'Ekta mainnet',
    walletName: 'Ekta',
    type: 'main',
    label: EKTA_MAIN_CHAINID,
  },
  [EKTA_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: EKTA_TESTNET,
    nodeRpcList: [
      EKTA_TESTNET,
    ],
    chainID: EKTA_TEST_CHAINID,
    lookHash: EKTA_TEST_EXPLORER + '/tx/',
    lookAddr: EKTA_TEST_EXPLORER + '/address/',
    lookBlock: EKTA_TEST_EXPLORER + '/block/',
    explorer: EKTA_TEST_EXPLORER,
    symbol: symbol,
    name: 'Ekta',
    networkName: 'Ekta testnet',
    walletName: 'T-EKTA',
    type: 'test',
    label: EKTA_TEST_CHAINID,
  },
}