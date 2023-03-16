import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const KAI_MAIN_CHAINID = ChainId.KAI
export const KAI_MAINNET = getLocalRPC(KAI_MAIN_CHAINID, 'https://rpc.kardiachain.io')
export const KAI_MAIN_EXPLORER = 'https://explorer.kardiachain.io'

const symbol = 'KAI'

const bridgeToken = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [KAI_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: KAI_MAINNET,
    nodeRpcList: [
      KAI_MAINNET,
    ],
    chainID: KAI_MAIN_CHAINID,
    lookHash: KAI_MAIN_EXPLORER + '/tx/',
    lookAddr: KAI_MAIN_EXPLORER + '/address/',
    lookBlock: KAI_MAIN_EXPLORER + '/block/',
    explorer: KAI_MAIN_EXPLORER,
    symbol: symbol,
    name: 'KardiaChain',
    networkName: 'KardiaChain mainnet',
    walletName: 'KardiaChain Mainnet',
    type: 'main',
    label: KAI_MAIN_CHAINID,
  },
}