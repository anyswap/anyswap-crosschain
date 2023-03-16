import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION, CHAIN_TYPE} from '../constant'
import {ChainId} from './chainId'

export const TWEMIX_MAIN_CHAINID = ChainId.TWEMIX
export const TWEMIX_MAINNET = getLocalRPC(TWEMIX_MAIN_CHAINID, 'https://api.wemix.com/')
export const TWEMIX_MAIN_EXPLORER = 'https://explorer.wemix.com'

export const TWEMIX_TEST_CHAINID = ChainId.TWEMIX_TEST
export const TWEMIX_TESTNET = getLocalRPC(TWEMIX_TEST_CHAINID, 'https://api.test.wemix.com')
export const TWEMIX_TEST_EXPLORER = 'https://microscope.test.wemix.com'

const symbol = 'tWEMIX'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [TWEMIX_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: TWEMIX_MAINNET,
    nodeRpcList: [
      TWEMIX_MAINNET,
    ],
    chainID: TWEMIX_MAIN_CHAINID,
    lookHash: TWEMIX_MAIN_EXPLORER + '/tx/',
    lookAddr: TWEMIX_MAIN_EXPLORER + '/address/',
    lookBlock: TWEMIX_MAIN_EXPLORER + '/block/',
    explorer: TWEMIX_MAIN_EXPLORER,
    symbol: symbol,
    name: 'WEMIX3.0',
    networkName: 'WEMIX3.0 mainnet',
    networkLogo: 'WEMIX',
    walletName: 'WEMIX3.0 Mainnet',
    type: 'main',
    label: TWEMIX_MAIN_CHAINID,
    hotType: CHAIN_TYPE.HOT
  },
  [TWEMIX_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: TWEMIX_TESTNET,
    nodeRpcList: [
      TWEMIX_TESTNET,
    ],
    chainID: TWEMIX_TEST_CHAINID,
    lookHash: TWEMIX_TEST_EXPLORER + '/tx/',
    lookAddr: TWEMIX_TEST_EXPLORER + '/address/',
    lookBlock: TWEMIX_TEST_EXPLORER + '/block/',
    explorer: TWEMIX_TEST_EXPLORER,
    symbol: symbol,
    name: 'WEMIX3.0',
    networkName: 'WEMIX3.0 testnet',
    networkLogo: 'WEMIX',
    walletName: 'WEMIX3.0 Testnet',
    type: 'test',
    label: TWEMIX_TEST_CHAINID,
  },
}