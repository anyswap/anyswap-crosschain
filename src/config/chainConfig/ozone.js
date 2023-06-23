import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const OZO_MAIN_CHAINID = 4000
export const OZO_MAINNET = getLocalRPC(OZO_MAIN_CHAINID, 'https://node1.ozonechain.io')
export const OZO_MAIN_EXPLORER = 'https://ozonescan.io'

export const tokenList = []
export const testTokenList = []

const symbol = 'OZO'

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
  [OZO_MAIN_CHAINID]: {
    wrappedToken: '0x83048f0Bf34FEeD8CEd419455a4320A735a92e9d',
    tokenListUrl: tokenListUrl + OZO_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x48d7ac38530697aDB91061B6D141C8c763edE565',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: OZO_MAINNET,
    nodeRpcList: [OZO_MAINNET],
    chainID: OZO_MAIN_CHAINID,
    lookHash: OZO_MAIN_EXPLORER + '/tx/',
    lookAddr: OZO_MAIN_EXPLORER + '/address/',
    lookBlock: OZO_MAIN_EXPLORER + '/block/',
    explorer: OZO_MAIN_EXPLORER,
    symbol: symbol,
    name: 'OzoneChain',
    networkName: 'OzoneChain Mainnet',
    networkLogo: 'OZO',
    type: 'main',
    label: OZO_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'OZO',
    anyToken: ''
  },
}