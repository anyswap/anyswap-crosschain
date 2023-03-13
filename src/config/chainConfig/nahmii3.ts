import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const NAHMII3_MAIN_CHAINID = ChainId.NAHMII3
// export const NAHMII3_MAINNET = getLocalRPC(NAHMII3_MAIN_CHAINID, 'https://rpc.icecreamswap.com')
// export const NAHMII3_MAIN_EXPLORER = 'https://NAHMII3scan.com'

export const NAHMII3_TEST_CHAINID = ChainId.NAHMII3_TEST
export const NAHMII3_TESTNET = getLocalRPC(NAHMII3_TEST_CHAINID, 'https://ngeth.testnet.n3.nahmii.io')
export const NAHMII3_TEST_EXPLORER = 'https://explorer.testnet.n3.nahmii.io'

const symbol = 'ETH'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  // [NAHMII3_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: NAHMII3_MAINNET,
  //   nodeRpcList: [
  //     NAHMII3_MAINNET,
  //     'https://serverrpc.com/',
  //     'https://rpc-NAHMII3gert-vefi.com/',
  //     'https://chainrpc.com/',
  //   ],
  //   chainID: NAHMII3_MAIN_CHAINID,
  //   lookHash: NAHMII3_MAIN_EXPLORER + '/tx/',
  //   lookAddr: NAHMII3_MAIN_EXPLORER + '/address/',
  //   lookBlock: NAHMII3_MAIN_EXPLORER + '/block/',
  //   explorer: NAHMII3_MAIN_EXPLORER,
  //   symbol: symbol,
  //   name: 'NAHMII3gert',
  //   networkName: 'NAHMII3gert mainnet',
  //   walletName: 'NAHMII3gert Mainnet',
  //   type: 'main',
  //   label: NAHMII3_MAIN_CHAINID,
  // },
  [NAHMII3_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: NAHMII3_TESTNET,
    nodeRpcList: [
      NAHMII3_TESTNET,
    ],
    chainID: NAHMII3_TEST_CHAINID,
    lookHash: NAHMII3_TEST_EXPLORER + '/tx/',
    lookAddr: NAHMII3_TEST_EXPLORER + '/address/',
    lookBlock: NAHMII3_TEST_EXPLORER + '/block/',
    explorer: NAHMII3_TEST_EXPLORER,
    symbol: symbol,
    name: 'Nahmii 3',
    networkName: 'Nahmii 3 testnet',
    networkLogo: 'NAHMII3',
    type: 'test',
    label: NAHMII3_TEST_CHAINID,
  },
}