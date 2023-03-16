import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const FUSE_MAIN_CHAINID = ChainId.FUSE
export const FUSE_MAINNET = getLocalRPC(FUSE_MAIN_CHAINID, 'https://rpc.fuse.io')
export const FUSE_MAIN_EXPLORER = 'https://explorer.fuse.io'

const symbol = 'FUSE'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '0x0be9e53fd7edac9f859882afdda116645287c629',
    crossBridgeInitToken: ''
  },
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '0x0be9e53fd7edac9f859882afdda116645287c629',
    crossBridgeInitToken: ''
  },
}

export default {
  [FUSE_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: FUSE_MAINNET,
    nodeRpcList: [
      FUSE_MAINNET,
      'https://fuse-mainnet.gateway.pokt.network'
    ],
    chainID: FUSE_MAIN_CHAINID,
    lookHash: FUSE_MAIN_EXPLORER + '/tx/',
    lookAddr: FUSE_MAIN_EXPLORER + '/address/',
    lookBlock: FUSE_MAIN_EXPLORER + '/block/',
    explorer: FUSE_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Fuse',
    networkName: 'Fuse mainnet',
    walletName: 'Fuse Mainnet',
    type: 'main',
    label: FUSE_MAIN_CHAINID,
  },
}