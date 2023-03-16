import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION, CHAIN_TYPE} from '../constant'
import {ChainId} from './chainId'

export const BTC_MAIN_CHAINID = ChainId.BTC
export const BTC_MAINNET = getLocalRPC(BTC_MAIN_CHAINID, 'https://blockstream.info/api')
export const BTC_MAIN_EXPLORER = 'https://blockstream.info'

export const BTC_TEST_CHAINID = ChainId.BTC_TEST
export const BTC_TESTNET = getLocalRPC(BTC_TEST_CHAINID, 'https://blockstream.info/testnet/api')
export const BTC_TEST_EXPLORER = 'https://blockstream.info/testnet'

const symbol = 'BTC'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [BTC_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: BTC_MAINNET,
    nodeRpcList: [],
    chainID: BTC_MAIN_CHAINID,
    lookHash: BTC_MAIN_EXPLORER + '/tx/',
    lookAddr: BTC_MAIN_EXPLORER + '/address/',
    lookBlock: BTC_MAIN_EXPLORER + '/block/',
    explorer: BTC_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Bitcoin',
    networkName: 'Bitcoin mainnet',
    type: 'main',
    label: BTC_MAIN_CHAINID,
    // chainType: BTC_MAIN_CHAINID
    chainType: 'NOWALLET',
    hotType: CHAIN_TYPE.HOT
  },
  [BTC_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: BTC_TESTNET,
    nodeRpcList: [
      BTC_TESTNET
    ],
    chainID: BTC_TEST_CHAINID,
    lookHash: BTC_TEST_EXPLORER + '/tx/',
    lookAddr: BTC_TEST_EXPLORER + '/address/',
    lookBlock: BTC_TEST_EXPLORER + '/block/',
    explorer: BTC_TEST_EXPLORER,
    symbol: symbol,
    name: 'Bitcoin',
    networkName: 'Bitcoin testnet',
    type: 'test',
    label: BTC_TEST_CHAINID,
    chainType: BTC_TEST_CHAINID,
    chainType: 'NOWALLET'
  }
}