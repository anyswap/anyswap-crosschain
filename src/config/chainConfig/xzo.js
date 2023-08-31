import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const XZO_MAIN_CHAINID = 1229
export const XZO_MAINNET = getLocalRPC(XZO_MAIN_CHAINID, 'https://evm.exzo.network')
export const XZO_MAIN_EXPLORER = 'https://evm.exzoscan.io'

export const tokenList = []
export const testTokenList = []

const symbol = 'XZO'

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
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [XZO_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + XZO_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x2250191beF1EC106CFbAdbE9f3E926B7066a94d7',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: XZO_MAINNET,
    nodeRpcList: [
      XZO_MAINNET,
    ],
    chainID: XZO_MAIN_CHAINID,
    lookHash: XZO_MAIN_EXPLORER + '/tx/',
    lookAddr: XZO_MAIN_EXPLORER + '/address/',
    lookBlock: XZO_MAIN_EXPLORER + '/block/',
    explorer: XZO_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Exzo',
    networkName: 'Exzo Network',
    type: 'main',
    label: XZO_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'XZO',
    anyToken: ''
  },
}
