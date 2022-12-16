import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const HT_MAIN_CHAINID = ChainId.HT
export const HT_MAINNET = getLocalRPC(HT_MAIN_CHAINID, 'https://http-mainnet.hecochain.com')
export const HT_MAIN_EXPLORER = 'https://hecoinfo.com/'

export const HT_TEST_CHAINID = ChainId.HT_TEST
export const HT_TESTNET = getLocalRPC(HT_TEST_CHAINID, 'https://http-testnet.hecochain.com')
export const HT_TEST_EXPLORER = 'https://testnet.hecoinfo.com'

const symbol = 'HT'

const bridgeToken:any = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V1_1]: {
    bridgeInitToken: '0xa71edc38d189767582c38a3145b5873052c3e47a',
    bridgeInitChain: '66',
  },
  [VERSION.V2_T1]: {
    bridgeInitToken: '',
    bridgeInitChain: '97'
  },
  [VERSION.V5]: {
    bridgeInitToken: '0xa71edc38d189767582c38a3145b5873052c3e47a',
    bridgeInitChain: '66',
    crossBridgeInitToken: 'HT'
  },
  [VERSION.V7]: {
    bridgeInitToken: '0xa71edc38d189767582c38a3145b5873052c3e47a',
    bridgeInitChain: '66',
    crossBridgeInitToken: 'HT'
  },
}

export default {
  [HT_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '0x77e0e26de17be1ea2df87269475431e0e17dc74f',
    multicalToken: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
    v1FactoryToken: '0xdd2bc74e7a5e613379663e72689e668300b42f37',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    nodeRpc: HT_MAINNET,
    nodeRpcList: [
      HT_MAINNET,
    ],
    chainID: HT_MAIN_CHAINID,
    lookHash: HT_MAIN_EXPLORER + '/tx/',
    lookAddr: HT_MAIN_EXPLORER + '/address/',
    lookBlock: HT_MAIN_EXPLORER + '/block/',
    explorer: HT_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Huobi',
    networkName: 'Heco mainnet',
    walletName: 'Huobi ECO Chain Mainnet',
    type: 'main',
    label: HT_MAIN_CHAINID,
  },
  [HT_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '0x479ab92bf721de918f01d455e90540149dbfd9da',
    multicalToken: '0xe4ea48020f648b1aa7fc25af7b196596190c6b29',
    v1FactoryToken: '0x87fe4ea2692aeb64dbab6593de87cc4741e20c7f',
    v2FactoryToken: '0x2302c14f2928bb9b68053320309b84db3702f89f',
    nodeRpc: HT_TESTNET,
    nodeRpcList: [
      HT_TESTNET,
    ],
    chainID: HT_TEST_CHAINID,
    lookHash: HT_TEST_EXPLORER + '/tx/',
    lookAddr: HT_TEST_EXPLORER + '/address/',
    lookBlock: HT_TEST_EXPLORER + '/block/',
    explorer: HT_TEST_EXPLORER,
    symbol: symbol,
    name: 'Huobi',
    networkName: 'Heco testnet',
    walletName: 'Huobi ECO Chain Testnet',
    type: 'test',
    label: HT_TEST_CHAINID,
  },
}