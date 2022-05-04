import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const CLV_MAIN_CHAINID = 1024
export const CLV_MAINNET = getLocalRPC(CLV_MAIN_CHAINID, 'https://api-para.clover.finance')
export const CLV_MAIN_EXPLORER = 'https://clover.subscan.io'

export const tokenList = []
export const testTokenList = []

const symbol = 'CLV'

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
  [CLV_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + CLV_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x59346C1143d1dFCa87F4570d4FC4f27c674a1593',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: CLV_MAINNET,
    nodeRpcList: [
      CLV_MAINNET,
    ],
    chainID: CLV_MAIN_CHAINID,
    lookHash: CLV_MAIN_EXPLORER + '/extrinsic/',
    lookAddr: CLV_MAIN_EXPLORER + '/account/',
    lookBlock: CLV_MAIN_EXPLORER + '/block/',
    explorer: CLV_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Clover',
    networkName: 'Clover parachain mainnet',
    type: 'main',
    label: CLV_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'CLV',
    anyToken: ''
  },
}