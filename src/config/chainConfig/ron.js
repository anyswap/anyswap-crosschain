import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const RON_MAIN_CHAINID = ChainId.RON
export const RON_MAINNET = getLocalRPC(RON_MAIN_CHAINID, 'https://api.roninchain.com/rpc')
export const RON_MAIN_EXPLORER = 'https://explorer.roninchain.com'


const symbol = 'RON'

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
  [RON_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: RON_MAINNET,
    nodeRpcList: [
      RON_MAINNET,
    ],
    chainID: RON_MAIN_CHAINID,
    lookHash: RON_MAIN_EXPLORER + '/tx/',
    lookAddr: RON_MAIN_EXPLORER + '/address/',
    lookBlock: RON_MAIN_EXPLORER + '/block/',
    explorer: RON_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Ronin',
    networkName: 'Ronin mainnet',
    type: 'main',
    label: RON_MAIN_CHAINID,
  },
}