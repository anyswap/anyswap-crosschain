import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const SDN_MAIN_CHAINID = ChainId.SDN
export const SDN_MAINNET = getLocalRPC(SDN_MAIN_CHAINID, 'https://rpc.shiden.astar.network:8545')
export const SDN_MAIN_EXPLORER = 'https://shiden.subscan.io'


const symbol = 'SDN'

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
    bridgeInitToken: '0xfa9343c3897324496a05fc75abed6bac29f8a40f',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: '0xfa9343c3897324496a05fc75abed6bac29f8a40f'
  },
}

export default {
  [SDN_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0xEba098A16d6092B66608A14A3f53A984186266e7',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: SDN_MAINNET,
    nodeRpcList: [
      SDN_MAINNET,
      // 'https://shiden.api.onfinality.io/public',
      'https://rpc.shiden.astar.network:8545',
      'https://shiden.api.onfinality.io/rpc?apikey=d5da52f9-c548-4d48-8a7b-2ebb4d5d8959'
    ],
    chainID: SDN_MAIN_CHAINID,
    lookHash: SDN_MAIN_EXPLORER + '/tx/',
    lookAddr: SDN_MAIN_EXPLORER + '/address/',
    lookBlock: SDN_MAIN_EXPLORER + '/block/',
    explorer: SDN_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Shiden Network',
    networkName: 'Shiden Network mainnet',
    walletName: 'Shiden',
    type: 'main',
    label: SDN_MAIN_CHAINID,
  },
}