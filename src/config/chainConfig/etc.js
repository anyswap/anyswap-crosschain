import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const ETC_MAIN_CHAINID = ChainId.ETC
export const ETC_MAINNET = getLocalRPC(ETC_MAIN_CHAINID, 'https://www.ethercluster.com/etc')
export const ETC_MAIN_EXPLORER = 'https://blockscout.com/etc/mainnet'

export const tokenList = []
export const testTokenList = []

const symbol = 'ETC'

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
    bridgeInitChain: '',
    nativeToken: '0x1953cab0e5bfa6d4a9bad6e05fd46c1cc6527a5a',
    crossBridgeInitToken: ''
  },
}

export default {
  [ETC_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + ETC_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: ETC_MAINNET,
    nodeRpcList: [
      ETC_MAINNET,
    ],
    chainID: ETC_MAIN_CHAINID,
    lookHash: ETC_MAIN_EXPLORER + '/tx/',
    lookAddr: ETC_MAIN_EXPLORER + '/address/',
    lookBlock: ETC_MAIN_EXPLORER + '/block/',
    explorer: ETC_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Ethereum Classic',
    networkName: 'Ethereum Classic mainnet',
    type: 'main',
    label: ETC_MAIN_CHAINID,
    isSwitch: 1,
    anyToken: ''
  },
}