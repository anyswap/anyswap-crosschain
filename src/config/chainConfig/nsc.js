import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const NSC_MAIN_CHAINID = 96
export const NSC_MAINNET = getLocalRPC(NSC_MAIN_CHAINID, 'https://rpc.nextsmartchain.com')
export const NSC_MAIN_EXPLORER = 'https://explorer.nextsmartchain.com'

export const tokenList = []
export const testTokenList = []

const symbol = 'NEXT'

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
  [NSC_MAIN_CHAINID]: {
    wrappedToken: '0xa6D817C096fF4385c7C72d1643AfC01e38fa0dA3',
    tokenListUrl: tokenListUrl + NSC_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xcd8F23091F5379cf355F365dBa8C48A2C721C1e5',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: NSC_MAINNET,
    nodeRpcList: [NSC_MAINNET],
    chainID: NSC_MAIN_CHAINID,
    lookHash: NSC_MAIN_EXPLORER + '/transactions/',
    lookAddr: NSC_MAIN_EXPLORER + '/accounts/',
    lookBlock: NSC_MAIN_EXPLORER + '/blocks/',
    explorer: NSC_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Next Smart Chain',
    networkName: 'Next Smart Chain mainnet',
    networkLogo: 'NEXT',
    type: 'main',
    label: NSC_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'NEXT',
    anyToken: ''
  },
}