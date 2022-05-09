import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const GT_MAIN_CHAINID = ChainId.GT
export const GT_MAINNET = getLocalRPC(GT_MAIN_CHAINID, 'https://evm.gatenode.cc')
export const GT_MAIN_EXPLORER = 'https://gatescan.org'

export const tokenList = []
export const testTokenList = []

const symbol = 'GT'

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
  [GT_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + GT_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xf29848418cDdA0710Ae8d32e951E9DD5249a797B',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: GT_MAINNET,
    nodeRpcList: [
      GT_MAINNET,
      'https://evm-hk.gatenode.cc'
    ],
    chainID: GT_MAIN_CHAINID,
    lookHash: GT_MAIN_EXPLORER + '/tx/',
    lookAddr: GT_MAIN_EXPLORER + '/address/',
    lookBlock: GT_MAIN_EXPLORER + '/block/',
    explorer: GT_MAIN_EXPLORER,
    symbol: symbol,
    name: 'GateChain',
    networkName: 'GateChain mainnet',
    type: 'main',
    label: GT_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'GT',
    anyToken: ''
  },
}