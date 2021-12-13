import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const AVAX_MAIN_CHAINID = 43114
export const AVAX_MAINNET = getLocalRPC(AVAX_MAIN_CHAINID, 'https://api.avax.network/ext/bc/C/rpc')
export const AVAX_MAIN_EXPLORER = 'https://snowtrace.io'

export const tokenList = [

]

const symbol = 'AVAX'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  },
  [VERSION.V1_1]: {
    bridgeInitToken: '0x165dbb08de0476271714952c3c1f068693bd60d7',
    bridgeInitChain: '56',
    nativeToken: ''
  },
  [VERSION.V5]: {
    bridgeInitToken: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
    bridgeInitChain: '56',
    nativeToken: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    crossBridgeInitToken: '0xb44a9b6905af7c801311e8f4e76932ee959c663c'
  },
  [VERSION.V6_1]: {
    bridgeInitToken: '',
    bridgeInitChain: '250',
    nftInitToken: '0x5775e01002f76ac0f1c3ec516d6c849b23d4a37b',
    crossBridgeInitToken: ''
  },
  [VERSION.V7]: {
    bridgeInitToken: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664',
    bridgeInitChain: '56',
    nativeToken: '0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7',
    crossBridgeInitToken: '0xa7d7079b0fead91f3e65f86e8915cb59c1a4c664'
  },
}

export default {
  [AVAX_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + AVAX_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xd8e95abcce8901cc2640d2ff4444c85506fb829d',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: AVAX_MAINNET,
    nodeRpcList: [
      AVAX_MAINNET
    ],
    chainID: AVAX_MAIN_CHAINID,
    lookHash: AVAX_MAIN_EXPLORER + '/tx/',
    lookAddr: AVAX_MAIN_EXPLORER + '/address/',
    lookBlock: AVAX_MAIN_EXPLORER + '/block/',
    explorer: AVAX_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Avalanche',
    networkName: 'AVAX mainnet',
    type: 'main',
    label: AVAX_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'AVAX',
    anyToken: '0xb44a9b6905af7c801311e8f4e76932ee959c663c'
  },
}