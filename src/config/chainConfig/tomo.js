import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const TOMO_MAIN_CHAINID = ChainId.TOMO
export const TOMO_MAINNET = getLocalRPC(TOMO_MAIN_CHAINID, 'https://rpc.tomochain.com')
export const TOMO_MAIN_EXPLORER = 'https://tomoscan.io'

export const tokenList = []
export const testTokenList = []

const symbol = 'TOMO'

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
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [TOMO_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + TOMO_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xf29848418cDdA0710Ae8d32e951E9DD5249a797B',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: TOMO_MAINNET,
    nodeRpcList: [
      TOMO_MAINNET,
    ],
    chainID: TOMO_MAIN_CHAINID,
    lookHash: TOMO_MAIN_EXPLORER + '/tx/',
    lookAddr: TOMO_MAIN_EXPLORER + '/address/',
    lookBlock: TOMO_MAIN_EXPLORER + '/block/',
    explorer: TOMO_MAIN_EXPLORER,
    symbol: symbol,
    name: 'TomoChain',
    networkName: 'TomoChain mainnet',
    type: 'main',
    label: TOMO_MAIN_CHAINID,
    isSwitch: 1,
    anyToken: ''
  },
}