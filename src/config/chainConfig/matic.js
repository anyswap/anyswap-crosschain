import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION, CHAIN_TYPE} from '../constant'
import {ChainId} from './chainId'

export const MATIC_MAIN_CHAINID = ChainId.MATIC
// export const MATIC_MAINNET = 'https://rpc-mainnet.maticvigil.com'
// export const MATIC_MAINNET = process.env.NODE_ENV === 'development' ? 'https://rpc-mainnet.maticvigil.com' : 'https://maticnode1.anyswap.exchange'
export const MATIC_MAINNET = process.env.NODE_ENV === 'development' ? getLocalRPC(MATIC_MAIN_CHAINID, 'https://polygon-rpc.com/') : getLocalRPC(MATIC_MAIN_CHAINID, 'https://rpc.ankr.com/polygon')
// export const MATIC_MAIN_EXPLORER = 'https://explorer-mainnet.maticvigil.com'
export const MATIC_MAIN_EXPLORER = 'https://polygonscan.com'


export const MATIC_TEST_CHAINID = ChainId.MATIC_TEST
export const MATIC_TESTNET = getLocalRPC(MATIC_TEST_CHAINID, 'https://rpc-mumbai.maticvigil.com')
export const MATIC_TEST_EXPLORER = 'https://mumbai.polygonscan.com'

const symbol = 'MATIC'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V1_1]: {
    bridgeInitToken: '0xdf00960e0adfea78ee29da7fcca17cfdddc0a4ca',
    bridgeInitChain: '56',
    nativeToken: ''
  },
  [VERSION.V2]: {
    bridgeInitToken: '0x9610b01aaa57ec026001f7ec5cface51bfea0ba6',
    bridgeInitChain: '56',
  },
  [VERSION.V2_1]: {
    bridgeInitToken: '0x9610b01aaa57ec026001f7ec5cface51bfea0ba6',
    bridgeInitChain: '56',
  },
  [VERSION.V2_2]: {
    bridgeInitToken: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    bridgeInitChain: '56',
  },
  [VERSION.V5]: {
    bridgeInitToken: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    bridgeInitChain: '56',
    nativeToken: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    crossBridgeInitToken: '0x6ab6d61428fde76768d7b45d8bfeec19c6ef91a8'
  },
  [VERSION.V6_1]: {
    bridgeInitToken: '',
    bridgeInitChain: '250',
    nftInitToken: '0x231e9a191598b7eba9c374118c9abcf6d2ba41df',
    crossBridgeInitToken: ''
  },
  [VERSION.V7]: {
    bridgeInitToken: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    bridgeInitChain: '56',
    nativeToken: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
    crossBridgeInitToken: ''
  },
  [VERSION.V7_TEST]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  }
}

export default {
  [MATIC_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    multicalToken: '0x02817C1e3543c2d908a590F5dB6bc97f933dB4BD',
    v1FactoryToken: '',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    nodeRpc: MATIC_MAINNET,
    nodeRpcList: [
      MATIC_MAINNET,
      'https://polygon-rpc.com/',
      'https://rpc-mainnet.matic.network',
      'https://matic-mainnet.chainstacklabs.com',
      'https://rpc-mainnet.maticvigil.com',
      'https://rpc-mainnet.matic.quiknode.pro',
      'https://matic-mainnet-full-rpc.bwarelabs.com',
      'https://matic-mainnet-archive-rpc.bwarelabs.com',
    ],
    chainID: MATIC_MAIN_CHAINID,
    lookHash: MATIC_MAIN_EXPLORER + '/tx/',
    lookAddr: MATIC_MAIN_EXPLORER + '/address/',
    lookBlock: MATIC_MAIN_EXPLORER + '/block/',
    explorer: MATIC_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Polygon',
    networkName: 'Polygon mainnet',
    walletName: 'Polygon Mainnet',
    type: 'main',
    label: MATIC_MAIN_CHAINID,
    hotType: CHAIN_TYPE.HOT
  },
  [MATIC_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: MATIC_TESTNET,
    nodeRpcList: [
      MATIC_TESTNET,
    ],
    chainID: MATIC_TEST_CHAINID,
    lookHash: MATIC_TEST_EXPLORER + '/tx/',
    lookAddr: MATIC_TEST_EXPLORER + '/address/',
    lookBlock: MATIC_TEST_EXPLORER + '/block/',
    explorer: MATIC_TEST_EXPLORER,
    symbol: symbol,
    name: 'Mumbai',
    networkName: 'Mumbai testnet',
    walletName: 'Mumbai',
    type: 'test',
    label: MATIC_TEST_CHAINID,
  },
}