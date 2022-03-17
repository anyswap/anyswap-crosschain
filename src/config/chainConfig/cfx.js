import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const CFX_MAIN_CHAINID = ChainId.CFX
export const CFX_MAINNET = getLocalRPC(CFX_MAIN_CHAINID, 'https://evm.confluxrpc.com')
export const CFX_MAIN_EXPLORER = 'https://evm.confluxscan.io'

export const tokenList = []
export const testTokenList = []

const symbol = 'CFX'

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
  [CFX_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + CFX_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xAe8E9F3EA6a5b462b0Ae29aa1a3F6aC072365d9d',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: CFX_MAINNET,
    nodeRpcList: [
      CFX_MAINNET,
    ],
    chainID: CFX_MAIN_CHAINID,
    lookHash: CFX_MAIN_EXPLORER + '/tx/',
    lookAddr: CFX_MAIN_EXPLORER + '/address/',
    lookBlock: CFX_MAIN_EXPLORER + '/block/',
    explorer: CFX_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Conflux',
    networkName: 'Conflux mainnet',
    type: 'main',
    label: CFX_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'CFX',
    anyToken: ''
  },
}