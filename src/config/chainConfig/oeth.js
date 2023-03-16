import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const OETH_MAIN_CHAINID = ChainId.BOBA
export const OETH_MAINNET = getLocalRPC(OETH_MAIN_CHAINID, 'https://mainnet.boba.network')
export const OETH_MAIN_EXPLORER = 'https://blockexplorer.boba.network'

const symbol = 'OETH'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b',
    bridgeInitChain: '56',
    nativeToken: '',
    OETHssBridgeInitToken: ''
  },
  [VERSION.V7]: {
    bridgeInitToken: '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b',
    bridgeInitChain: '56',
    nativeToken: '',
    OETHssBridgeInitToken: ''
  },
}

export default {
  [OETH_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: OETH_MAINNET,
    nodeRpcList: [
      OETH_MAINNET,
    ],
    chainID: OETH_MAIN_CHAINID,
    lookHash: OETH_MAIN_EXPLORER + '/tx/',
    lookAddr: OETH_MAIN_EXPLORER + '/address/',
    lookBlock: OETH_MAIN_EXPLORER + '/block/',
    explorer: OETH_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Boba',
    networkName: 'Boba mainnet',
    walletName: 'Boba Network',
    type: 'main',
    label: OETH_MAIN_CHAINID,
  },
}