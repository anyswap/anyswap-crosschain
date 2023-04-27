import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const FLR_MAIN_CHAINID = ChainId.FLR
export const FLR_MAINNET = getLocalRPC(FLR_MAIN_CHAINID, 'https://flare-api.flare.network/ext/C/rpc')
export const FLR_MAIN_EXPLORER = 'https://flare-explorer.flare.network'

// export const FLR_TEST_CHAINID = ChainId.FLR_TEST
// export const FLR_TESTNET = getLocalRPC(FLR_TEST_CHAINID, 'https://rpc.testnet.mantle.xyz')
// export const FLR_TEST_EXPLORER = 'https://explorer.testnet.mantle.xyz'

const symbol = 'FLR'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [FLR_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: FLR_MAINNET,
    nodeRpcList: [
      FLR_MAINNET,
    ],
    chainID: FLR_MAIN_CHAINID,
    lookHash: FLR_MAIN_EXPLORER + '/tx/',
    lookAddr: FLR_MAIN_EXPLORER + '/address/',
    lookBlock: FLR_MAIN_EXPLORER + '/block/',
    explorer: FLR_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Flare',
    networkName: 'Flare mainnet',
    walletName: 'Flare Mainnet',
    type: 'main',
    label: FLR_MAIN_CHAINID,
  },
  // [FLR_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: FLR_TESTNET,
  //   nodeRpcList: [
  //     FLR_TESTNET,
  //   ],
  //   chainID: FLR_TEST_CHAINID,
  //   lookHash: FLR_TEST_EXPLORER + '/tx/',
  //   lookAddr: FLR_TEST_EXPLORER + '/address/',
  //   lookBlock: FLR_TEST_EXPLORER + '/block/',
  //   explorer: FLR_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Mantle',
  //   networkName: 'Mantle testnet',
  //   type: 'test',
  //   label: FLR_TEST_CHAINID,
  // },
}