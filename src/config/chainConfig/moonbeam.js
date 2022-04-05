import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const GLMR_MAIN_CHAINID = 1284
export const GLMR_MAINNET = getLocalRPC(GLMR_MAIN_CHAINID, 'https://rpc.api.moonbeam.network')
export const GLMR_MAIN_EXPLORER = 'https://moonscan.io'

export const tokenList = []
export const testTokenList = []

const symbol = 'GLMR'

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
  [GLMR_MAIN_CHAINID]: {
    wrappedToken: '0xacc15dc74880c9944775448304b263d191c6077f',
    tokenListUrl: tokenListUrl + GLMR_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: GLMR_MAINNET,
    nodeRpcList: [
      GLMR_MAINNET,
    ],
    chainID: GLMR_MAIN_CHAINID,
    lookHash: GLMR_MAIN_EXPLORER + '/tx/',
    lookAddr: GLMR_MAIN_EXPLORER + '/address/',
    lookBlock: GLMR_MAIN_EXPLORER + '/block/',
    explorer: GLMR_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Moonbeam',
    networkName: 'Moonbeam mainnet',
    type: 'main',
    label: GLMR_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'GLMR',
    anyToken: ''
  },
}