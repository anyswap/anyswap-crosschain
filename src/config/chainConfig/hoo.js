import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const HOO_MAIN_CHAINID = ChainId.HOO
export const HOO_MAINNET = getLocalRPC(HOO_MAIN_CHAINID, 'https://http-mainnet.hoosmartchain.com')
export const HOO_MAIN_EXPLORER = 'https://hooscan.com'

const symbol = 'HOO'

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
  [HOO_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: HOO_MAINNET,
    nodeRpcList: [
      HOO_MAINNET,
    ],
    chainID: HOO_MAIN_CHAINID,
    lookHash: HOO_MAIN_EXPLORER + '/tx/',
    lookAddr: HOO_MAIN_EXPLORER + '/address/',
    lookBlock: HOO_MAIN_EXPLORER + '/block/',
    explorer: HOO_MAIN_EXPLORER,
    symbol: symbol,
    name: 'HSC',
    networkName: 'HSC mainnet',
    walletName: 'Hoo Smart Chain',
    type: 'main',
    label: HOO_MAIN_CHAINID,
  },
}