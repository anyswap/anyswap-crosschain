import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const ONT_MAIN_CHAINID = ChainId.ONT
export const ONT_MAINNET = getLocalRPC(ONT_MAIN_CHAINID, 'https://dappnode3.ont.io:10339')
export const ONT_MAIN_EXPLORER = 'https://explorer.ont.io'

// export const ONT_TEST_CHAINID = ChainId.ONT_TEST
// export const ONT_TESTNET = getLocalRPC(ONT_TEST_CHAINID, 'https://rpc.testnet.fantom.network')
// export const ONT_TEST_EXPLORER = 'https://testnet.ONTscan.com/'

const symbol = 'ONT'

const bridgeToken = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [ONT_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xC931f61B1534EB21D8c11B24f3f5Ab2471d4aB50',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: ONT_MAINNET,
    nodeRpcList: [
      ONT_MAINNET,
      'https://dappnode1.ont.io:10339',
      'https://dappnode2.ont.io:10339',
      'https://dappnode3.ont.io:10339',
      'https://dappnode4.ont.io:10339',
    ],
    chainID: ONT_MAIN_CHAINID,
    lookHash: ONT_MAIN_EXPLORER + '/tx/',
    lookAddr: ONT_MAIN_EXPLORER + '/address/',
    lookBlock: ONT_MAIN_EXPLORER + '/block/',
    explorer: ONT_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Ontology',
    networkName: 'Ontology mainnet',
    walletName: 'Ontology Mainnet',
    type: 'main',
    label: ONT_MAIN_CHAINID,
  },
  // [ONT_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '0x5aF9b9de61F645C08eA4540C177737C6c6622060',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: ONT_TESTNET,
  //   nodeRpcList: [
  //     ONT_TESTNET,
  //   ],
  //   chainID: ONT_TEST_CHAINID,
  //   lookHash: ONT_TEST_EXPLORER + '/tx/',
  //   lookAddr: ONT_TEST_EXPLORER + '/address/',
  //   lookBlock: ONT_TEST_EXPLORER + '/block/',
  //   explorer: ONT_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Fantom',
  //   networkName: 'Fantom testnet',
  //   type: 'test',
  //   label: ONT_TEST_CHAINID,
  // },
}