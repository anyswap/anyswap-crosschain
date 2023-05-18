import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const ZEN_MAIN_CHAINID = ChainId.ZEN
// export const ZEN_MAINNET = getLocalRPC(ZEN_MAIN_CHAINID, 'https://rpc.icecreamswap.com')
// export const ZEN_MAIN_EXPLORER = 'https://ZENscan.com'

export const ZEN_TEST_CHAINID = ChainId.ZEN_TEST
export const ZEN_TESTNET = getLocalRPC(ZEN_TEST_CHAINID, 'https://gobi-testnet.horizenlabs.io/ethv1')
export const ZEN_TEST_EXPLORER = 'https://gobi-explorer.horizen.io'

const symbol = 'ZEN'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  // [ZEN_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: ZEN_MAINNET,
  //   nodeRpcList: [
  //     ZEN_MAINNET,
  //     'https://serverrpc.com/',
  //     'https://rpc-ZENgert-vefi.com/',
  //     'https://chainrpc.com/',
  //   ],
  //   chainID: ZEN_MAIN_CHAINID,
  //   lookHash: ZEN_MAIN_EXPLORER + '/tx/',
  //   lookAddr: ZEN_MAIN_EXPLORER + '/address/',
  //   lookBlock: ZEN_MAIN_EXPLORER + '/block/',
  //   explorer: ZEN_MAIN_EXPLORER,
  //   symbol: symbol,
  //   name: 'Horizen',
  //   networkName: 'Horizen mainnet',
  //   walletName: 'Horizen Mainnet',
  //   type: 'main',
  //   label: ZEN_MAIN_CHAINID,
  // },
  [ZEN_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: ZEN_TESTNET,
    nodeRpcList: [
      ZEN_TESTNET,
    ],
    chainID: ZEN_TEST_CHAINID,
    lookHash: ZEN_TEST_EXPLORER + '/tx/',
    lookAddr: ZEN_TEST_EXPLORER + '/address/',
    lookBlock: ZEN_TEST_EXPLORER + '/block/',
    explorer: ZEN_TEST_EXPLORER,
    symbol: symbol,
    name: 'Horizen',
    networkName: 'Horizen testnet',
    type: 'test',
    label: ZEN_TEST_CHAINID,
  },
}