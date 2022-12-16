import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const TLOS_MAIN_CHAINID = ChainId.TLOS
export const TLOS_MAINNET = getLocalRPC(TLOS_MAIN_CHAINID, 'https://rpc1.us.telos.net/evm')
export const TLOS_MAIN_EXPLORER = 'https://www.teloscan.io'

const symbol = 'TLOS'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '0xd102ce6a4db07d247fcc28f366a623df0938ca9e',
    bridgeInitChain: '1',
    nativeToken: '0xd102ce6a4db07d247fcc28f366a623df0938ca9e',
    crossBridgeInitToken: '0xfa9343c3897324496a05fc75abed6bac29f8a40f'
  },
  [VERSION.V7]: {
    bridgeInitToken: '0xd102ce6a4db07d247fcc28f366a623df0938ca9e',
    bridgeInitChain: '1',
    nativeToken: '0xd102ce6a4db07d247fcc28f366a623df0938ca9e',
    crossBridgeInitToken: '0xfa9343c3897324496a05fc75abed6bac29f8a40f'
  },
}

export default {
  [TLOS_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xE1A34ca06e57f981A51C6a9518d1bCDAb3cE1c6d',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: TLOS_MAINNET,
    nodeRpcList: [
      TLOS_MAINNET,
      'https://rpc1.eu.telos.net/evm'
    ],
    chainID: TLOS_MAIN_CHAINID,
    lookHash: TLOS_MAIN_EXPLORER + '/tx/',
    lookAddr: TLOS_MAIN_EXPLORER + '/address/',
    lookBlock: TLOS_MAIN_EXPLORER + '/block/',
    explorer: TLOS_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Telos',
    networkName: 'Telos mainnet',
    walletName: 'Telos EVM Mainnet',
    type: 'main',
    label: TLOS_MAIN_CHAINID,
  },
}