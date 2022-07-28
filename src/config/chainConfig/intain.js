import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const INTAIN_MAIN_CHAINID = ChainId.INTAIN
export const INTAIN_MAINNET = getLocalRPC(INTAIN_MAIN_CHAINID, '')
export const INTAIN_MAIN_EXPLORER = ''

export const INTAIN_TEST_CHAINID = ChainId.INTAIN_TEST
export const INTAIN_TESTNET = getLocalRPC(INTAIN_TEST_CHAINID, 'https://testnetrpc.multichain.org/intain')
export const INTAIN_TEST_EXPLORER = 'https://etherscan.io'

const symbol = 'ASTR'

const bridgeToken = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [INTAIN_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: INTAIN_MAINNET,
    nodeRpcList: [
      INTAIN_MAINNET,
    ],
    chainID: INTAIN_MAIN_CHAINID,
    lookHash: INTAIN_MAIN_EXPLORER + '/extrinsic/',
    lookAddr: INTAIN_MAIN_EXPLORER + '/account/',
    lookBlock: INTAIN_MAIN_EXPLORER + '/block/',
    explorer: INTAIN_MAIN_EXPLORER,
    symbol: symbol,
    name: 'INTAIN Network',
    networkName: 'INTAIN mainnet',
    networkLogo: 'INTAIN',
    type: 'main',
    label: INTAIN_MAIN_CHAINID,
  },
  [INTAIN_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xB44a9B6905aF7c801311e8F4E76932ee959c663C',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: INTAIN_TESTNET,
    nodeRpcList: [
      INTAIN_TESTNET,
      'http://165.227.5.156:9650/ext/bc/vur6P5LhdzYH9jgvMLsrca5ntVSwN2zWzDWD3Mmn9w7pixbQG/rpc'
    ],
    chainID: INTAIN_TEST_CHAINID,
    lookHash: INTAIN_TEST_EXPLORER + '/extrinsic/',
    lookAddr: INTAIN_TEST_EXPLORER + '/account/',
    lookBlock: INTAIN_TEST_EXPLORER + '/block/',
    explorer: INTAIN_TEST_EXPLORER,
    symbol: symbol,
    name: 'INTAIN Network',
    networkName: 'INTAIN testnet',
    networkLogo: 'INTAIN',
    type: 'test',
    label: INTAIN_TEST_CHAINID,
  },
}