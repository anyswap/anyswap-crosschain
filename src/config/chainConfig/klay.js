import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const KLAY_MAIN_CHAINID = ChainId.KLAY
export const KLAY_MAINNET = getLocalRPC(KLAY_MAIN_CHAINID, 'https://public-node-api.klaytnapi.com/v1/cypress')
export const KLAY_MAIN_EXPLORER = 'https://scope.klaytn.com'

const symbol = 'KLAY'

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
  [KLAY_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x80A16016cC4A2E6a2CACA8a4a498b1699fF0f844',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: KLAY_MAINNET,
    nodeRpcList: [
      KLAY_MAINNET,
    ],
    chainID: KLAY_MAIN_CHAINID,
    lookHash: KLAY_MAIN_EXPLORER + '/tx/',
    lookAddr: KLAY_MAIN_EXPLORER + '/address/',
    lookBlock: KLAY_MAIN_EXPLORER + '/block/',
    explorer: KLAY_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Klaytn',
    networkName: 'Klaytn mainnet',
    type: 'main',
    label: KLAY_MAIN_CHAINID,
  },
}