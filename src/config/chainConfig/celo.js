import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const CELO_MAIN_CHAINID = 42220
export const CELO_MAINNET = getLocalRPC(CELO_MAIN_CHAINID, 'https://forno.celo.org')
export const CELO_MAIN_EXPLORER = 'https://explorer.celo.org'

export const tokenList = []
export const testTokenList = []

const symbol = 'CELO'

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
  [CELO_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + CELO_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: CELO_MAINNET,
    nodeRpcList: [
      CELO_MAINNET,
    ],
    chainID: CELO_MAIN_CHAINID,
    lookHash: CELO_MAIN_EXPLORER + '/tx/',
    lookAddr: CELO_MAIN_EXPLORER + '/address/',
    lookBlock: CELO_MAIN_EXPLORER + '/block/',
    explorer: CELO_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Celo',
    networkName: 'Celo mainnet',
    type: 'main',
    label: CELO_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'CELO',
    anyToken: ''
  },
}