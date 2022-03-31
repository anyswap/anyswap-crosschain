import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const ROSE_MAIN_CHAINID = ChainId.ROSE
export const ROSE_MAINNET = getLocalRPC(ROSE_MAIN_CHAINID, 'https://emerald.oasis.dev')
export const ROSE_MAIN_EXPLORER = 'https://explorer.emerald.oasis.dev'

export const tokenList = []
export const testTokenList = []

const symbol = 'ROSE'

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
  [ROSE_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + ROSE_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x624De1690fAf85B3B0b64d5c4ab3d9B195102e78',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: ROSE_MAINNET,
    nodeRpcList: [
      ROSE_MAINNET,
    ],
    chainID: ROSE_MAIN_CHAINID,
    lookHash: ROSE_MAIN_EXPLORER + '/tx/',
    lookAddr: ROSE_MAIN_EXPLORER + '/address/',
    lookBlock: ROSE_MAIN_EXPLORER + '/block/',
    explorer: ROSE_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Oasis Network',
    networkName: 'Oasis Network mainnet',
    type: 'main',
    label: ROSE_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'ROSE',
    anyToken: ''
  },
}