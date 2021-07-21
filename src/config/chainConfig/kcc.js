import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const KCC_MAIN_CHAINID = 321
export const KCC_MAINNET = getLocalRPC(KCC_MAIN_CHAINID, 'https://rpc-mainnet.kcc.network')
export const KCC_MAIN_EXPLORER = 'https://explorer.kcc.io/cn'

export const tokenList = []
export const testTokenList = []

const symbol = 'KCC'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeRouterToken: '',
    bridgeInitChain: '',
  }
}

export default {
  [KCC_MAIN_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + KCC_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: KCC_MAINNET,
    chainID: KCC_MAIN_CHAINID,
    lookHash: KCC_MAIN_EXPLORER + '/tx/',
    lookAddr: KCC_MAIN_EXPLORER + '/address/',
    lookBlock: KCC_MAIN_EXPLORER + '/block/',
    explorer: KCC_MAIN_EXPLORER,
    symbol: symbol,
    name: 'KCC',
    networkName: 'KCC mainnet',
    type: 'main',
    label: KCC_MAIN_CHAINID,
    isSwitch: 1,
    underlying: [],
    suffix: '',
    anyToken: ''
  },
}