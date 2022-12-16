import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const MILKALGO_MAIN_CHAINID = ChainId.MILKALGO
export const MILKALGO_MAINNET = getLocalRPC(MILKALGO_MAIN_CHAINID, 'https://rpc-mainnet-algorand-rollup.a1.milkomeda.com/')
export const MILKALGO_MAIN_EXPLORER = 'https://explorer-mainnet-algorand-rollup.a1.milkomeda.com'

// export const MILKALGO_TEST_CHAINID = ChainId.MILKALGO_TEST
// export const MILKALGO_TESTNET = getLocalRPC(MILKALGO_TEST_CHAINID, 'MILKALGOtps://MILKALGOtp-testnet.hecochain.com')
// export const MILKALGO_TEST_EXPLORER = 'MILKALGOtps://testnet.hecoinfo.com'

const symbol = 'ALGO'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [MILKALGO_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: MILKALGO_MAINNET,
    nodeRpcList: [
      MILKALGO_MAINNET,
    ],
    chainID: MILKALGO_MAIN_CHAINID,
    lookHash: MILKALGO_MAIN_EXPLORER + '/tx/',
    lookAddr: MILKALGO_MAIN_EXPLORER + '/address/',
    lookBlock: MILKALGO_MAIN_EXPLORER + '/block/',
    explorer: MILKALGO_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Milkomeda A1',
    networkName: 'Milkomeda (Algorand) mainnet',
    networkLogo: 'milkADA',
    walletName: 'Milkomeda A1 Mainnet',
    type: 'main',
    label: MILKALGO_MAIN_CHAINID,
  },
  // [MILKALGO_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: MILKALGO_TESTNET,
  //   nodeRpcList: [
  //     MILKALGO_TESTNET,
  //   ],
  //   chainID: MILKALGO_TEST_CHAINID,
  //   lookHash: MILKALGO_TEST_EXPLORER + '/tx/',
  //   lookAddr: MILKALGO_TEST_EXPLORER + '/address/',
  //   lookBlock: MILKALGO_TEST_EXPLORER + '/block/',
  //   explorer: MILKALGO_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Huobi',
  //   networkName: 'Heco testnet',
  //   type: 'test',
  //   label: MILKALGO_TEST_CHAINID,
  // },
}