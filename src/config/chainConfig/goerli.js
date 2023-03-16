import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const GOERLI_MAIN_CHAINID = ChainId.GOERLI1
// export const GOERLI_MAINNET = getLocalRPC(GOERLI_MAIN_CHAINID, '')
// export const GOERLI_MAIN_EXPLORER = ''

export const GOERLI_TEST_CHAINID = ChainId.GOERLI1_TEST
export const GOERLI_TESTNET = getLocalRPC(GOERLI_TEST_CHAINID, 'https://goerli.optimism.io/')
export const GOERLI_TEST_EXPLORER = 'https://etherscan.io'

const symbol = 'GOERLI'

const bridgeToken = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  // [GOERLI_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: GOERLI_MAINNET,
  //   nodeRpcList: [
  //     GOERLI_MAINNET,
  //   ],
  //   chainID: GOERLI_MAIN_CHAINID,
  //   lookHash: GOERLI_MAIN_EXPLORER + '/extrinsic/',
  //   lookAddr: GOERLI_MAIN_EXPLORER + '/account/',
  //   lookBlock: GOERLI_MAIN_EXPLORER + '/block/',
  //   explorer: GOERLI_MAIN_EXPLORER,
  //   symbol: symbol,
  //   name: 'GOERLI Network',
  //   networkName: 'GOERLI mainnet',
  //   networkLogo: 'GOERLI',
  //   type: 'main',
  //   label: GOERLI_MAIN_CHAINID,
  // },
  [GOERLI_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xeFAeeE334F0Fd1712f9a8cc375f427D9Cdd40d73',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: GOERLI_TESTNET,
    nodeRpcList: [
      GOERLI_TESTNET,
      'https://goerli.optimism.io/',
      'https://goerli.etherscan.io/'
    ],
    chainID: GOERLI_TEST_CHAINID,
    lookHash: GOERLI_TEST_EXPLORER + '/extrinsic/',
    lookAddr: GOERLI_TEST_EXPLORER + '/account/',
    lookBlock: GOERLI_TEST_EXPLORER + '/block/',
    explorer: GOERLI_TEST_EXPLORER,
    symbol: symbol,
    name: 'GOERLI Network',
    networkName: 'GOERLI testnet',
    networkLogo: 'GOERLI',
    walletName: 'Optimism Goerli Testnet',
    type: 'test',
    label: GOERLI_TEST_CHAINID,
  },
}