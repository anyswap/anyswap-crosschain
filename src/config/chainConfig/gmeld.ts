import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const GMELD_MAIN_CHAINID = ChainId.GMELD
export const GMELD_MAINNET = getLocalRPC(GMELD_MAIN_CHAINID, 'https://subnets.avax.network/meld/mainnet/rpc')
// export const GMELD_MAINNET = getLocalRPC(GMELD_MAIN_CHAINID, 'https://network-rpc.meld.com')
export const GMELD_MAIN_EXPLORER = 'https://subnets.avax.network/meld'

// export const GMELD_TEST_CHAINID = ChainId.GMELD_TEST
// export const GMELD_TESTNET = getLocalRPC(GMELD_TEST_CHAINID, 'https://rpc.testnet.mantle.xyz')
// export const GMELD_TEST_EXPLORER = 'https://explorer.testnet.mantle.xyz'

const symbol = 'gMELD'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [GMELD_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: GMELD_MAINNET,
    nodeRpcList: [
      GMELD_MAINNET,
      'https://network-rpc.meld.com',
      'https://subnets.avax.network/meld/mainnet/rpc',
    ],
    chainID: GMELD_MAIN_CHAINID,
    lookHash: GMELD_MAIN_EXPLORER + '/tx/',
    lookAddr: GMELD_MAIN_EXPLORER + '/address/',
    lookBlock: GMELD_MAIN_EXPLORER + '/block/',
    explorer: GMELD_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Meld',
    networkName: 'Meld mainnet',
    walletName: 'Meld Mainnet',
    type: 'main',
    label: GMELD_MAIN_CHAINID,
  },
  // [GMELD_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: GMELD_TESTNET,
  //   nodeRpcList: [
  //     GMELD_TESTNET,
  //   ],
  //   chainID: GMELD_TEST_CHAINID,
  //   lookHash: GMELD_TEST_EXPLORER + '/tx/',
  //   lookAddr: GMELD_TEST_EXPLORER + '/address/',
  //   lookBlock: GMELD_TEST_EXPLORER + '/block/',
  //   explorer: GMELD_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Mantle',
  //   networkName: 'Mantle testnet',
  //   type: 'test',
  //   label: GMELD_TEST_CHAINID,
  // },
}