import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const DXT_MAIN_CHAINID = ChainId.DXT
export const DXT_MAINNET = getLocalRPC(DXT_MAIN_CHAINID, 'https://dxt.dexit.network')
export const DXT_MAIN_EXPLORER = 'https://dxtscan.com'

export const DXT_TEST_CHAINID = ChainId.DXT_TEST
export const DXT_TESTNET = getLocalRPC(DXT_TEST_CHAINID, 'https://testnet.dexit.network')
export const DXT_TEST_EXPLORER = 'https://testnet.dxtscan.com'

const symbol = 'DXT'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [DXT_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: DXT_MAINNET,
    nodeRpcList: [
      DXT_MAINNET,
    ],
    chainID: DXT_MAIN_CHAINID,
    lookHash: DXT_MAIN_EXPLORER + '/tx/',
    lookAddr: DXT_MAIN_EXPLORER + '/address/',
    lookBlock: DXT_MAIN_EXPLORER + '/block/',
    explorer: DXT_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Dexit Network',
    networkName: 'Dexit Network mainnet',
    walletName: 'Dexit Network',
    type: 'main',
    label: DXT_MAIN_CHAINID,
  },
  [DXT_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: DXT_TESTNET,
    nodeRpcList: [
      DXT_TESTNET,
    ],
    chainID: DXT_TEST_CHAINID,
    lookHash: DXT_TEST_EXPLORER + '/tx/',
    lookAddr: DXT_TEST_EXPLORER + '/address/',
    lookBlock: DXT_TEST_EXPLORER + '/block/',
    explorer: DXT_TEST_EXPLORER,
    symbol: symbol,
    name: 'Dexit Network',
    networkName: 'Dexit Network testnet',
    type: 'test',
    label: DXT_TEST_CHAINID,
  },
}