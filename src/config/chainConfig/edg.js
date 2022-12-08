import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const EDG_MAIN_CHAINID = 2021
export const EDG_MAINNET = getLocalRPC(EDG_MAIN_CHAINID, 'https://edgeware-rpc.dwellir.com/')
export const EDG_MAIN_EXPLORER = 'https://edgscan.live'

export const tokenList = []
export const testTokenList = []

const symbol = 'EDG'

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
  [EDG_MAIN_CHAINID]: {
    wrappedToken: '0x457dE4e275A6b3C0D3750519221dD1dF19d54f01',
    tokenListUrl: tokenListUrl + EDG_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xF579269Aec2168E44FE4EBA632D942e9701331db',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: EDG_MAINNET,
    nodeRpcList: [EDG_MAINNET],
    chainID: EDG_MAIN_CHAINID,
    lookHash: EDG_MAIN_EXPLORER + '/tx/',
    lookAddr: EDG_MAIN_EXPLORER + '/address/',
    lookBlock: EDG_MAIN_EXPLORER + '/block/',
    explorer: EDG_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Edgeware',
    networkName: 'Edgeware Mainnet',
    networkLogo: 'EDG',
    type: 'main',
    label: EDG_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'EDG',
    anyToken: ''
  },
}