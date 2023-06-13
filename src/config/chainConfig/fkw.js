import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const FKW_MAIN_CHAINID = 40821
export const FKW_MAINNET = getLocalRPC(FKW_MAIN_CHAINID, 'https://mainnet-rpc.fokawa.com')
export const FKW_MAIN_EXPLORER = 'https://explorer.fokawa.com'

export const tokenList = []
export const testTokenList = []

const symbol = 'FKW'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [FKW_MAIN_CHAINID]: {
    wrappedToken: '0x325A2531D28e22D37935B65bd718D1244968dAae',
    tokenListUrl: tokenListUrl + FKW_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x87a6417F03E106A05698F18829bB3a40CBC54f61',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: FKW_MAINNET,
    nodeRpcList: [FKW_MAINNET],
    chainID: FKW_MAIN_CHAINID,
    lookHash: FKW_MAIN_EXPLORER + '/tx/',
    lookAddr: FKW_MAIN_EXPLORER + '/address/',
    lookBlock: FKW_MAIN_EXPLORER + '/block/',
    explorer: FKW_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Fokawa',
    networkName: 'Fokawa Mainnet',
    networkLogo: 'FKW',
    type: 'main',
    label: FKW_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'FKW',
    anyToken: ''
  },
}