import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const NAS_MAINNET = ''
export const NAS_MAIN_CHAINID = ChainId.NAS
export const NAS_MAIN_EXPLORER = 'https://explorer.nebulas.io/#'

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
  [NAS_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + NAS_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: NAS_MAINNET,
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
    isSwitch: 1,
    suffix: 'NAS',
    anyToken: '',
    chainType: NAS_MAIN_CHAINID
  },
}