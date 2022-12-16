import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const TT_MAIN_CHAINID = ChainId.TT
export const TT_MAINNET = getLocalRPC(TT_MAIN_CHAINID, 'https://mainnet-rpc.thundercore.io')
export const TT_MAIN_EXPLORER = 'https://viewblock.io/thundercore'

const symbol = 'TT'

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
  [TT_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: TT_MAINNET,
    nodeRpcList: [
      TT_MAINNET,
      'https://mainnet-rpc.thundertoken.net',
      'https://mainnet-rpc.thundercore.com',
    ],
    chainID: TT_MAIN_CHAINID,
    lookHash: TT_MAIN_EXPLORER + '/tx/',
    lookAddr: TT_MAIN_EXPLORER + '/address/',
    lookBlock: TT_MAIN_EXPLORER + '/block/',
    explorer: TT_MAIN_EXPLORER,
    symbol: symbol,
    name: 'ThunderCore',
    networkName: 'ThunderCore mainnet',
    walletName: 'ThunderCore Mainnet',
    type: 'main',
    label: TT_MAIN_CHAINID,
  },
}