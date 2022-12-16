import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const MINTME_MAIN_CHAINID = ChainId.MINTME
export const MINTME_MAINNET = getLocalRPC(MINTME_MAIN_CHAINID, 'https://node1.mintme.com')
export const MINTME_MAIN_EXPLORER = 'https://www.mintme.com/explorer'

export const testTokenList = []

const symbol = 'MINTME'

const bridgeToken = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [MINTME_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xdA75175f60d637CD42aff7e82a5294De504e7A88',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: MINTME_MAINNET,
    nodeRpcList: [
      MINTME_MAINNET,
    ],
    chainID: MINTME_MAIN_CHAINID,
    lookHash: MINTME_MAIN_EXPLORER + '/tx/',
    lookAddr: MINTME_MAIN_EXPLORER + '/addr/',
    lookBlock: MINTME_MAIN_EXPLORER + '/block/',
    explorer: MINTME_MAIN_EXPLORER,
    symbol: symbol,
    name: 'MintMe.com Coin',
    networkName: 'MintMe.com Coin mainnet',
    walletName: 'MintMe.com Coin',
    type: 'main',
    label: MINTME_MAIN_CHAINID,
  },
}