import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const COLX_MAINNET = ''
export const COLX_MAIN_CHAINID = 'COLX'
export const COLX_MAIN_EXPLORER = ''

export const tokenList = [

]

const symbol = 'COLX'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [COLX_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + COLX_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: COLX_MAINNET,
    chainID: COLX_MAIN_CHAINID,
    lookHash: COLX_MAIN_EXPLORER + '/tx/',
    lookAddr: COLX_MAIN_EXPLORER + '/address/',
    lookBlock: COLX_MAIN_EXPLORER + '/block/',
    explorer: COLX_MAIN_EXPLORER,
    symbol: symbol,
    name: 'ColossusXT',
    networkName: 'ColossusXT mainnet',
    type: 'main',
    label: COLX_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'COLX',
    anyToken: '',
    chainType: 'BTC'
  },
}