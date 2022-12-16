import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const ONUS_MAIN_CHAINID = ChainId.ONUS
export const ONUS_MAINNET = getLocalRPC(ONUS_MAIN_CHAINID, 'https://rpc.onuschain.io')
export const ONUS_MAIN_EXPLORER = 'https://explorer.onuschain.io'

// export const ONUS_TEST_CHAINID = ChainId.ONUS_TEST
// export const ONUS_TESTNET = getLocalRPC(ONUS_TEST_CHAINID, 'ONUStps://ONUStp-testnet.hecochain.com')
// export const ONUS_TEST_EXPLORER = 'ONUStps://testnet.hecoinfo.com'

const symbol = 'ONUS'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [ONUS_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: ONUS_MAINNET,
    nodeRpcList: [
      ONUS_MAINNET,
    ],
    chainID: ONUS_MAIN_CHAINID,
    lookHash: ONUS_MAIN_EXPLORER + '/tx/',
    lookAddr: ONUS_MAIN_EXPLORER + '/address/',
    lookBlock: ONUS_MAIN_EXPLORER + '/block/',
    explorer: ONUS_MAIN_EXPLORER,
    symbol: symbol,
    name: 'ONUS',
    networkName: 'ONUS mainnet',
    walletName: 'ONUS Chain Mainnet',
    type: 'main',
    label: ONUS_MAIN_CHAINID,
  },
  // [ONUS_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: ONUS_TESTNET,
  //   nodeRpcList: [
  //     ONUS_TESTNET,
  //   ],
  //   chainID: ONUS_TEST_CHAINID,
  //   lookHash: ONUS_TEST_EXPLORER + '/tx/',
  //   lookAddr: ONUS_TEST_EXPLORER + '/address/',
  //   lookBlock: ONUS_TEST_EXPLORER + '/block/',
  //   explorer: ONUS_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Huobi',
  //   networkName: 'Heco testnet',
  //   type: 'test',
  //   label: ONUS_TEST_CHAINID,
  // },
}