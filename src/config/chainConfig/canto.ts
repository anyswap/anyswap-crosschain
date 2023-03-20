import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const CANTO_MAIN_CHAINID = ChainId.CANTO
export const CANTO_MAINNET = getLocalRPC(CANTO_MAIN_CHAINID, 'https://canto.neobase.one')
export const CANTO_MAIN_EXPLORER = 'https://tuber.build'

// export const CANTO_TEST_CHAINID = ChainId.CANTO_TEST
// export const CANTO_TESTNET = getLocalRPC(CANTO_TEST_CHAINID, 'https://testnet.dexit.network')
// export const CANTO_TEST_EXPLORER = 'https://testnet.CANTOscan.com'

const symbol = 'CANTO'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [CANTO_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: CANTO_MAINNET,
    nodeRpcList: [
      CANTO_MAINNET,
      'https://canto.neobase.one',
      'https://mainnode.plexnode.org:8545',
      'https://canto.slingshot.finance',
      'https://canto.evm.chandrastation.com',
      'https://jsonrpc.canto.nodestake.top',
    ],
    chainID: CANTO_MAIN_CHAINID,
    lookHash: CANTO_MAIN_EXPLORER + '/tx/',
    lookAddr: CANTO_MAIN_EXPLORER + '/address/',
    lookBlock: CANTO_MAIN_EXPLORER + '/block/',
    explorer: CANTO_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Canto',
    networkName: 'Canto mainnet',
    walletName: 'Canto',
    type: 'main',
    label: CANTO_MAIN_CHAINID,
  },
  // [CANTO_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: CANTO_TESTNET,
  //   nodeRpcList: [
  //     CANTO_TESTNET,
  //   ],
  //   chainID: CANTO_TEST_CHAINID,
  //   lookHash: CANTO_TEST_EXPLORER + '/tx/',
  //   lookAddr: CANTO_TEST_EXPLORER + '/address/',
  //   lookBlock: CANTO_TEST_EXPLORER + '/block/',
  //   explorer: CANTO_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Dexit Network',
  //   networkName: 'Dexit Network testnet',
  //   type: 'test',
  //   label: CANTO_TEST_CHAINID,
  // },
}