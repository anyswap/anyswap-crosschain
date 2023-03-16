import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import { ChainId } from './chainId'

export const REI_MAIN_CHAINID = ChainId.REI
export const REI_MAINNET = getLocalRPC(REI_MAIN_CHAINID, 'https://rpc-mainnet.rei.network')
export const REI_MAIN_EXPLORER = 'https://scan.rei.network'

const symbol = 'REI'

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
  [REI_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x9e8955847586682971a53e1a2428CA7354A655f2',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: REI_MAINNET,
    nodeRpcList: [
      REI_MAINNET,
    ],
    chainID: REI_MAIN_CHAINID,
    lookHash: REI_MAIN_EXPLORER + '/tx/',
    lookAddr: REI_MAIN_EXPLORER + '/address/',
    lookBlock: REI_MAIN_EXPLORER + '/block/',
    explorer: REI_MAIN_EXPLORER,
    symbol: symbol,
    name: 'REI',
    networkName: 'REI mainnet',
    walletName: 'REI Network',
    type: 'main',
    label: REI_MAIN_CHAINID,
  },
}