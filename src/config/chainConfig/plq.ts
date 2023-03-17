import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const PLQ_MAIN_CHAINID = ChainId.PLQ
export const PLQ_MAINNET = getLocalRPC(PLQ_MAIN_CHAINID, 'https://evm-rpc.planq.network')
export const PLQ_MAIN_EXPLORER = 'https://evm.planq.network'

// export const PLQ_TEST_CHAINID = ChainId.PLQ_TEST
// export const PLQ_TESTNET = getLocalRPC(PLQ_TEST_CHAINID, 'https://zksync2-testnet.zksync.dev')
// export const PLQ_TEST_EXPLORER = 'https://goerli.explorer.zksync.io'

const symbol = 'PLQ'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [PLQ_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: PLQ_MAINNET,
    nodeRpcList: [
      PLQ_MAINNET,
    ],
    chainID: PLQ_MAIN_CHAINID,
    lookHash: PLQ_MAIN_EXPLORER + '/tx/',
    lookAddr: PLQ_MAIN_EXPLORER + '/address/',
    lookBlock: PLQ_MAIN_EXPLORER + '/block/',
    explorer: PLQ_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Planq',
    networkName: 'Planq mainnet',
    type: 'main',
    label: PLQ_MAIN_CHAINID,
  },
  // [PLQ_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: PLQ_TESTNET,
  //   nodeRpcList: [
  //     PLQ_TESTNET,
  //   ],
  //   chainID: PLQ_TEST_CHAINID,
  //   lookHash: PLQ_TEST_EXPLORER + '/tx/',
  //   lookAddr: PLQ_TEST_EXPLORER + '/address/',
  //   lookBlock: PLQ_TEST_EXPLORER + '/block/',
  //   explorer: PLQ_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'zkSync Era',
  //   networkName: 'zkSync Era testnet',
  //   networkLogo: 'zkSync',
  //   type: 'test',
  //   label: PLQ_TEST_CHAINID,
  // },
}