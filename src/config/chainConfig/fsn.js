import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const FSN_MAIN_CHAINID = ChainId.FSN
export const FSN_MAINNET = getLocalRPC(FSN_MAIN_CHAINID, 'https://mainnet.anyswap.exchange')
export const FSN_MAINNET1 = 'https://mainnet.anyswap.exchange'
export const FSN_MAIN_EXPLORER = 'https://fsnex.com'

// export const FSN_TESTNET = 'https://testnet.anyswap.exchange'
export const FSN_TEST_CHAINID = ChainId.FSN_TEST
export const FSN_TESTNET = getLocalRPC(FSN_TEST_CHAINID, 'https://testnet.fsn.dev/api')
export const FSN_TEST_EXPLORER = 'https://fsnex.com'

export const tokenList = [

]
export const testTokenList = [

]

const symbol = 'FSN'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: 'FSN'
  },
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: 'FSN'
  },
}

export default {
  [FSN_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + FSN_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    // multicalToken: '0x25afd2058b6e5e00995467d58778a2790a0e5038',
    multicalToken: '0x461d52769884ca6235B685EF2040F47d30C94EB5',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: FSN_MAINNET,
    nodeRpcList: [
      FSN_MAINNET,
      'https://mainnet.anyswap.exchange',
      'https://fsn.dev/api'
    ],
    rpc1: FSN_MAINNET1,
    chainID: FSN_MAIN_CHAINID,
    lookHash: FSN_MAIN_EXPLORER + '/transaction/',
    lookAddr: FSN_MAIN_EXPLORER + '/address/',
    lookBlock: FSN_MAIN_EXPLORER + '/block/',
    explorer: FSN_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Fusion',
    networkName: 'Fusion mainnet',
    type: 'main',
    label: FSN_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'Fusion',
    anyToken: '0x0c74199d22f732039e843366a236ff4f61986b32'
  },
  [FSN_TEST_CHAINID]: {
    tokenListUrl: tokenListUrl + FSN_TEST_CHAINID,
    tokenList: formatSwapTokenList(symbol, testTokenList),
    bridgeInitToken: '',
    bridgeInitChain: '',
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x2fd94457b707b2776d4f4e4292a4280164fe8a15',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: FSN_TESTNET,
    nodeRpcList: [
      FSN_TESTNET,
    ],
    chainID: FSN_TEST_CHAINID,
    lookHash: FSN_TEST_EXPLORER + '/transaction/',
    lookAddr: FSN_TEST_EXPLORER + '/address/',
    lookBlock: FSN_TEST_EXPLORER + '/block/',
    explorer: FSN_TEST_EXPLORER,
    symbol: symbol,
    name: 'Fusion',
    networkName: 'Fusion testnet',
    type: 'test',
    label: FSN_TEST_CHAINID,
    isSwitch: 1,
    suffix: 'Fusion'
  }
}