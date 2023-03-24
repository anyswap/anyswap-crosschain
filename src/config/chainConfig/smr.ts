import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const SMR_MAIN_CHAINID = ChainId.SMR
// export const SMR_MAINNET = getLocalRPC(SMR_MAIN_CHAINID, 'https://rpc.dynochain.io/')
// export const SMR_MAIN_EXPLORER = 'https://dynoscan.io'

export const SMR_TEST_CHAINID = ChainId.SMR_TEST
export const SMR_TESTNET = getLocalRPC(SMR_TEST_CHAINID, 'https://json-rpc.evm.testnet.shimmer.network')
export const SMR_TEST_EXPLORER = 'https://explorer.evm.testnet.shimmer.network'

const symbol = 'SMR'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  // [SMR_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: SMR_MAINNET,
  //   nodeRpcList: [
  //     SMR_MAINNET,
  //   ],
  //   chainID: SMR_MAIN_CHAINID,
  //   lookHash: SMR_MAIN_EXPLORER + '/tx/',
  //   lookAddr: SMR_MAIN_EXPLORER + '/address/',
  //   lookBlock: SMR_MAIN_EXPLORER + '/block/',
  //   explorer: SMR_MAIN_EXPLORER,
  //   symbol: symbol,
  //   name: 'Dynochain',
  //   networkName: 'Dynochain mainnet',
  //   type: 'main',
  //   label: SMR_MAIN_CHAINID,
  // },
  [SMR_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: SMR_TESTNET,
    nodeRpcList: [
      SMR_TESTNET,
    ],
    chainID: SMR_TEST_CHAINID,
    lookHash: SMR_TEST_EXPLORER + '/tx/',
    lookAddr: SMR_TEST_EXPLORER + '/address/',
    lookBlock: SMR_TEST_EXPLORER + '/block/',
    explorer: SMR_TEST_EXPLORER,
    symbol: symbol,
    name: 'ShimmerEVM',
    networkName: 'ShimmerEVM testnet',
    type: 'test',
    label: SMR_TEST_CHAINID,
  },
}