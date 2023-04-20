import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const HBIT_MAIN_CHAINID = 11119
export const HBIT_MAINNET = getLocalRPC(HBIT_MAIN_CHAINID, 'https://mainnet-rpc.hashbit.org/')
export const HBIT_MAIN_EXPLORER = 'https://explorer.hashbit.org'

export const tokenList = []
export const testTokenList = []

const symbol = 'HBIT'

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
  [HBIT_MAIN_CHAINID]: {
    wrappedToken: '0x87599c8ae56bcf5115c3074151fc33719ef3c74e',
    tokenListUrl: tokenListUrl + HBIT_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0x58454Ad827E885cfEE453AaC9c3826332479e065',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: HBIT_MAINNET,
    nodeRpcList: [HBIT_MAINNET],
    chainID: HBIT_MAIN_CHAINID,
    lookHash: HBIT_MAIN_EXPLORER + '/tx/',
    lookAddr: HBIT_MAIN_EXPLORER + '/address/',
    lookBlock: HBIT_MAIN_EXPLORER + '/block/',
    explorer: HBIT_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Hashbit',
    networkName: 'Hashbit Mainnet',
    networkLogo: 'HBIT',
    type: 'main',
    label: HBIT_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'HBIT',
    anyToken: ''
  },
}