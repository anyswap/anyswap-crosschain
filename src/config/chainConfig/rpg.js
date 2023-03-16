import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const RPG_MAIN_CHAINID = ChainId.RPG
export const RPG_MAINNET = getLocalRPC(RPG_MAIN_CHAINID, 'https://mainnet.rangersprotocol.com/api/jsonrpc')
export const RPG_MAIN_EXPLORER = 'https://scan.rangersprotocol.com'

export const testTokenList = []

const symbol = 'RPG'

const bridgeToken = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [RPG_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x7C598c96D02398d89FbCb9d41Eab3DF0C16F227D',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: RPG_MAINNET,
    nodeRpcList: [
      RPG_MAINNET,
    ],
    chainID: RPG_MAIN_CHAINID,
    lookHash: RPG_MAIN_EXPLORER + '/tx/',
    lookAddr: RPG_MAIN_EXPLORER + '/address/',
    lookBlock: RPG_MAIN_EXPLORER + '/block/',
    explorer: RPG_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Rangers',
    networkName: 'Rangers mainnet',
    walletName: 'Rangers Protocol Mainnet',
    type: 'main',
    label: RPG_MAIN_CHAINID,
  },
}