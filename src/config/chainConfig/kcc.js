import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const KCC_MAIN_CHAINID = 321
export const KCC_MAINNET = getLocalRPC(KCC_MAIN_CHAINID, 'https://rpc-mainnet.kcc.network')
export const KCC_MAIN_EXPLORER = 'https://explorer.kcc.io/cn'

export const tokenList = []
export const testTokenList = []

const symbol = 'KCC'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c'
  },
}

export default {
  [KCC_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + KCC_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    // multicalToken: '0x818ec0a7fe18ff94269904fced6ae3dae6d6dc0b',
    multicalToken: '0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: KCC_MAINNET,
    nodeRpcList: [
      KCC_MAINNET,
    ],
    chainID: KCC_MAIN_CHAINID,
    lookHash: KCC_MAIN_EXPLORER + '/tx/',
    lookAddr: KCC_MAIN_EXPLORER + '/address/',
    lookBlock: KCC_MAIN_EXPLORER + '/block/',
    explorer: KCC_MAIN_EXPLORER,
    symbol: symbol,
    name: 'KCC',
    networkName: 'KCC mainnet',
    type: 'main',
    label: KCC_MAIN_CHAINID,
    isSwitch: 1,
    suffix: '',
    anyToken: ''
  },
}