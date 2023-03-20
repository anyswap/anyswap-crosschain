
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const REEF_MAINNET_WS = 'wss://rpc.reefscan.info/ws'
// export const REEF_MAINNET_WS = 'wss://rpc.reefscan.com/ws'
// export const REEF_MAINNET = 'https://reefscan.com/graphql'
export const REEF_MAINNET = 'https://rpc.reefscan.com'
// export const REEF_MAINNET = process.env.NODE_ENV === 'development' ? 'https://reefscan.com/graphql' : 'https://squid.subsquid.io/reef-bridge/v/v1/graphql'
export const REEF_MAIN_CHAINID = ChainId.REEF
export const REEF_MAIN_EXPLORER = 'https://reefscan.com'

export const REEF_TESTNET = 'https://rpc.reefscan.com'
export const REEF_TEST_CHAINID = ChainId.REEF_TEST
export const REEF_TEST_EXPLORER = 'https://reefscan.com'

const symbol = 'REEF'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [REEF_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: REEF_MAINNET,
    graphql: 'https://reefscan.com/graphql',
    nodeRpcWs: REEF_MAINNET_WS,
    nodeRpcList: [
      REEF_MAINNET,
    ],
    chainID: REEF_MAIN_CHAINID,
    lookHash: REEF_MAIN_EXPLORER + '/transfer/',
    lookAddr: REEF_MAIN_EXPLORER + '/account/',
    lookBlock: REEF_MAIN_EXPLORER + '/blocks/',
    explorer: REEF_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Reef',
    networkName: 'Reef mainnet',
    networkLogo: 'REEF',
    type: 'main',
    label: REEF_MAIN_CHAINID,
    chainType: REEF_MAIN_CHAINID,
  },
  [REEF_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: REEF_TESTNET,
    nodeRpcList: [
      REEF_TESTNET,
    ],
    chainID: REEF_TEST_CHAINID,
    lookHash: REEF_TEST_EXPLORER + '/transfer/',
    lookAddr: REEF_TEST_EXPLORER + '/account/',
    lookBlock: REEF_TEST_EXPLORER + '/blocks/',
    explorer: REEF_TEST_EXPLORER,
    symbol: symbol,
    name: 'Reef',
    networkName: 'Reef testnet',
    networkLogo: 'REEF',
    type: 'test',
    label: REEF_TEST_CHAINID,
    chainType: REEF_TEST_CHAINID
  },
}