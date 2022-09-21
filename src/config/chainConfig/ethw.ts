import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const ETHW_MAIN_CHAINID = ChainId.ETHW
export const ETHW_MAINNET = getLocalRPC(ETHW_MAIN_CHAINID, 'https://mainnet.ethereumpow.org')
export const ETHW_MAIN_EXPLORER = 'https://www.oklink.com/en/ethw'

// export const ETHW_TEST_CHAINID = ChainId.ETHW_TEST
// export const ETHW_TESTNET = getLocalRPC(ETHW_TEST_CHAINID, 'ETHWtps://ETHWtp-testnet.hecochain.com')
// export const ETHW_TEST_EXPLORER = 'ETHWtps://testnet.hecoinfo.com'

const symbol = 'ETHW'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [ETHW_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: ETHW_MAINNET,
    nodeRpcList: [
      ETHW_MAINNET,
    ],
    chainID: ETHW_MAIN_CHAINID,
    lookHash: ETHW_MAIN_EXPLORER + '/tx/',
    lookAddr: ETHW_MAIN_EXPLORER + '/address/',
    lookBlock: ETHW_MAIN_EXPLORER + '/block/',
    explorer: ETHW_MAIN_EXPLORER,
    symbol: symbol,
    name: 'ETHW',
    networkName: 'ETHW mainnet',
    type: 'main',
    label: ETHW_MAIN_CHAINID,
  },
  // [ETHW_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: ETHW_TESTNET,
  //   nodeRpcList: [
  //     ETHW_TESTNET,
  //   ],
  //   chainID: ETHW_TEST_CHAINID,
  //   lookHash: ETHW_TEST_EXPLORER + '/tx/',
  //   lookAddr: ETHW_TEST_EXPLORER + '/address/',
  //   lookBlock: ETHW_TEST_EXPLORER + '/block/',
  //   explorer: ETHW_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Huobi',
  //   networkName: 'Heco testnet',
  //   type: 'test',
  //   label: ETHW_TEST_CHAINID,
  // },
}