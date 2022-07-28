import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const LTC_MAINNET = ''
export const LTC_MAIN_CHAINID = ChainId.LTC
export const LTC_MAIN_EXPLORER = ''

export const tokenList = [

]

const symbol = 'LTC'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [LTC_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + LTC_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: LTC_MAINNET,
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
    isSwitch: 1,
    anyToken: '',
    chainType: 'BTC'
  },
}