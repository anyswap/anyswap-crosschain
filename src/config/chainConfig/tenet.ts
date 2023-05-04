import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const TENET_MAIN_CHAINID = ChainId.TENET
export const TENET_MAINNET = getLocalRPC(TENET_MAIN_CHAINID, 'https://rpc.tenet.org')
export const TENET_MAIN_EXPLORER = 'https://tenetscan.io'

// export const TENET_TEST_CHAINID = ChainId.TENET_TEST
// export const TENET_TESTNET = getLocalRPC(TENET_TEST_CHAINID, 'https://rpc.testnet.mantle.xyz')
// export const TENET_TEST_EXPLORER = 'https://explorer.testnet.mantle.xyz'

const symbol = 'TENET'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [TENET_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: TENET_MAINNET,
    nodeRpcList: [
      TENET_MAINNET,
    ],
    chainID: TENET_MAIN_CHAINID,
    lookHash: TENET_MAIN_EXPLORER + '/tx/',
    lookAddr: TENET_MAIN_EXPLORER + '/address/',
    lookBlock: TENET_MAIN_EXPLORER + '/block/',
    explorer: TENET_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Tenet',
    networkName: 'Tenet mainnet',
    walletName: 'Tenet Mainnet',
    type: 'main',
    label: TENET_MAIN_CHAINID,
  },
  // [TENET_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: TENET_TESTNET,
  //   nodeRpcList: [
  //     TENET_TESTNET,
  //   ],
  //   chainID: TENET_TEST_CHAINID,
  //   lookHash: TENET_TEST_EXPLORER + '/tx/',
  //   lookAddr: TENET_TEST_EXPLORER + '/address/',
  //   lookBlock: TENET_TEST_EXPLORER + '/block/',
  //   explorer: TENET_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Mantle',
  //   networkName: 'Mantle testnet',
  //   type: 'test',
  //   label: TENET_TEST_CHAINID,
  // },
}