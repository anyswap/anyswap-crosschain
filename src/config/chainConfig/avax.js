import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const AVAX_MAIN_CHAINID = 43114
export const AVAX_MAINNET = getLocalRPC(AVAX_MAIN_CHAINID, 'https://api.avax.network/ext/bc/C/rpc')
export const AVAX_MAIN_EXPLORER = 'https://cchain.explorer.avax.network/'

export const tokenList = [

]

const symbol = 'AVAX'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeRouterToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [AVAX_MAIN_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + AVAX_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: AVAX_MAINNET,
    chainID: AVAX_MAIN_CHAINID,
    lookHash: AVAX_MAIN_EXPLORER + '/tx/',
    lookAddr: AVAX_MAIN_EXPLORER + '/address/',
    lookBlock: AVAX_MAIN_EXPLORER + '/block/',
    explorer: AVAX_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Avalanche',
    networkName: 'AVAX mainnet',
    type: 'main',
    label: AVAX_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'AVAX',
    anyToken: '0xb44a9b6905af7c801311e8f4e76932ee959c663c'
  },
}