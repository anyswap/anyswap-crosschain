import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const LTC_MAINNET = ''
export const LTC_MAIN_CHAINID = ChainId.LTC
export const LTC_MAIN_EXPLORER = ''

const symbol = 'LTC'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [LTC_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: LTC_MAINNET,
    nodeRpcList: [],
    chainID: LTC_MAIN_CHAINID,
    lookHash: LTC_MAIN_EXPLORER + '/tx/',
    lookAddr: LTC_MAIN_EXPLORER + '/address/',
    lookBlock: LTC_MAIN_EXPLORER + '/block/',
    explorer: LTC_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Litecoin',
    networkName: 'Litecoin mainnet',
    type: 'main',
    label: LTC_MAIN_CHAINID,
    chainType: 'NOWALLET'
  },
}