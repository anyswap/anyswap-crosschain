
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const ADA_MAINNET = 'https://graphql-api.mainnet.dandelion.link/'
export const ADA_MAIN_CHAINID = ChainId.ADA
export const ADA_MAIN_EXPLORER = 'https://cardanoscan.io'

export const ADA_TESTNET = 'https://graphql-api.testnet.dandelion.link/'
export const ADA_TEST_CHAINID = ChainId.ADA_TEST
export const ADA_TEST_EXPLORER = 'https://testnet.cardanoscan.io'

const symbol = 'ADA'

const bridgeToken = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [ADA_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: ADA_MAINNET,
    nodeRpcList: [],
    chainID: ADA_MAIN_CHAINID,
    lookHash: ADA_MAIN_EXPLORER + '/transaction/',
    lookAddr: ADA_MAIN_EXPLORER + '/address/',
    lookBlock: ADA_MAIN_EXPLORER + '/block/',
    explorer: ADA_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Cardano',
    networkName: 'Cardano mainnet',
    networkLogo: 'ADA',
    type: 'main',
    label: ADA_MAIN_CHAINID,
    chainType: ADA_MAIN_CHAINID
  },
  [ADA_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: ADA_TESTNET,
    nodeRpcList: [],
    chainID: ADA_TEST_CHAINID,
    lookHash: ADA_TEST_EXPLORER + '/transaction/',
    lookAddr: ADA_TEST_EXPLORER + '/address/',
    lookBlock: ADA_TEST_EXPLORER + '/block/',
    explorer: ADA_TEST_EXPLORER,
    symbol: symbol,
    name: 'Cardano',
    networkName: 'Cardano testnet',
    networkLogo: 'ADA',
    type: 'test',
    label: ADA_TEST_CHAINID,
    chainType: ADA_TEST_CHAINID
  },
}