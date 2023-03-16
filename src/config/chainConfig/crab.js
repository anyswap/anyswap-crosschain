import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const CRAB_MAIN_CHAINID = ChainId.CRAB
export const CRAB_MAINNET = getLocalRPC(CRAB_MAIN_CHAINID, 'http://crab-rpc.darwinia.network')
export const CRAB_MAIN_EXPLORER = 'https://crab.subscan.io'

const symbol = 'CRAB'

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
  [CRAB_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: CRAB_MAINNET,
    nodeRpcList: [
      CRAB_MAINNET,
    ],
    chainID: CRAB_MAIN_CHAINID,
    lookHash: CRAB_MAIN_EXPLORER + '/extrinsic/',
    lookAddr: CRAB_MAIN_EXPLORER + '/account/',
    lookBlock: CRAB_MAIN_EXPLORER + '/block/',
    explorer: CRAB_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Darwinia Crab smart',
    networkName: 'Darwinia Crab smart mainnet',
    walletName: 'Darwinia Crab Network',
    type: 'main',
    label: CRAB_MAIN_CHAINID,
  },
}