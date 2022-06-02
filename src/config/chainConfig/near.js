import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const NEAR_MAINNET = ''
export const NEAR_MAIN_CHAINID = ChainId.NEAR
export const NEAR_MAIN_EXPLORER = 'https://explorer.mainnet.near.org'

export const tokenList = [

]

const symbol = 'NEAR'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [NEAR_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + NEAR_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: NEAR_MAINNET,
    chainID: NEAR_MAIN_CHAINID,
    lookHash: NEAR_MAIN_EXPLORER + '/transactions/',
    lookAddr: NEAR_MAIN_EXPLORER + '/accounts/',
    lookBlock: NEAR_MAIN_EXPLORER + '/blocks/',
    explorer: NEAR_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Near',
    networkName: 'Near mainnet',
    networkLogo: 'NEAR',
    type: 'main',
    label: NEAR_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'NEAR',
    anyToken: '',
    chainType: NEAR_MAIN_CHAINID
  },
}