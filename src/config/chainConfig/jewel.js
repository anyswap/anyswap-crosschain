import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const JEWEL_MAIN_CHAINID = ChainId.JEWEL
export const JEWEL_MAINNET = getLocalRPC(JEWEL_MAIN_CHAINID, 'https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc')
export const JEWEL_MAIN_EXPLORER = 'https://subnets.avax.network/defi-kingdoms/dfk-chain/explorer'

export const tokenList = []
export const testTokenList = []

const symbol = 'JEWEL'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [JEWEL_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + JEWEL_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x5b24224dC16508DAD755756639E420817DD4c99E',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: JEWEL_MAINNET,
    nodeRpcList: [
      JEWEL_MAINNET,
    ],
    chainID: JEWEL_MAIN_CHAINID,
    lookHash: JEWEL_MAIN_EXPLORER + '/tx/',
    lookAddr: JEWEL_MAIN_EXPLORER + '/address/',
    lookBlock: JEWEL_MAIN_EXPLORER + '/block/',
    explorer: JEWEL_MAIN_EXPLORER,
    symbol: symbol,
    name: 'DeFi Kingdoms',
    networkName: 'DeFi Kingdoms mainnet',
    type: 'main',
    label: JEWEL_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'JEWEL',
    anyToken: ''
  },
}