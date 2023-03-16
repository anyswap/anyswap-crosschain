import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const NEON_MAIN_CHAINID = ChainId.NEON
// export const NEON_MAINNET = getLocalRPC(NEON_MAIN_CHAINID, 'https://rpc.icecreamswap.com')
// export const NEON_MAIN_EXPLORER = 'https://NEONscan.com'

export const NEON_TEST_CHAINID = ChainId.NEON_TEST
export const NEON_TESTNET = getLocalRPC(NEON_TEST_CHAINID, 'https://devnet.neonevm.org')
export const NEON_TEST_EXPLORER = 'https://neonscan.org'

const symbol = 'NEON'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  // [NEON_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: NEON_MAINNET,
  //   nodeRpcList: [
  //     NEON_MAINNET,
  //     'https://serverrpc.com/',
  //     'https://rpc-NEONgert-vefi.com/',
  //     'https://chainrpc.com/',
  //   ],
  //   chainID: NEON_MAIN_CHAINID,
  //   lookHash: NEON_MAIN_EXPLORER + '/tx/',
  //   lookAddr: NEON_MAIN_EXPLORER + '/address/',
  //   lookBlock: NEON_MAIN_EXPLORER + '/block/',
  //   explorer: NEON_MAIN_EXPLORER,
  //   symbol: symbol,
  //   name: 'NEONgert',
  //   networkName: 'NEONgert mainnet',
  //   walletName: 'NEONgert Mainnet',
  //   type: 'main',
  //   label: NEON_MAIN_CHAINID,
  // },
  [NEON_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: NEON_TESTNET,
    nodeRpcList: [
      NEON_TESTNET,
      'https://devnet.neonevm.org',
      'https://proxy.devnet.neonlabs.org/solana',
    ],
    chainID: NEON_TEST_CHAINID,
    lookHash: NEON_TEST_EXPLORER + '/tx/',
    lookAddr: NEON_TEST_EXPLORER + '/address/',
    lookBlock: NEON_TEST_EXPLORER + '/block/',
    explorer: NEON_TEST_EXPLORER,
    symbol: symbol,
    name: 'Neon EVM',
    networkName: 'Neon EVM testnet',
    type: 'test',
    label: NEON_TEST_CHAINID,
  },
}