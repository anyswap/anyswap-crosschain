import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const DOGE_MAIN_CHAINID = ChainId.DOGE
export const DOGE_MAINNET = getLocalRPC(DOGE_MAIN_CHAINID, 'https://rpc01-sg.dogechain.dog')
export const DOGE_MAIN_EXPLORER = 'https://explorer.dogechain.dog'

const symbol = 'WDOGE'

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
  [DOGE_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x5D9ab5522c64E1F6ef5e3627ECCc093f56167818',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: DOGE_MAINNET,
    nodeRpcList: [
      DOGE_MAINNET,
    ],
    chainID: DOGE_MAIN_CHAINID,
    lookHash: DOGE_MAIN_EXPLORER + '/tx/',
    lookAddr: DOGE_MAIN_EXPLORER + '/address/',
    lookBlock: DOGE_MAIN_EXPLORER + '/block/',
    explorer: DOGE_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Dogechain',
    networkName: 'Dogechain mainnet',
    walletName: 'Dogechain Mainnet',
    type: 'main',
    label: DOGE_MAIN_CHAINID,
  },
}