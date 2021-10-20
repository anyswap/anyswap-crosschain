import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const BLOCK_MAINNET = ''
export const BLOCK_MAIN_CHAINID = 'BLOCK'
export const BLOCK_MAIN_EXPLORER = ''

export const tokenList = [

]

const symbol = 'BLOCK'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [BLOCK_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + BLOCK_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: BLOCK_MAINNET,
    chainID: BLOCK_MAIN_CHAINID,
    lookHash: BLOCK_MAIN_EXPLORER + '/tx/',
    lookAddr: BLOCK_MAIN_EXPLORER + '/address/',
    lookBlock: BLOCK_MAIN_EXPLORER + '/block/',
    explorer: BLOCK_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Blocknet',
    networkName: 'BLOCK mainnet',
    type: 'main',
    label: BLOCK_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'BLOCK',
    anyToken: '',
    chainType: 'BTC'
  },
}