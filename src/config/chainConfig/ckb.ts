import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const CKB_MAIN_CHAINID = ChainId.CKB
export const CKB_MAINNET = getLocalRPC(CKB_MAIN_CHAINID, 'https://v1.mainnet.godwoken.io/rpc')
export const CKB_MAIN_EXPLORER = 'https://gw-mainnet-explorer.nervosdao.community'

// export const CKB_TEST_CHAINID = ChainId.CKB_TEST
// export const CKB_TESTNET = getLocalRPC(CKB_TEST_CHAINID, 'CKBtps://CKBtp-testnet.hecochain.com')
// export const CKB_TEST_EXPLORER = 'CKBtps://testnet.hecoinfo.com'

const symbol = 'CKB'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [CKB_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x218c3c3D49d0E7B37aff0D8bB079de36Ae61A4c0',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: CKB_MAINNET,
    nodeRpcList: [
      CKB_MAINNET,
    ],
    chainID: CKB_MAIN_CHAINID,
    lookHash: CKB_MAIN_EXPLORER + '/tx/',
    lookAddr: CKB_MAIN_EXPLORER + '/address/',
    lookBlock: CKB_MAIN_EXPLORER + '/block/',
    explorer: CKB_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Godwoken',
    networkName: 'Godwoken mainnet',
    walletName: 'Godwoken Mainnet',
    type: 'main',
    label: CKB_MAIN_CHAINID,
  },
  // [CKB_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: CKB_TESTNET,
  //   nodeRpcList: [
  //     CKB_TESTNET,
  //   ],
  //   chainID: CKB_TEST_CHAINID,
  //   lookHash: CKB_TEST_EXPLORER + '/tx/',
  //   lookAddr: CKB_TEST_EXPLORER + '/address/',
  //   lookBlock: CKB_TEST_EXPLORER + '/block/',
  //   explorer: CKB_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Huobi',
  //   networkName: 'Heco testnet',
  //   type: 'test',
  //   label: CKB_TEST_CHAINID,
  // },
}