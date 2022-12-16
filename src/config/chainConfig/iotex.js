import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const IOTEX_MAIN_CHAINID = ChainId.IOTEX
export const IOTEX_MAINNET = getLocalRPC(IOTEX_MAIN_CHAINID, 'https://babel-api.mainnet.iotex.io')
export const IOTEX_MAIN_EXPLORER = 'https://iotexscan.io'


const symbol = 'IOTX'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '0xa00744882684c3e4747faefd68d283ea44099d03',
    bridgeInitChain: '56',
    nativeToken: '0xa00744882684c3e4747faefd68d283ea44099d03',
    crossBridgeInitToken: ''
  },
  [VERSION.V7]: {
    bridgeInitToken: '0xa00744882684c3e4747faefd68d283ea44099d03',
    bridgeInitChain: '56',
    nativeToken: '0xa00744882684c3e4747faefd68d283ea44099d03',
    crossBridgeInitToken: ''
  },
}

export default {
  [IOTEX_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xe6801928061cdbe32ac5ad0634427e140efd05f9',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: IOTEX_MAINNET,
    nodeRpcList: [
      IOTEX_MAINNET,
    ],
    chainID: IOTEX_MAIN_CHAINID,
    lookHash: IOTEX_MAIN_EXPLORER + '/tx/',
    lookAddr: IOTEX_MAIN_EXPLORER + '/address/',
    lookBlock: IOTEX_MAIN_EXPLORER + '/block/',
    explorer: IOTEX_MAIN_EXPLORER,
    symbol: symbol,
    name: 'IoTeX',
    networkName: 'IoTeX mainnet',
    walletName: 'IoTeX Network Mainnet',
    type: 'main',
    label: IOTEX_MAIN_CHAINID,
  },
}