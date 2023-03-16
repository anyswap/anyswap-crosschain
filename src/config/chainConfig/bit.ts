import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const BIT_MAIN_CHAINID = ChainId.BIT
// export const BIT_MAINNET = getLocalRPC(BIT_MAIN_CHAINID, 'https://rpc.icecreamswap.com')
// export const BIT_MAIN_EXPLORER = 'https://BITscan.com'

export const BIT_TEST_CHAINID = ChainId.BIT_TEST
export const BIT_TESTNET = getLocalRPC(BIT_TEST_CHAINID, 'https://rpc.testnet.mantle.xyz')
export const BIT_TEST_EXPLORER = 'https://explorer.testnet.mantle.xyz'

const symbol = 'BIT'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  // [BIT_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: BIT_MAINNET,
  //   nodeRpcList: [
  //     BIT_MAINNET,
  //     'https://serverrpc.com/',
  //     'https://rpc-bitgert-vefi.com/',
  //     'https://chainrpc.com/',
  //   ],
  //   chainID: BIT_MAIN_CHAINID,
  //   lookHash: BIT_MAIN_EXPLORER + '/tx/',
  //   lookAddr: BIT_MAIN_EXPLORER + '/address/',
  //   lookBlock: BIT_MAIN_EXPLORER + '/block/',
  //   explorer: BIT_MAIN_EXPLORER,
  //   symbol: symbol,
  //   name: 'Bitgert',
  //   networkName: 'Bitgert mainnet',
  //   walletName: 'Bitgert Mainnet',
  //   type: 'main',
  //   label: BIT_MAIN_CHAINID,
  // },
  [BIT_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: BIT_TESTNET,
    nodeRpcList: [
      BIT_TESTNET,
    ],
    chainID: BIT_TEST_CHAINID,
    lookHash: BIT_TEST_EXPLORER + '/tx/',
    lookAddr: BIT_TEST_EXPLORER + '/address/',
    lookBlock: BIT_TEST_EXPLORER + '/block/',
    explorer: BIT_TEST_EXPLORER,
    symbol: symbol,
    name: 'Mantle',
    networkName: 'Mantle testnet',
    type: 'test',
    label: BIT_TEST_CHAINID,
  },
}