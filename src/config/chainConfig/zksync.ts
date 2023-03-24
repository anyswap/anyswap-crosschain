import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const ZKSYNV_MAIN_CHAINID = ChainId.ZKSYNC
export const ZKSYNV_MAINNET = getLocalRPC(ZKSYNV_MAIN_CHAINID, 'https://zksync2-mainnet.zksync.io')
export const ZKSYNV_MAIN_EXPLORER = 'https://explorer.zksync.io'

export const ZKSYNV_TEST_CHAINID = ChainId.ZKSYNC_TEST
export const ZKSYNV_TESTNET = getLocalRPC(ZKSYNV_TEST_CHAINID, 'https://zksync2-testnet.zksync.dev')
export const ZKSYNV_TEST_EXPLORER = 'https://goerli.explorer.zksync.io'

const symbol = 'ETH'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [ZKSYNV_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: ZKSYNV_MAINNET,
    nodeRpcList: [
      ZKSYNV_MAINNET,
    ],
    chainID: ZKSYNV_MAIN_CHAINID,
    lookHash: ZKSYNV_MAIN_EXPLORER + '/tx/',
    lookAddr: ZKSYNV_MAIN_EXPLORER + '/address/',
    lookBlock: ZKSYNV_MAIN_EXPLORER + '/block/',
    explorer: ZKSYNV_MAIN_EXPLORER,
    symbol: symbol,
    name: 'zkSync Era',
    networkName: 'zkSync Era mainnet',
    networkLogo: 'zkSync',
    type: 'main',
    label: ZKSYNV_MAIN_CHAINID,
  },
  [ZKSYNV_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: ZKSYNV_TESTNET,
    nodeRpcList: [
      ZKSYNV_TESTNET,
    ],
    chainID: ZKSYNV_TEST_CHAINID,
    lookHash: ZKSYNV_TEST_EXPLORER + '/tx/',
    lookAddr: ZKSYNV_TEST_EXPLORER + '/address/',
    lookBlock: ZKSYNV_TEST_EXPLORER + '/block/',
    explorer: ZKSYNV_TEST_EXPLORER,
    symbol: symbol,
    name: 'zkSync Era',
    networkName: 'zkSync Era testnet',
    networkLogo: 'zkSync',
    type: 'test',
    label: ZKSYNV_TEST_CHAINID,
  },
}