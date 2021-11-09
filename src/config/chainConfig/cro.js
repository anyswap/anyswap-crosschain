import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const CRO_MAIN_CHAINID = 25
export const CRO_MAINNET = getLocalRPC(CRO_MAIN_CHAINID, 'https://evm-cronos.crypto.org')
export const CRO_MAIN_EXPLORER = 'https://cronos.crypto.org/explorer'

export const tokenList = []
export const testTokenList = []

const symbol = 'CRO'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [CRO_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + CRO_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: CRO_MAINNET,
    nodeRpcList: [
      CRO_MAINNET,
    ],
    chainID: CRO_MAIN_CHAINID,
    lookHash: CRO_MAIN_EXPLORER + '/tx/',
    lookAddr: CRO_MAIN_EXPLORER + '/address/',
    lookBlock: CRO_MAIN_EXPLORER + '/block/',
    explorer: CRO_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Cronos',
    networkName: 'CRO mainnet',
    type: 'main',
    label: CRO_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'CRO',
    anyToken: ''
  },
}