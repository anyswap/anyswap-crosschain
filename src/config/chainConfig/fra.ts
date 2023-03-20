import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const FRA_MAIN_CHAINID = ChainId.FRA
export const FRA_MAINNET = getLocalRPC(FRA_MAIN_CHAINID, 'https://rpc-mainnet.findora.org')
export const FRA_MAIN_EXPLORER = 'https://evm.findorascan.io'

// export const FRA_TEST_CHAINID = ChainId.FRA_TEST
// export const FRA_TESTNET = getLocalRPC(FRA_TEST_CHAINID, 'https://zksync2-testnet.zksync.dev')
// export const FRA_TEST_EXPLORER = 'https://goerli.explorer.zksync.io'

const symbol = 'FRA'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [FRA_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: FRA_MAINNET,
    nodeRpcList: [
      FRA_MAINNET,
    ],
    chainID: FRA_MAIN_CHAINID,
    lookHash: FRA_MAIN_EXPLORER + '/tx/',
    lookAddr: FRA_MAIN_EXPLORER + '/address/',
    lookBlock: FRA_MAIN_EXPLORER + '/block/',
    explorer: FRA_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Findora',
    networkName: 'Findora mainnet',
    type: 'main',
    label: FRA_MAIN_CHAINID,
  },
  // [FRA_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: FRA_TESTNET,
  //   nodeRpcList: [
  //     FRA_TESTNET,
  //   ],
  //   chainID: FRA_TEST_CHAINID,
  //   lookHash: FRA_TEST_EXPLORER + '/tx/',
  //   lookAddr: FRA_TEST_EXPLORER + '/address/',
  //   lookBlock: FRA_TEST_EXPLORER + '/block/',
  //   explorer: FRA_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Findora',
  //   networkName: 'Findora testnet',
  //   type: 'test',
  //   label: FRA_TEST_CHAINID,
  // },
}