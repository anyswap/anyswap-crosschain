import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const CMP_MAIN_CHAINID = ChainId.CMP
export const CMP_MAINNET = getLocalRPC(CMP_MAIN_CHAINID, 'https://mainnet.block.caduceus.foundation')
export const CMP_MAIN_EXPLORER = 'https://mainnet.scan.caduceus.foundation'

export const tokenList = []
export const testTokenList = []

const symbol = 'CMP'

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
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [CMP_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + CMP_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xC43E77E8641d41028785779Df0F3D021bD54a1d6',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: CMP_MAINNET,
    nodeRpcList: [
      CMP_MAINNET,
    ],
    chainID: CMP_MAIN_CHAINID,
    lookHash: CMP_MAIN_EXPLORER + '/tx/',
    lookAddr: CMP_MAIN_EXPLORER + '/address/',
    lookBlock: CMP_MAIN_EXPLORER + '/block/',
    explorer: CMP_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Caduceus',
    networkName: 'Caduceus mainnet',
    type: 'main',
    label: CMP_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'CMP',
    anyToken: ''
  },
}