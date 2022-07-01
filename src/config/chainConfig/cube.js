import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import { ChainId } from './chainId'

export const CUBE_MAIN_CHAINID = ChainId.CUBE
export const CUBE_MAINNET = getLocalRPC(CUBE_MAIN_CHAINID, 'https://http-mainnet.cube.network')
export const CUBE_MAIN_EXPLORER = 'https://www.cubescan.network/en-us'

export const tokenList = []
export const testTokenList = []

const symbol = 'CUBE'

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
  [CUBE_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + CUBE_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: CUBE_MAINNET,
    nodeRpcList: [
      CUBE_MAINNET,
      'https://http-mainnet.cube.network',
      'https://http-mainnet-sg.cube.network',
      'https://http-mainnet-us.cube.network',
    ],
    chainID: CUBE_MAIN_CHAINID,
    lookHash: CUBE_MAIN_EXPLORER + '/tx/',
    lookAddr: CUBE_MAIN_EXPLORER + '/address/',
    lookBlock: CUBE_MAIN_EXPLORER + '/block/',
    explorer: CUBE_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Cube Chain',
    networkName: 'Cube Chain mainnet',
    type: 'main',
    label: CUBE_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'CUBE',
    anyToken: ''
  },
}