import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const VLX_MAIN_CHAINID = ChainId.VLX
export const VLX_MAINNET = getLocalRPC(VLX_MAIN_CHAINID, 'https://evmexplorer.velas.com/rpc')
export const VLX_MAIN_EXPLORER = 'https://evmexplorer.velas.com'

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
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x624De1690fAf85B3B0b64d5c4ab3d9B195102e78',
    v1FactoryToken: '',
    v2FactoryToken: '',
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
    walletName: 'Velas EVM Mainnet',
    type: 'main',
    label: VLX_MAIN_CHAINID,
  },
}