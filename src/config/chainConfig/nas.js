
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const NAS_MAINNET = ''
export const NAS_MAIN_CHAINID = ChainId.NAS
export const NAS_MAIN_EXPLORER = 'https://explorer.nebulas.io/#'

const symbol = 'NAS'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [NAS_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: NAS_MAINNET,
    nodeRpcList: [],
    chainID: NAS_MAIN_CHAINID,
    lookHash: NAS_MAIN_EXPLORER + '/tx/',
    lookAddr: NAS_MAIN_EXPLORER + '/address/',
    lookBlock: NAS_MAIN_EXPLORER + '/block/',
    explorer: NAS_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Nebulas',
    networkName: 'Nebulas mainnet',
    networkLogo: 'NAS',
    type: 'main',
    label: NAS_MAIN_CHAINID,
    chainType: NAS_MAIN_CHAINID
  },
}