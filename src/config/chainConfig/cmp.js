import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const CMP_MAIN_CHAINID = ChainId.CMP
export const CMP_MAINNET = getLocalRPC(CMP_MAIN_CHAINID, 'https://mainnet.block.caduceus.foundation')
export const CMP_MAIN_EXPLORER = 'https://mainnet.scan.caduceus.foundation'

const symbol = 'CMP'

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
    nativeToken: '0x192816e2ad6cc5d1bd309e5bd36bde5b7ef3ebd9',
    crossBridgeInitToken: ''
  },
}

export default {
  [CMP_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: CMP_MAINNET,
    nodeRpcList: [
      CMP_MAINNET,
    ],
    chainID: CMP_MAIN_CHAINID,
    lookHash: CMP_MAIN_EXPLORER + '/tx/',
    lookAddr: CMP_MAIN_EXPLORER + '/address/',
    lookBlock: CMP_MAIN_EXPLORER + '/block/',
    explorer: CMP_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Caduceus',
    networkName: 'Caduceus mainnet',
    walletName: 'CMP-Mainnet',
    type: 'main',
    label: CMP_MAIN_CHAINID,
  },
}