import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const VLX_MAIN_CHAINID = 106
export const VLX_MAINNET = getLocalRPC(VLX_MAIN_CHAINID, 'https://evmexplorer.velas.com/rpc')
export const VLX_MAIN_EXPLORER = 'https://evmexplorer.velas.com'

export const tokenList = []
export const testTokenList = []

const symbol = 'VLX'

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
  [VLX_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + VLX_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x624De1690fAf85B3B0b64d5c4ab3d9B195102e78',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: VLX_MAINNET,
    nodeRpcList: [
      VLX_MAINNET,
    ],
    chainID: VLX_MAIN_CHAINID,
    lookHash: VLX_MAIN_EXPLORER + '/tx/',
    lookAddr: VLX_MAIN_EXPLORER + '/address/',
    lookBlock: VLX_MAIN_EXPLORER + '/block/',
    explorer: VLX_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Velas',
    networkName: 'Velas mainnet',
    type: 'main',
    label: VLX_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'VLX',
    anyToken: ''
  },
}