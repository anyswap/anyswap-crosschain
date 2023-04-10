import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const RBTC_MAIN_CHAINID = ChainId.RBTC
export const RBTC_MAINNET = getLocalRPC(RBTC_MAIN_CHAINID, 'https://public-node.rsk.co')
export const RBTC_MAIN_EXPLORER = 'https://explorer.rsk.co'

export const RBTC_TEST_CHAINID = ChainId.RBTC_TEST
export const RBTC_TESTNET = getLocalRPC(RBTC_TEST_CHAINID, 'https://public-node.testnet.rsk.co')
export const RBTC_TEST_EXPLORER = 'https://explorer.testnet.rsk.co'

const symbol = 'RBTC'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [RBTC_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xFbdd194376de19a88118e84E279b977f165d01b8',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: RBTC_MAINNET,
    nodeRpcList: [
      RBTC_MAINNET,
    ],
    chainID: RBTC_MAIN_CHAINID,
    lookHash: RBTC_MAIN_EXPLORER + '/tx/',
    lookAddr: RBTC_MAIN_EXPLORER + '/address/',
    lookBlock: RBTC_MAIN_EXPLORER + '/block/',
    explorer: RBTC_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Rootstock RSK',
    networkName: 'Rootstock RSK mainnet',
    walletName: 'RSK Mainnet',
    type: 'main',
    label: RBTC_MAIN_CHAINID,
  },
  [RBTC_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: RBTC_TESTNET,
    nodeRpcList: [
      RBTC_TESTNET,
    ],
    chainID: RBTC_TEST_CHAINID,
    lookHash: RBTC_TEST_EXPLORER + '/tx/',
    lookAddr: RBTC_TEST_EXPLORER + '/address/',
    lookBlock: RBTC_TEST_EXPLORER + '/block/',
    explorer: RBTC_TEST_EXPLORER,
    symbol: symbol,
    name: 'Rootstock RSK',
    networkName: 'Rootstock RSK testnet',
    type: 'test',
    label: RBTC_TEST_CHAINID,
  },
}