import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const IOTEX_MAIN_CHAINID = 4689
export const IOTEX_MAINNET = getLocalRPC(IOTEX_MAIN_CHAINID, 'https://babel-api.mainnet.iotex.io')
export const IOTEX_MAIN_EXPLORER = 'https://iotexscan.io'

export const tokenList = []
export const testTokenList = []

const symbol = 'IOTX'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '0xa00744882684c3e4747faefd68d283ea44099d03',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [IOTEX_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + IOTEX_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xb44a9b6905af7c801311e8f4e76932ee959c663c',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: IOTEX_MAINNET,
    nodeRpcList: [
      IOTEX_MAINNET,
    ],
    chainID: IOTEX_MAIN_CHAINID,
    lookHash: IOTEX_MAIN_EXPLORER + '/tx/',
    lookAddr: IOTEX_MAIN_EXPLORER + '/address/',
    lookBlock: IOTEX_MAIN_EXPLORER + '/block/',
    explorer: IOTEX_MAIN_EXPLORER,
    symbol: symbol,
    name: 'IoTeX',
    networkName: 'IoTeX mainnet',
    type: 'main',
    label: IOTEX_MAIN_CHAINID,
    isSwitch: 1,
    underlying: [],
    suffix: 'IoTeX',
    anyToken: ''
  },
}