import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const ROSE_MAIN_CHAINID = ChainId.ROSE
export const ROSE_MAINNET = getLocalRPC(ROSE_MAIN_CHAINID, 'https://emerald.oasis.dev')
export const ROSE_MAIN_EXPLORER = 'https://explorer.emerald.oasis.dev'

const symbol = 'ROSE'

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
  [ROSE_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x624De1690fAf85B3B0b64d5c4ab3d9B195102e78',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: ROSE_MAINNET,
    nodeRpcList: [
      ROSE_MAINNET,
    ],
    chainID: ROSE_MAIN_CHAINID,
    lookHash: ROSE_MAIN_EXPLORER + '/tx/',
    lookAddr: ROSE_MAIN_EXPLORER + '/address/',
    lookBlock: ROSE_MAIN_EXPLORER + '/block/',
    explorer: ROSE_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Oasis Network',
    networkName: 'Oasis Network mainnet',
    walletName: 'Oasis Emerald ParaTime Mainnet',
    type: 'main',
    label: ROSE_MAIN_CHAINID,
  },
}