import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const SHM_MAIN_CHAINID = ChainId.SHM
// export const SHM_MAINNET = getLocalRPC(SHM_MAIN_CHAINID, 'https://v1.mainnet.godwoken.io/rpc')
// export const SHM_MAIN_EXPLORER = 'https://gw-mainnet-explorer.nervosdao.community'

export const SHM_TEST_CHAINID = ChainId.SHM_TEST
export const SHM_TESTNET = getLocalRPC(SHM_TEST_CHAINID, 'https://liberty10.shardeum.org/')
export const SHM_TEST_EXPLORER = 'https://explorer-liberty10.shardeum.org'

export const SHM1X_TEST_CHAINID = ChainId.SHM1X_TEST
export const SHM1X_TESTNET = getLocalRPC(SHM_TEST_CHAINID, 'https://sphinx.shardeum.org')
export const SHM1X_TEST_EXPLORER = 'https://explorer-sphinx.shardeum.org'

const symbol = 'SHM'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  // [SHM_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '0x218c3c3D49d0E7B37aff0D8bB079de36Ae61A4c0',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: SHM_MAINNET,
  //   nodeRpcList: [
  //     SHM_MAINNET,
  //   ],
  //   chainID: SHM_MAIN_CHAINID,
  //   lookHash: SHM_MAIN_EXPLORER + '/tx/',
  //   lookAddr: SHM_MAIN_EXPLORER + '/address/',
  //   lookBlock: SHM_MAIN_EXPLORER + '/block/',
  //   explorer: SHM_MAIN_EXPLORER,
  //   symbol: symbol,
  //   name: 'Shardeum',
  //   networkName: 'Shardeum mainnet',
  //   type: 'main',
  //   label: SHM_MAIN_CHAINID,
  // },
  [SHM_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: SHM_TESTNET,
    nodeRpcList: [
      SHM_TESTNET,
    ],
    chainID: SHM_TEST_CHAINID,
    lookHash: SHM_TEST_EXPLORER + '/transaction/',
    lookAddr: SHM_TEST_EXPLORER + '/account/',
    lookBlock: SHM_TEST_EXPLORER + '/block/',
    explorer: SHM_TEST_EXPLORER,
    symbol: symbol,
    name: 'Shardeum',
    networkName: 'Shardeum testnet',
    walletName: 'Shardeum Liberty 1.6',
    type: 'test',
    label: SHM_TEST_CHAINID,
  },
  [SHM1X_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: SHM1X_TESTNET,
    nodeRpcList: [
      SHM1X_TESTNET,
    ],
    chainID: SHM1X_TEST_CHAINID,
    lookHash: SHM1X_TEST_EXPLORER + '/transaction/',
    lookAddr: SHM1X_TEST_EXPLORER + '/account/',
    lookBlock: SHM1X_TEST_EXPLORER + '/block/',
    explorer: SHM1X_TEST_EXPLORER,
    symbol: symbol,
    name: 'Shardeum Sphinx 1.X',
    networkName: 'Shardeum Sphinx 1.X testnet',
    walletName: 'Shardeum Sphinx 1.X',
    type: 'test',
    label: SHM1X_TEST_CHAINID,
  },
}