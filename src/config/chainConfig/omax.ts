import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const OMAX_MAIN_CHAINID = ChainId.OMAX
export const OMAX_MAINNET = getLocalRPC(OMAX_MAIN_CHAINID, 'https://mainapi.omaxray.com')
export const OMAX_MAIN_EXPLORER = 'https://www.omaxray.com'

// export const OMAX_TEST_CHAINID = ChainId.OMAX_TEST
// export const OMAX_TESTNET = getLocalRPC(OMAX_TEST_CHAINID, 'OMAXtps://OMAXtp-testnet.hecochain.com')
// export const OMAX_TEST_EXPLORER = 'OMAXtps://testnet.hecoinfo.com'

const symbol = 'OMAX'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [OMAX_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: OMAX_MAINNET,
    nodeRpcList: [
      OMAX_MAINNET,
    ],
    chainID: OMAX_MAIN_CHAINID,
    lookHash: OMAX_MAIN_EXPLORER + '/tx/',
    lookAddr: OMAX_MAIN_EXPLORER + '/address/',
    lookBlock: OMAX_MAIN_EXPLORER + '/block/',
    explorer: OMAX_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Omax',
    networkName: 'Omax mainnet',
    walletName: 'Omax Mainnet',
    type: 'main',
    label: OMAX_MAIN_CHAINID,
  },
  // [OMAX_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: OMAX_TESTNET,
  //   nodeRpcList: [
  //     OMAX_TESTNET,
  //   ],
  //   chainID: OMAX_TEST_CHAINID,
  //   lookHash: OMAX_TEST_EXPLORER + '/tx/',
  //   lookAddr: OMAX_TEST_EXPLORER + '/address/',
  //   lookBlock: OMAX_TEST_EXPLORER + '/block/',
  //   explorer: OMAX_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Huobi',
  //   networkName: 'Heco testnet',
  //   type: 'test',
  //   label: OMAX_TEST_CHAINID,
  // },
}