import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const ONE_MAIN_CHAINID = ChainId.ONE
export const ONE_MAINNET = getLocalRPC(ONE_MAIN_CHAINID, 'https://api.harmony.one')
export const ONE_MAIN_EXPLORER = 'https://explorer.harmony.one/#'

const symbol = 'ONE'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '0xcf664087a5bb0237a0bad6742852ec6c8d69a27a',
    crossBridgeInitToken: '0x2bf9b864cdc97b08b6d79ad4663e71b8ab65c45c'
  },
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '0xcf664087a5bb0237a0bad6742852ec6c8d69a27a',
    crossBridgeInitToken: '0x2bf9b864cdc97b08b6d79ad4663e71b8ab65c45c'
  },
}

export default {
  [ONE_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xdDCbf776dF3dE60163066A5ddDF2277cB445E0F3',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: ONE_MAINNET,
    nodeRpcList: [
      ONE_MAINNET,
      'https://api.s0.t.hmny.io'
    ],
    chainID: ONE_MAIN_CHAINID,
    lookHash: ONE_MAIN_EXPLORER + '/tx/',
    lookAddr: ONE_MAIN_EXPLORER + '/address/',
    lookBlock: ONE_MAIN_EXPLORER + '/block/',
    explorer: ONE_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Harmony',
    networkName: 'Harmony mainnet',
    walletName: 'Harmony Mainnet Shard 0',
    type: 'main',
    label: ONE_MAIN_CHAINID,
  },
}