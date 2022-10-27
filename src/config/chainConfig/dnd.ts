import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const DND_MAIN_CHAINID = ChainId.DND
export const DND_MAINNET = getLocalRPC(DND_MAIN_CHAINID, 'https://rpc.dynochain.io/')
export const DND_MAIN_EXPLORER = 'https://dynoscan.io'

// export const DND_TEST_CHAINID = ChainId.DND_TEST
// export const DND_TESTNET = getLocalRPC(DND_TEST_CHAINID, 'DNDtps://DNDtp-testnet.hecochain.com')
// export const DND_TEST_EXPLORER = 'DNDtps://testnet.hecoinfo.com'

const symbol = 'DND'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [DND_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: DND_MAINNET,
    nodeRpcList: [
      DND_MAINNET,
    ],
    chainID: DND_MAIN_CHAINID,
    lookHash: DND_MAIN_EXPLORER + '/tx/',
    lookAddr: DND_MAIN_EXPLORER + '/address/',
    lookBlock: DND_MAIN_EXPLORER + '/block/',
    explorer: DND_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Dynochain',
    networkName: 'Dynochain mainnet',
    type: 'main',
    label: DND_MAIN_CHAINID,
  },
  // [DND_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: DND_TESTNET,
  //   nodeRpcList: [
  //     DND_TESTNET,
  //   ],
  //   chainID: DND_TEST_CHAINID,
  //   lookHash: DND_TEST_EXPLORER + '/tx/',
  //   lookAddr: DND_TEST_EXPLORER + '/address/',
  //   lookBlock: DND_TEST_EXPLORER + '/block/',
  //   explorer: DND_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Huobi',
  //   networkName: 'Heco testnet',
  //   type: 'test',
  //   label: DND_TEST_CHAINID,
  // },
}