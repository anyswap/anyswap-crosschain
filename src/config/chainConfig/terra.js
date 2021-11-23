import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const TERRA_MAINNET = ''
export const TERRA_MAIN_CHAINID = 'TERRA'
export const TERRA_MAIN_EXPLORER = 'https://finder.terra.money/mainnet'

export const tokenList = [

]

const symbol = 'TERRA'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [TERRA_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + TERRA_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: TERRA_MAINNET,
    chainID: TERRA_MAIN_CHAINID,
    lookHash: TERRA_MAIN_EXPLORER + '/tx/',
    lookAddr: TERRA_MAIN_EXPLORER + '/address/',
    lookBlock: TERRA_MAIN_EXPLORER + '/block/',
    explorer: TERRA_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Terra',
    networkName: 'TERRA mainnet',
    type: 'main',
    label: TERRA_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'TERRA',
    anyToken: '',
    chainType: 'TERRA'
  },
}