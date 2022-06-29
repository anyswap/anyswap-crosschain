import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const AME_MAIN_CHAINID = 180
export const AME_MAINNET = getLocalRPC(AME_MAIN_CHAINID, 'https://node1.amechain.io')
export const AME_MAIN_EXPLORER = 'https://amescan.io'

export const tokenList = []
export const testTokenList = []

const symbol = 'AME'

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
  [AME_MAIN_CHAINID]: {
    wrappedToken: '0xCc9bD40124EfedF6F198B8b5b50697dC635FaaC4',
    tokenListUrl: tokenListUrl + AME_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x1763d5e86452Ed9C13b874fDe60A0669D11C5d40',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: AME_MAINNET,
    nodeRpcList: [AME_MAINNET],
    chainID: AME_MAIN_CHAINID,
    lookHash: AME_MAIN_EXPLORER + '/tx/',
    lookAddr: AME_MAIN_EXPLORER + '/address/',
    lookBlock: AME_MAIN_EXPLORER + '/block/',
    explorer: AME_MAIN_EXPLORER,
    symbol: symbol,
    name: 'AME Chain',
    networkName: 'AME Chain Mainnet',
    networkLogo: 'AME',
    type: 'main',
    label: AME_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'AME',
    anyToken: ''
  },
}