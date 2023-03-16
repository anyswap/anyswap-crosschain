import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION, CHAIN_TYPE} from '../constant'
import {ChainId} from './chainId'

export const MOVR_MAIN_CHAINID = ChainId.MOVR
export const MOVR_MAINNET = getLocalRPC(MOVR_MAIN_CHAINID, 'https://rpc.moonriver.moonbeam.network')
export const MOVR_MAIN_EXPLORER = 'https://moonriver.moonscan.io'

const symbol = 'MOVR'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V2_2]: {
    bridgeInitToken: '0x0cae51e1032e8461f4806e26332c030e34de3adb',
    bridgeInitChain: '56'
  },
  [VERSION.V4_MOVR]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c'
  },
  [VERSION.V5]: {
    bridgeInitToken: '0x0cae51e1032e8461f4806e26332c030e34de3adb',
    bridgeInitChain: '56',
    nativeToken: '0x98878b06940ae243284ca214f92bb71a2b032b8a',
    crossBridgeInitToken: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c'
  },
  [VERSION.V7]: {
    bridgeInitToken: '0x0cae51e1032e8461f4806e26332c030e34de3adb',
    bridgeInitChain: '56',
    nativeToken: '0x98878b06940ae243284ca214f92bb71a2b032b8a',
    crossBridgeInitToken: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c'
  },
}

export default {
  [MOVR_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x270f2F35bED92B7A59eA5F08F6B3fd34c8D9D9b5',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: MOVR_MAINNET,
    nodeRpcList: [
      MOVR_MAINNET,
    ],
    chainID: MOVR_MAIN_CHAINID,
    lookHash: MOVR_MAIN_EXPLORER + '/tx/',
    lookAddr: MOVR_MAIN_EXPLORER + '/address/',
    lookBlock: MOVR_MAIN_EXPLORER + '/block/',
    explorer: MOVR_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Moonriver',
    networkName: 'Moonriver mainnet',
    walletName: 'Moonriver',
    type: 'main',
    label: MOVR_MAIN_CHAINID,
    hotType: CHAIN_TYPE.HOT
  },
}