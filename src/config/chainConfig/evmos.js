import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const EVMOS_MAIN_CHAINID = ChainId.EVMOS
export const EVMOS_MAINNET = getLocalRPC(EVMOS_MAIN_CHAINID, 'https://eth.bd.evmos.org:8545')
export const EVMOS_MAIN_EXPLORER = 'https://evm.evmos.org'

const symbol = 'EVMOS'

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
    bridgeInitChain: '1',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [EVMOS_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xdD2bc74E7a5e613379663e72689e668300b42f37',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: EVMOS_MAINNET,
    nodeRpcList: [
      EVMOS_MAINNET,
    ],
    chainID: EVMOS_MAIN_CHAINID,
    lookHash: EVMOS_MAIN_EXPLORER + '/tx/',
    lookAddr: EVMOS_MAIN_EXPLORER + '/address/',
    lookBlock: EVMOS_MAIN_EXPLORER + '/block/',
    explorer: EVMOS_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Evmos',
    networkName: 'Evmos mainnet',
    walletName: 'Evmos',
    type: 'main',
    label: EVMOS_MAIN_CHAINID,
  },
}