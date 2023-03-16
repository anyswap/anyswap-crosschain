import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const HPB_MAIN_CHAINID = ChainId.HPB
export const HPB_MAINNET = getLocalRPC(HPB_MAIN_CHAINID, 'https://hpbnode.com')
export const HPB_MAIN_EXPLORER = 'https://hscan.org'

// export const HPB_TEST_CHAINID = ChainId.HPB_TEST
// export const HPB_TESTNET = getLocalRPC(HPB_TEST_CHAINID, 'HPBtps://HPBtp-testnet.hecochain.com')
// export const HPB_TEST_EXPLORER = 'HPBtps://testnet.hecoinfo.com'

const symbol = 'HPB'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [HPB_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: HPB_MAINNET,
    nodeRpcList: [
      HPB_MAINNET,
    ],
    chainID: HPB_MAIN_CHAINID,
    lookHash: HPB_MAIN_EXPLORER + '/tx/',
    lookAddr: HPB_MAIN_EXPLORER + '/address/',
    lookBlock: HPB_MAIN_EXPLORER + '/block/',
    explorer: HPB_MAIN_EXPLORER,
    symbol: symbol,
    name: 'HPB',
    networkName: 'High Performance Blockchain mainnet',
    walletName: 'High Performance Blockchain',
    type: 'main',
    label: HPB_MAIN_CHAINID,
  },
  // [HPB_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: HPB_TESTNET,
  //   nodeRpcList: [
  //     HPB_TESTNET,
  //   ],
  //   chainID: HPB_TEST_CHAINID,
  //   lookHash: HPB_TEST_EXPLORER + '/tx/',
  //   lookAddr: HPB_TEST_EXPLORER + '/address/',
  //   lookBlock: HPB_TEST_EXPLORER + '/block/',
  //   explorer: HPB_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Huobi',
  //   networkName: 'Heco testnet',
  //   type: 'test',
  //   label: HPB_TEST_CHAINID,
  // },
}