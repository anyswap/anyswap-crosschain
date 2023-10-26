import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const PHI_MAIN_CHAINID = ChainId.PHI
// export const PHI_MAINNET = getLocalRPC(CRO_MAIN_CHAINID, 'https://phinode1.anyswap.exchange')
export const PHI_MAINNET = getLocalRPC(PHI_MAIN_CHAINID, 'https://rpc1.phi.network')
export const PHI_MAIN_EXPLORER = 'https://explorer.phi.network'

export const tokenList = []
export const testTokenList = []

const symbol = 'PHI'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '4181',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '4181',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [PHI_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + PHI_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: PHI_MAINNET,
    nodeRpcList: [
      PHI_MAINNET,
      'https://rpc1.phi.network'
    ],
    chainID: PHI_MAIN_CHAINID,
    lookHash: PHI_MAIN_EXPLORER + '/tx/',
    lookAddr: PHI_MAIN_EXPLORER + '/address/',
    lookBlock: PHI_MAIN_EXPLORER + '/block/',
    explorer: PHI_MAIN_EXPLORER,
    symbol: symbol,
    name: 'PHI',
    networkName: 'PHI Network',
    type: 'main',
    label: PHI_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'PHI',
    anyToken: ''
  },
}
