import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const NEBULAS_MAINNET = ''
export const NEBULAS_MAIN_CHAINID = 'NAS'
export const NEBULAS_MAIN_EXPLORER = 'https://explorer.nebulas.io/#'

export const tokenList = [

]

const symbol = 'NAS'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [NEBULAS_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + NEBULAS_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: NEBULAS_MAINNET,
    chainID: NEBULAS_MAIN_CHAINID,
    lookHash: NEBULAS_MAIN_EXPLORER + '/tx/',
    lookAddr: NEBULAS_MAIN_EXPLORER + '/address/',
    lookBlock: NEBULAS_MAIN_EXPLORER + '/block/',
    explorer: NEBULAS_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Nebulas',
    networkName: 'Nebulas mainnet',
    type: 'main',
    label: NEBULAS_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'NAS',
    anyToken: '',
    chainType: 'NAS'
  },
}