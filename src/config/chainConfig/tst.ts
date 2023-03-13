import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const TST_MAIN_CHAINID = ChainId.TST
// export const TST_MAINNET = getLocalRPC(TST_MAIN_CHAINID, 'https://rpc.icecreamswap.com')
// export const TST_MAIN_EXPLORER = 'https://TSTscan.com'

export const TST_TEST_CHAINID = ChainId.TST_TEST
export const TST_TESTNET = getLocalRPC(TST_TEST_CHAINID, 'https://testnet-rpc.thundercore.com')
export const TST_TEST_EXPLORER = 'https://explorer-testnet.thundercore.com'

const symbol = 'TST'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  // [TST_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: TST_MAINNET,
  //   nodeRpcList: [
  //     TST_MAINNET,
  //     'https://serverrpc.com/',
  //     'https://rpc-TSTgert-vefi.com/',
  //     'https://chainrpc.com/',
  //   ],
  //   chainID: TST_MAIN_CHAINID,
  //   lookHash: TST_MAIN_EXPLORER + '/tx/',
  //   lookAddr: TST_MAIN_EXPLORER + '/address/',
  //   lookBlock: TST_MAIN_EXPLORER + '/block/',
  //   explorer: TST_MAIN_EXPLORER,
  //   symbol: symbol,
  //   name: 'ThunderCore',
  //   networkName: 'ThunderCore mainnet',
  //   walletName: 'ThunderCore Mainnet',
  //   type: 'main',
  //   label: TST_MAIN_CHAINID,
  // },
  [TST_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: TST_TESTNET,
    nodeRpcList: [
      TST_TESTNET,
    ],
    chainID: TST_TEST_CHAINID,
    lookHash: TST_TEST_EXPLORER + '/tx/',
    lookAddr: TST_TEST_EXPLORER + '/address/',
    lookBlock: TST_TEST_EXPLORER + '/block/',
    explorer: TST_TEST_EXPLORER,
    symbol: symbol,
    name: 'ThunderCore',
    networkName: 'ThunderCore testnet',
    type: 'test',
    label: TST_TEST_CHAINID,
  },
}