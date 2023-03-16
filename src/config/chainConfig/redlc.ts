import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const REDLC_MAIN_CHAINID = ChainId.REDLC
export const REDLC_MAINNET = getLocalRPC(REDLC_MAIN_CHAINID, 'https://dataseed2.redlightscan.finance')
export const REDLC_MAIN_EXPLORER = 'https://redlightscan.finance'

// export const REDLC_TEST_CHAINID = ChainId.REDLC_TEST
// export const REDLC_TESTNET = getLocalRPC(REDLC_TEST_CHAINID, 'REDLCtps://REDLCtp-testnet.hecochain.com')
// export const REDLC_TEST_EXPLORER = 'REDLCtps://testnet.hecoinfo.com'

const symbol = 'REDLC'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [REDLC_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: REDLC_MAINNET,
    nodeRpcList: [
      REDLC_MAINNET,
    ],
    chainID: REDLC_MAIN_CHAINID,
    lookHash: REDLC_MAIN_EXPLORER + '/tx/',
    lookAddr: REDLC_MAIN_EXPLORER + '/address/',
    lookBlock: REDLC_MAIN_EXPLORER + '/block/',
    explorer: REDLC_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Redlight',
    networkName: 'Redlight mainnet',
    walletName: 'Redlight Chain Mainnet',
    type: 'main',
    label: REDLC_MAIN_CHAINID,
  },
  // [REDLC_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: REDLC_TESTNET,
  //   nodeRpcList: [
  //     REDLC_TESTNET,
  //   ],
  //   chainID: REDLC_TEST_CHAINID,
  //   lookHash: REDLC_TEST_EXPLORER + '/tx/',
  //   lookAddr: REDLC_TEST_EXPLORER + '/address/',
  //   lookBlock: REDLC_TEST_EXPLORER + '/block/',
  //   explorer: REDLC_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Bitgert',
  //   networkName: 'Bitgert testnet',
  //   type: 'test',
  //   label: REDLC_TEST_CHAINID,
  // },
}