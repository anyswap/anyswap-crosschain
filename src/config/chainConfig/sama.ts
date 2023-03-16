import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const SAMA_MAIN_CHAINID = ChainId.SAMA
export const SAMA_MAINNET = getLocalRPC(SAMA_MAIN_CHAINID, 'https://rpc.exosama.com')
export const SAMA_MAIN_EXPLORER = 'https://explorer.exosama.com'

// export const SAMA_TEST_CHAINID = ChainId.SAMA_TEST
// export const SAMA_TESTNET = getLocalRPC(SAMA_TEST_CHAINID, 'SAMAtps://SAMAtp-testnet.hecochain.com')
// export const SAMA_TEST_EXPLORER = 'SAMAtps://testnet.hecoinfo.com'

const symbol = 'SAMA'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [SAMA_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: SAMA_MAINNET,
    nodeRpcList: [
      SAMA_MAINNET,
    ],
    chainID: SAMA_MAIN_CHAINID,
    lookHash: SAMA_MAIN_EXPLORER + '/tx/',
    lookAddr: SAMA_MAIN_EXPLORER + '/address/',
    lookBlock: SAMA_MAIN_EXPLORER + '/block/',
    explorer: SAMA_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Exosama',
    networkName: 'Exosama mainnet',
    walletName: 'Exosama Network',
    type: 'main',
    label: SAMA_MAIN_CHAINID,
  },
  // [SAMA_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: SAMA_TESTNET,
  //   nodeRpcList: [
  //     SAMA_TESTNET,
  //   ],
  //   chainID: SAMA_TEST_CHAINID,
  //   lookHash: SAMA_TEST_EXPLORER + '/tx/',
  //   lookAddr: SAMA_TEST_EXPLORER + '/address/',
  //   lookBlock: SAMA_TEST_EXPLORER + '/block/',
  //   explorer: SAMA_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Huobi',
  //   networkName: 'Heco testnet',
  //   type: 'test',
  //   label: SAMA_TEST_CHAINID,
  // },
}