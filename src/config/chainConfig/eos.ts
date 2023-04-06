import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const EOS_MAIN_CHAINID = ChainId.EOS
// export const EOS_MAINNET = getLocalRPC(EOS_MAIN_CHAINID, 'https://rpc-mainnet.findora.org')
// export const EOS_MAIN_EXPLORER = 'https://evm.findorascan.io'

export const EOS_TEST_CHAINID = ChainId.EOS_TEST
// export const EOS_TESTNET = getLocalRPC(EOS_TEST_CHAINID, 'https://api.testnet.evm.eosnetwork.com')
export const EOS_TESTNET = getLocalRPC(EOS_TEST_CHAINID, 'https://api-testnet2.trust.one')
export const EOS_TEST_EXPLORER = 'https://explorer-testnet2.trust.one'

const symbol = 'EOS'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  // [EOS_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: EOS_MAINNET,
  //   nodeRpcList: [
  //     EOS_MAINNET,
  //   ],
  //   chainID: EOS_MAIN_CHAINID,
  //   lookHash: EOS_MAIN_EXPLORER + '/tx/',
  //   lookAddr: EOS_MAIN_EXPLORER + '/address/',
  //   lookBlock: EOS_MAIN_EXPLORER + '/block/',
  //   explorer: EOS_MAIN_EXPLORER,
  //   symbol: symbol,
  //   name: 'Findora',
  //   networkName: 'Findora mainnet',
  //   type: 'main',
  //   label: EOS_MAIN_CHAINID,
  // },
  [EOS_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: EOS_TESTNET,
    nodeRpcList: [
      EOS_TESTNET,
      'https://api.testnet.evm.eosnetwork.com',
      'https://api-testnet2.trust.one'
    ],
    chainID: EOS_TEST_CHAINID,
    lookHash: EOS_TEST_EXPLORER + '/tx/',
    lookAddr: EOS_TEST_EXPLORER + '/address/',
    lookBlock: EOS_TEST_EXPLORER + '/block/',
    explorer: EOS_TEST_EXPLORER,
    symbol: symbol,
    name: 'EOS',
    networkName: 'EOS testnet',
    type: 'test',
    label: EOS_TEST_CHAINID,
  },
}