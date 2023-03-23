import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const ZBC_MAIN_CHAINID = ChainId.ZBC
// export const ZBC_MAINNET = getLocalRPC(ZBC_MAIN_CHAINID, 'https://rpc.dynochain.io/')
// export const ZBC_MAIN_EXPLORER = 'https://dynoscan.io'

export const ZBC_TEST_CHAINID = ChainId.ZBC_TEST
export const ZBC_TESTNET = getLocalRPC(ZBC_TEST_CHAINID, 'https://triton.api.nautchain.xyz')
export const ZBC_TEST_EXPLORER = 'https://triton.nautscan.com'

const symbol = 'ZBC'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  // [ZBC_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: ZBC_MAINNET,
  //   nodeRpcList: [
  //     ZBC_MAINNET,
  //   ],
  //   chainID: ZBC_MAIN_CHAINID,
  //   lookHash: ZBC_MAIN_EXPLORER + '/tx/',
  //   lookAddr: ZBC_MAIN_EXPLORER + '/address/',
  //   lookBlock: ZBC_MAIN_EXPLORER + '/block/',
  //   explorer: ZBC_MAIN_EXPLORER,
  //   symbol: symbol,
  //   name: 'Dynochain',
  //   networkName: 'Dynochain mainnet',
  //   type: 'main',
  //   label: ZBC_MAIN_CHAINID,
  // },
  [ZBC_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: ZBC_TESTNET,
    nodeRpcList: [
      ZBC_TESTNET,
    ],
    chainID: ZBC_TEST_CHAINID,
    lookHash: ZBC_TEST_EXPLORER + '/tx/',
    lookAddr: ZBC_TEST_EXPLORER + '/address/',
    lookBlock: ZBC_TEST_EXPLORER + '/block/',
    explorer: ZBC_TEST_EXPLORER,
    symbol: symbol,
    name: 'Nautilus Triton',
    networkName: 'Nautilus Triton testnet',
    type: 'test',
    label: ZBC_TEST_CHAINID,
  },
}