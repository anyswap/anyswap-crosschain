import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const PLS_MAIN_CHAINID = ChainId.PLS
export const PLS_MAINNET = getLocalRPC(PLS_MAIN_CHAINID, 'https://rpc.pulsechain.com')
export const PLS_MAIN_EXPLORER = 'https://scan.pulsechain.com'

// export const PLS_TEST_CHAINID = ChainId.PLS_TEST
// export const PLS_TESTNET = getLocalRPC(PLS_TEST_CHAINID, 'https://gobi-testnet.horiPLSlabs.io/ethv1')
// export const PLS_TEST_EXPLORER = 'https://gobi-explorer.horiPLS.io'

const symbol = 'PLS'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [PLS_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: PLS_MAINNET,
    nodeRpcList: [
      PLS_MAINNET,
    ],
    chainID: PLS_MAIN_CHAINID,
    lookHash: PLS_MAIN_EXPLORER + '/tx/',
    lookAddr: PLS_MAIN_EXPLORER + '/address/',
    lookBlock: PLS_MAIN_EXPLORER + '/block/',
    explorer: PLS_MAIN_EXPLORER,
    symbol: symbol,
    name: 'PulseChain',
    networkName: 'PulseChain mainnet',
    walletName: 'PulseChain Mainnet',
    type: 'main',
    label: PLS_MAIN_CHAINID,
  },
  // [PLS_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: PLS_TESTNET,
  //   nodeRpcList: [
  //     PLS_TESTNET,
  //   ],
  //   chainID: PLS_TEST_CHAINID,
  //   lookHash: PLS_TEST_EXPLORER + '/tx/',
  //   lookAddr: PLS_TEST_EXPLORER + '/address/',
  //   lookBlock: PLS_TEST_EXPLORER + '/block/',
  //   explorer: PLS_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'HoriPLS',
  //   networkName: 'HoriPLS testnet',
  //   type: 'test',
  //   label: PLS_TEST_CHAINID,
  // },
}