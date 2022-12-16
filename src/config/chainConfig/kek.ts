import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const KEK_MAIN_CHAINID = ChainId.KEK
export const KEK_MAINNET = getLocalRPC(KEK_MAIN_CHAINID, 'https://mainnet.kekchain.com')
export const KEK_MAIN_EXPLORER = 'https://mainnet-explorer.kekchain.com'

export const KEK_TEST_CHAINID = ChainId.KEK_TEST
export const KEK_TESTNET = getLocalRPC(KEK_TEST_CHAINID, 'https://testnet.kekchain.com')
export const KEK_TEST_EXPLORER = 'https://testnet-explorer.kekchain.com'

const symbol = 'KEK'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [KEK_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: KEK_MAINNET,
    nodeRpcList: [
      KEK_MAINNET,
    ],
    chainID: KEK_MAIN_CHAINID,
    lookHash: KEK_MAIN_EXPLORER + '/tx/',
    lookAddr: KEK_MAIN_EXPLORER + '/address/',
    lookBlock: KEK_MAIN_EXPLORER + '/block/',
    explorer: KEK_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Kekchain',
    networkName: 'Kekchain mainnet',
    walletName: 'Kekchain',
    type: 'main',
    label: KEK_MAIN_CHAINID,
  },
  [KEK_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: KEK_TESTNET,
    nodeRpcList: [
      KEK_TESTNET,
    ],
    chainID: KEK_TEST_CHAINID,
    lookHash: KEK_TEST_EXPLORER + '/tx/',
    lookAddr: KEK_TEST_EXPLORER + '/address/',
    lookBlock: KEK_TEST_EXPLORER + '/block/',
    explorer: KEK_TEST_EXPLORER,
    symbol: symbol,
    name: 'Kekchain',
    networkName: 'Kekchain testnet',
    walletName: 'Kekchain (kektest)',
    type: 'test',
    label: KEK_TEST_CHAINID,
  },
}