import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const KEK_MAIN_CHAINID = 420420
export const KEK_MAINNET = getLocalRPC(KEK_MAIN_CHAINID, 'https://mainnet.kekchain.com')
export const KEK_MAIN_EXPLORER = 'https://mainnet-explorer.kekchain.com'

export const tokenList = []
export const testTokenList = []

const symbol = 'KEK'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [KEK_MAIN_CHAINID]: {
    wrappedToken: '0x71eC0cB8f7Dd4F4C5bD4204015c4C287fbDaA04A',
    tokenListUrl: tokenListUrl + KEK_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x781bB181833986C78238228F9AF0891829AF922B',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: KEK_MAINNET,
    nodeRpcList: [KEK_MAINNET],
    chainID: KEK_MAIN_CHAINID,
    lookHash: KEK_MAIN_EXPLORER + '/tx/',
    lookAddr: KEK_MAIN_EXPLORER + '/address/',
    lookBlock: KEK_MAIN_EXPLORER + '/block/',
    explorer: KEK_MAIN_EXPLORER,
    symbol: symbol,
    name: 'KeK',
    networkName: 'KeK Chain',
    networkLogo: 'KEK',
    type: 'main',
    label: KEK_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'KEK',
    anyToken: ''
  },
}