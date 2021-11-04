import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const MOVR_MAIN_CHAINID = 1285
export const MOVR_MAINNET = getLocalRPC(MOVR_MAIN_CHAINID, 'https://rpc.moonriver.moonbeam.network')
export const MOVR_MAIN_EXPLORER = 'https://moonriver.moonscan.io'

export const tokenList = []
export const testTokenList = []

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
    nativeToken: '',
    crossBridgeInitToken: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c'
  },
}

export default {
  [MOVR_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + MOVR_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    // multicalToken: '0x2c78f1b70ccf63cdee49f9233e9faa99d43aa07e',
    multicalToken: '0x270f2F35bED92B7A59eA5F08F6B3fd34c8D9D9b5',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
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
    networkName: 'MOVR mainnet',
    type: 'main',
    label: MOVR_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'MOVR',
    anyToken: ''
  },
}