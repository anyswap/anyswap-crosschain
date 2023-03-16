import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const PFT_MAIN_CHAINID = ChainId.PFT
export const PFT_MAINNET = getLocalRPC(PFT_MAIN_CHAINID, '')
export const PFT_MAIN_EXPLORER = ''

export const PFT_TEST_CHAINID = ChainId.PFT_TEST
export const PFT_TESTNET = getLocalRPC(PFT_TEST_CHAINID, 'https://testnetrpc.multichain.org/pft')
export const PFT_TEST_EXPLORER = 'https://etherscan.io'

const symbol = 'PFT'

const bridgeToken = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [PFT_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: PFT_MAINNET,
    nodeRpcList: [
      PFT_MAINNET,
    ],
    chainID: PFT_MAIN_CHAINID,
    lookHash: PFT_MAIN_EXPLORER + '/extrinsic/',
    lookAddr: PFT_MAIN_EXPLORER + '/account/',
    lookBlock: PFT_MAIN_EXPLORER + '/block/',
    explorer: PFT_MAIN_EXPLORER,
    symbol: symbol,
    name: 'PFT Network',
    networkName: 'PFT mainnet',
    networkLogo: 'PFT',
    type: 'main',
    label: PFT_MAIN_CHAINID,
  },
  [PFT_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x639A647fbe20b6c8ac19E48E2de44ea792c62c5C',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: PFT_TESTNET,
    nodeRpcList: [
      PFT_TESTNET,
      'http://3.212.233.100:9650/ext/bc/29oXNywCkGdJCuYikXkkqG6Pe5Q8tuS5VfyLHNGfeqmDzBoTPq/rpc'
    ],
    chainID: PFT_TEST_CHAINID,
    lookHash: PFT_TEST_EXPLORER + '/extrinsic/',
    lookAddr: PFT_TEST_EXPLORER + '/account/',
    lookBlock: PFT_TEST_EXPLORER + '/block/',
    explorer: PFT_TEST_EXPLORER,
    symbol: symbol,
    name: 'PFT Network',
    networkName: 'PFT testnet',
    networkLogo: 'PFT',
    walletName: 'Portal Fantasy Chain Test',
    type: 'test',
    label: PFT_TEST_CHAINID,
  },
}