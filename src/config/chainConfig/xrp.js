import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const XRP_MAINNET = ''
export const XRP_MAIN_CHAINID = 'XRP'
export const XRP_MAIN_EXPLORER = 'https://xrpscan.com'

export const tokenList = [

]

const symbol = 'XRP'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [XRP_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + XRP_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: XRP_MAINNET,
    chainID: XRP_MAIN_CHAINID,
    lookHash: XRP_MAIN_EXPLORER + '/tx/',
    lookAddr: XRP_MAIN_EXPLORER + '/address/',
    lookBlock: XRP_MAIN_EXPLORER + '/block/',
    explorer: XRP_MAIN_EXPLORER,
    symbol: symbol,
    name: 'XRP',
    networkName: 'XRP mainnet',
    networkLogo: 'XRP',
    type: 'main',
    label: XRP_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'XRP',
    anyToken: '',
    // chainType: XRP_MAIN_CHAINID
    chainType: 'BTC'
  },
}