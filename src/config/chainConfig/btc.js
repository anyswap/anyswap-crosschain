import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const BTC_MAINNET = ''
export const BTC_MAIN_CHAINID = 'BTC'
export const BTC_MAIN_EXPLORER = ''

export const tokenList = [

]

const symbol = 'BTC'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [BTC_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + BTC_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: BTC_MAINNET,
    chainID: BTC_MAIN_CHAINID,
    lookHash: BTC_MAIN_EXPLORER + '/tx/',
    lookAddr: BTC_MAIN_EXPLORER + '/address/',
    lookBlock: BTC_MAIN_EXPLORER + '/block/',
    explorer: BTC_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Bitcoin',
    networkName: 'BTC mainnet',
    type: 'main',
    label: BTC_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'BTC',
    anyToken: '',
    chainType: 'BTC'
  },
}