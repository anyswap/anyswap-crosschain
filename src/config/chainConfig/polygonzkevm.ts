import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const POLYGONZKEVM_MAIN_CHAINID = ChainId.POLYGONZKEVM
// export const POLYGONZKEVM_MAINNET = getLocalRPC(POLYGONZKEVM_MAIN_CHAINID, 'https://v1.mainnet.godwoken.io/rpc')
// export const POLYGONZKEVM_MAIN_EXPLORER = 'https://gw-mainnet-explorer.nervosdao.community'

export const POLYGONZKEVM_TEST_CHAINID = ChainId.POLYGONZKEVM_TEST
export const POLYGONZKEVM_TESTNET = getLocalRPC(POLYGONZKEVM_TEST_CHAINID, 'https://rpc.public.zkevm-test.net/')
export const POLYGONZKEVM_TEST_EXPLORER = 'https://explorer.public.zkevm-test.net'

const symbol = 'Ether'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  // [POLYGONZKEVM_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '0x218c3c3D49d0E7B37aff0D8bB079de36Ae61A4c0',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: POLYGONZKEVM_MAINNET,
  //   nodeRpcList: [
  //     POLYGONZKEVM_MAINNET,
  //   ],
  //   chainID: POLYGONZKEVM_MAIN_CHAINID,
  //   lookHash: POLYGONZKEVM_MAIN_EXPLORER + '/tx/',
  //   lookAddr: POLYGONZKEVM_MAIN_EXPLORER + '/address/',
  //   lookBlock: POLYGONZKEVM_MAIN_EXPLORER + '/block/',
  //   explorer: POLYGONZKEVM_MAIN_EXPLORER,
  //   symbol: symbol,
  //   name: 'Shardeum',
  //   networkName: 'Shardeum mainnet',
    // networkLogo: 'PolygonzkEVM',
  //   type: 'main',
  //   label: POLYGONZKEVM_MAIN_CHAINID,
  // },
  [POLYGONZKEVM_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: POLYGONZKEVM_TESTNET,
    nodeRpcList: [
      POLYGONZKEVM_TESTNET,
    ],
    chainID: POLYGONZKEVM_TEST_CHAINID,
    lookHash: POLYGONZKEVM_TEST_EXPLORER + '/tx/',
    lookAddr: POLYGONZKEVM_TEST_EXPLORER + '/address/',
    lookBlock: POLYGONZKEVM_TEST_EXPLORER + '/block/',
    explorer: POLYGONZKEVM_TEST_EXPLORER,
    symbol: symbol,
    name: 'Polygon zkEVM',
    networkName: 'Polygon zkEVM testnet',
    networkLogo: 'PolygonzkEVM',
    walletName: 'Polygon zkEVM Testnet',
    type: 'test',
    label: POLYGONZKEVM_TEST_CHAINID,
  },
}