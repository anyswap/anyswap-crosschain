import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const METIS_MAIN_CHAINID = 1088
export const METIS_MAINNET = getLocalRPC(METIS_MAIN_CHAINID, 'https://andromeda.metis.io/?owner=1088')
export const METIS_MAIN_EXPLORER = 'https://andromeda-explorer.metis.io'

export const tokenList = []
export const testTokenList = []

const symbol = 'METIS'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '1',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '1',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [METIS_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + METIS_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x7C598c96D02398d89FbCb9d41Eab3DF0C16F227D',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: METIS_MAINNET,
    nodeRpcList: [
      METIS_MAINNET,
    ],
    chainID: METIS_MAIN_CHAINID,
    lookHash: METIS_MAIN_EXPLORER + '/transaction/',
    lookAddr: METIS_MAIN_EXPLORER + '/address/',
    lookBlock: METIS_MAIN_EXPLORER + '/block/',
    explorer: METIS_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Metis',
    networkName: 'METIS mainnet',
    type: 'main',
    label: METIS_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'METIS',
    anyToken: ''
  },
}