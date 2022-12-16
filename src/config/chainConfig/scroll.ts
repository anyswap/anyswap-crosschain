import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const SCROLL_MAIN_CHAINID = ChainId.SCROLL
// export const SCROLL_MAINNET = getLocalRPC(SCROLL_MAIN_CHAINID, 'https://SCROLL.dexit.network')
// export const SCROLL_MAIN_EXPLORER = 'https://SCROLLscan.com'

export const SCROLL_TEST_CHAINID = ChainId.SCROLL_TEST
export const SCROLL_TESTNET = getLocalRPC(SCROLL_TEST_CHAINID, 'https://prealpha.scroll.io/l2')
export const SCROLL_TEST_EXPLORER = 'https://l2scan.scroll.io'

const symbol = 'Ether'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  // [SCROLL_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: SCROLL_MAINNET,
  //   nodeRpcList: [
  //     SCROLL_MAINNET,
  //   ],
  //   chainID: SCROLL_MAIN_CHAINID,
  //   lookHash: SCROLL_MAIN_EXPLORER + '/tx/',
  //   lookAddr: SCROLL_MAIN_EXPLORER + '/address/',
  //   lookBlock: SCROLL_MAIN_EXPLORER + '/block/',
  //   explorer: SCROLL_MAIN_EXPLORER,
  //   symbol: symbol,
  //   name: 'Scroll L2',
  //   networkName: 'Scroll L2 mainnet',
    // networkLogo: 'scroll',
  //   type: 'main',
  //   label: SCROLL_MAIN_CHAINID,
  // },
  [SCROLL_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: SCROLL_TESTNET,
    nodeRpcList: [
      SCROLL_TESTNET,
    ],
    chainID: SCROLL_TEST_CHAINID,
    lookHash: SCROLL_TEST_EXPLORER + '/tx/',
    lookAddr: SCROLL_TEST_EXPLORER + '/address/',
    lookBlock: SCROLL_TEST_EXPLORER + '/block/',
    explorer: SCROLL_TEST_EXPLORER,
    symbol: symbol,
    name: 'Scroll L2',
    networkName: 'Scroll L2 testnet',
    networkLogo: 'scroll',
    walletName: 'Scroll Pre-Alpha Testnet',
    type: 'test',
    label: SCROLL_TEST_CHAINID,
  },
}