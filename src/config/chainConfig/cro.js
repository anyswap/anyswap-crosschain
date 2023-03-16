import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const CRO_MAIN_CHAINID = ChainId.CRO
// export const CRO_MAINNET = getLocalRPC(CRO_MAIN_CHAINID, 'https://cronode1.anyswap.exchange')
export const CRO_MAINNET = getLocalRPC(CRO_MAIN_CHAINID, 'https://evm.cronos.org')
export const CRO_MAIN_EXPLORER = 'https://cronoscan.com'

export const CRO_TEST_CHAINID = ChainId.CRO_TEST
export const CRO_TESTNET = getLocalRPC(CRO_TEST_CHAINID, 'https://testnet-archive.cronoslabs.com/v1/ea75c3ba4d1119d22cffaa6f83c96a94')
export const CRO_TEST_EXPLORER = 'https://testnet.cronoscan.com'

const symbol = 'CRO'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V7]: {
    bridgeInitToken: '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [CRO_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: CRO_MAINNET,
    nodeRpcList: [
      CRO_MAINNET,
      'https://evm-cronos.crypto.org'
    ],
    chainID: CRO_MAIN_CHAINID,
    lookHash: CRO_MAIN_EXPLORER + '/tx/',
    lookAddr: CRO_MAIN_EXPLORER + '/address/',
    lookBlock: CRO_MAIN_EXPLORER + '/block/',
    explorer: CRO_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Cronos',
    networkName: 'Cronos mainnet',
    walletName: 'Cronos Mainnet Beta',
    type: 'main',
    label: CRO_MAIN_CHAINID,
  },
  [CRO_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: CRO_TESTNET,
    nodeRpcList: [
      CRO_TESTNET,
    ],
    chainID: CRO_TEST_CHAINID,
    lookHash: CRO_TEST_EXPLORER + '/tx/',
    lookAddr: CRO_TEST_EXPLORER + '/address/',
    lookBlock: CRO_TEST_EXPLORER + '/block/',
    explorer: CRO_TEST_EXPLORER,
    symbol: symbol,
    name: 'Cronos',
    networkName: 'Cronos testnet',
    walletName: 'Cronos Testnet',
    type: 'test',
    label: CRO_TEST_CHAINID,
  },
}