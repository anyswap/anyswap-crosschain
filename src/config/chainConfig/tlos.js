import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const TLOS_MAIN_CHAINID = 40
export const TLOS_MAINNET = getLocalRPC(TLOS_MAIN_CHAINID, 'https://rpc1.us.telos.net/evm')
export const TLOS_MAIN_EXPLORER = 'https://rpc1.us.telos.net/v2/explore/evm'

export const tokenList = []
export const testTokenList = []

const symbol = 'TLOS'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '0x2c78f1b70ccf63cdee49f9233e9faa99d43aa07e',
    bridgeInitChain: '1',
    nativeToken: '',
    crossBridgeInitToken: '0xfa9343c3897324496a05fc75abed6bac29f8a40f'
  },
}

export default {
  [TLOS_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + TLOS_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xE1A34ca06e57f981A51C6a9518d1bCDAb3cE1c6d',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: TLOS_MAINNET,
    nodeRpcList: [
      TLOS_MAINNET,
      'https://rpc1.eu.telos.net/evm'
    ],
    chainID: TLOS_MAIN_CHAINID,
    lookHash: TLOS_MAIN_EXPLORER + '/transaction/',
    lookAddr: TLOS_MAIN_EXPLORER + '/address/',
    lookBlock: TLOS_MAIN_EXPLORER + '/block/',
    explorer: TLOS_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Telos',
    networkName: 'TLOS mainnet',
    type: 'main',
    label: TLOS_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'TLOS',
    anyToken: ''
  },
}