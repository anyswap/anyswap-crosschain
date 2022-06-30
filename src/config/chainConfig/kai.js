import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const KAI_MAIN_CHAINID = ChainId.KAI
export const KAI_MAINNET = getLocalRPC(KAI_MAIN_CHAINID, 'https://rpc.kardiachain.io')
export const KAI_MAIN_EXPLORER = 'https://explorer.kardiachain.io'

export const tokenList = []
export const testTokenList = []

const symbol = 'KAI'

const bridgeToken = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [KAI_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + KAI_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    // multicalToken: '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: KAI_MAINNET,
    nodeRpcList: [
      KAI_MAINNET,
    ],
    chainID: KAI_MAIN_CHAINID,
    lookHash: KAI_MAIN_EXPLORER + '/tx/',
    lookAddr: KAI_MAIN_EXPLORER + '/address/',
    lookBlock: KAI_MAIN_EXPLORER + '/block/',
    explorer: KAI_MAIN_EXPLORER,
    symbol: symbol,
    name: 'KardiaChain',
    networkName: 'KardiaChain mainnet',
    type: 'main',
    label: KAI_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'KAI',
    anyToken: ''
  },
}