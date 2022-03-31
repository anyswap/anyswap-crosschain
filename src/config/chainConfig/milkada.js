import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const MIKO_MAIN_CHAINID = ChainId.MIKO
export const MIKO_MAINNET = getLocalRPC(MIKO_MAIN_CHAINID, 'https://rpc.c1.milkomeda.com:8545')
export const MIKO_MAIN_EXPLORER = 'https://rpc.c1.milkomeda.com:4000'

export const tokenList = []
export const testTokenList = []

const symbol = 'milkADA'

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
  [MIKO_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + MIKO_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: MIKO_MAINNET,
    nodeRpcList: [
      MIKO_MAINNET,
    ],
    chainID: MIKO_MAIN_CHAINID,
    lookHash: MIKO_MAIN_EXPLORER + '/tx/',
    lookAddr: MIKO_MAIN_EXPLORER + '/address/',
    lookBlock: MIKO_MAIN_EXPLORER + '/block/',
    explorer: MIKO_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Milkomeda',
    networkName: 'Milkomeda mainnet',
    type: 'main',
    label: MIKO_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'milkADA',
    anyToken: ''
  },
}