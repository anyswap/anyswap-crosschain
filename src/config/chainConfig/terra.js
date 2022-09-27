import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const TERRA_MAINNET = ''
export const TERRA_MAIN_CHAINID = ChainId.TERRA
export const TERRA_MAIN_EXPLORER = 'https://finder.terra.money/classic'

const symbol = 'LUNA'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [TERRA_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: TERRA_MAINNET,
    nodeRpcList: [],
    chainID: TERRA_MAIN_CHAINID,
    lookHash: TERRA_MAIN_EXPLORER + '/tx/',
    lookAddr: TERRA_MAIN_EXPLORER + '/address/',
    lookBlock: TERRA_MAIN_EXPLORER + '/block/',
    explorer: TERRA_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Terra classic',
    networkName: 'Terra classic mainnet',
    networkLogo: 'TERRA',
    type: 'main',
    label: TERRA_MAIN_CHAINID,
    chainType: TERRA_MAIN_CHAINID
  },
}