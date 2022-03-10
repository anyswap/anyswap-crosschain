import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const OKT_MAIN_CHAINID = ChainId.OKT
export const OKT_MAINNET = getLocalRPC(OKT_MAIN_CHAINID, 'https://exchainrpc.okex.org')
export const OKT_MAIN_EXPLORER = 'https://www.oklink.com/okexchain'

export const tokenList = []
export const testTokenList = []

const symbol = 'OKT'

const bridgeToken = {
  [VERSION.V1_1]: {
    bridgeInitToken: '0xfdfbc559953557f5442eee7c4ba4aedc1156cae3',
    bridgeInitChain: '128',
  },
  [VERSION.V2_2]: {
    bridgeInitToken: '0xc946daf81b08146b1c7a8da2a851ddf2b3eaaf85',
    bridgeInitChain: '56',
    nativeToken: ''
  },
  [VERSION.V5]: {
    bridgeInitToken: '0xc946daf81b08146b1c7a8da2a851ddf2b3eaaf85',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: '0x218c3c3d49d0e7b37aff0d8bb079de36ae61a4c0'
  },
  [VERSION.V7]: {
    bridgeInitToken: '0xc946daf81b08146b1c7a8da2a851ddf2b3eaaf85',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: '0x218c3c3d49d0e7b37aff0d8bb079de36ae61a4c0'
  },
}

export default {
  [OKT_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + OKT_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    // multicalToken: '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
    multicalToken: '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3',
    v1FactoryToken: '',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    timelock: '0x9a8541Ddf3a932a9A922B607e9CF7301f1d47bD1',
    nodeRpc: OKT_MAINNET,
    nodeRpcList: [
      OKT_MAINNET,
    ],
    chainID: OKT_MAIN_CHAINID,
    lookHash: OKT_MAIN_EXPLORER + '/tx/',
    lookAddr: OKT_MAIN_EXPLORER + '/address/',
    lookBlock: OKT_MAIN_EXPLORER + '/block/',
    explorer: OKT_MAIN_EXPLORER,
    symbol: symbol,
    name: 'OEC',
    networkName: 'OEC mainnet',
    type: 'main',
    label: OKT_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'OKT',
    anyToken: ''
  },
}