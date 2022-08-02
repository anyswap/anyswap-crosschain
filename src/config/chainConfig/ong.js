import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const ONG_MAIN_CHAINID = ChainId.ONG
export const ONG_MAINNET = getLocalRPC(ONG_MAIN_CHAINID, 'https://dappnode3.ont.io:10339')
export const ONG_MAIN_EXPLORER = 'https://explorer.ont.io'

// export const ONG_TEST_CHAINID = ChainId.ONG_TEST
// export const ONG_TESTNET = getLocalRPC(ONG_TEST_CHAINID, 'https://rpc.testnet.fantom.network')
// export const ONG_TEST_EXPLORER = 'https://testnet.ONGscan.com/'

const symbol = 'ONG'

const bridgeToken = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [ONG_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xC931f61B1534EB21D8c11B24f3f5Ab2471d4aB50',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: ONG_MAINNET,
    nodeRpcList: [
      ONG_MAINNET,
      'https://dappnode1.ont.io:10339',
      'https://dappnode2.ont.io:10339',
      'https://dappnode3.ont.io:10339',
      'https://dappnode4.ont.io:10339',
    ],
    chainID: ONG_MAIN_CHAINID,
    lookHash: ONG_MAIN_EXPLORER + '/tx/',
    lookAddr: ONG_MAIN_EXPLORER + '/address/',
    lookBlock: ONG_MAIN_EXPLORER + '/block/',
    explorer: ONG_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Ontology',
    networkName: 'Ontology mainnet',
    type: 'main',
    label: ONG_MAIN_CHAINID,
  },
  // [ONG_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '0x5aF9b9de61F645C08eA4540C177737C6c6622060',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: ONG_TESTNET,
  //   nodeRpcList: [
  //     ONG_TESTNET,
  //   ],
  //   chainID: ONG_TEST_CHAINID,
  //   lookHash: ONG_TEST_EXPLORER + '/tx/',
  //   lookAddr: ONG_TEST_EXPLORER + '/address/',
  //   lookBlock: ONG_TEST_EXPLORER + '/block/',
  //   explorer: ONG_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Fantom',
  //   networkName: 'Fantom testnet',
  //   type: 'test',
  //   label: ONG_TEST_CHAINID,
  // },
}