import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const LINEA_MAIN_CHAINID = ChainId.LINEA
// export const LINEA_MAINNET = getLocalRPC(LINEA_MAIN_CHAINID, 'https://rpc-mainnet.findora.org')
// export const LINEA_MAIN_EXPLORER = 'https://evm.findorascan.io'

export const LINEA_TEST_CHAINID = ChainId.LINEA_TEST
export const LINEA_TESTNET = getLocalRPC(LINEA_TEST_CHAINID, 'https://consensys-zkevm-goerli-prealpha.infura.io/v3/a21bf4e97bc54c7ea50bea3e10bfecab')
export const LINEA_TEST_EXPLORER = 'https://explorer.goerli.linea.build'

const symbol = 'ETH'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  // [LINEA_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: LINEA_MAINNET,
  //   nodeRpcList: [
  //     LINEA_MAINNET,
  //   ],
  //   chainID: LINEA_MAIN_CHAINID,
  //   lookHash: LINEA_MAIN_EXPLORER + '/tx/',
  //   lookAddr: LINEA_MAIN_EXPLORER + '/address/',
  //   lookBlock: LINEA_MAIN_EXPLORER + '/block/',
  //   explorer: LINEA_MAIN_EXPLORER,
  //   symbol: symbol,
  //   name: 'Findora',
  //   networkName: 'Findora mainnet',
    // networkLogo: 'LINEA',
  //   type: 'main',
  //   label: LINEA_MAIN_CHAINID,
  // },
  [LINEA_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: LINEA_TESTNET,
    nodeRpcList: [
      LINEA_TESTNET,
    ],
    chainID: LINEA_TEST_CHAINID,
    lookHash: LINEA_TEST_EXPLORER + '/tx/',
    lookAddr: LINEA_TEST_EXPLORER + '/address/',
    lookBlock: LINEA_TEST_EXPLORER + '/block/',
    explorer: LINEA_TEST_EXPLORER,
    symbol: symbol,
    name: 'Linea zkevm',
    networkName: 'Linea zkevm testnet',
    networkLogo: 'LINEA',
    type: 'test',
    label: LINEA_TEST_CHAINID,
  },
}