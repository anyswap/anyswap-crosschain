import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const KCC_MAIN_CHAINID = ChainId.KCC
export const KCC_MAINNET = getLocalRPC(KCC_MAIN_CHAINID, 'https://rpc-mainnet.kcc.network')
export const KCC_MAIN_EXPLORER = 'https://explorer.kcc.io/cn'

const symbol = 'KCS'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c'
  },
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c'
  },
}

export default {
  [KCC_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xA649325Aa7C5093d12D6F98EB4378deAe68CE23F',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: KCC_MAINNET,
    nodeRpcList: [
      KCC_MAINNET,
    ],
    chainID: KCC_MAIN_CHAINID,
    lookHash: KCC_MAIN_EXPLORER + '/tx/',
    lookAddr: KCC_MAIN_EXPLORER + '/address/',
    lookBlock: KCC_MAIN_EXPLORER + '/block/',
    explorer: KCC_MAIN_EXPLORER,
    symbol: symbol,
    name: 'KCC',
    networkName: 'KCC mainnet',
    walletName: 'KCC Mainnet',
    type: 'main',
    label: KCC_MAIN_CHAINID,
  },
}