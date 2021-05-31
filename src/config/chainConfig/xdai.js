import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const XDAI_MAINNET = 'https://rpc.xdaichain.com'
export const XDAI_MAIN_CHAINID = 100
export const XDAI_MAIN_EXPLORER = 'https://blockscout.com/xdai/mainnet'

export const tokenList = []
export const testTokenList = []

const symbol = 'xDAI'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeRouterToken: '',
    bridgeInitChain: '',
  }
}

export default {
  [XDAI_MAIN_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + XDAI_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '0xb5b692a88BDFc81ca69dcB1d924f59f0413A602a',
    v1FactoryToken: '',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    timelock: '0x9a8541Ddf3a932a9A922B607e9CF7301f1d47bD1',
    nodeRpc: XDAI_MAINNET,
    chainID: XDAI_MAIN_CHAINID,
    lookHash: XDAI_MAIN_EXPLORER + '/tx/',
    lookAddr: XDAI_MAIN_EXPLORER + '/address/',
    lookBlock: XDAI_MAIN_EXPLORER + '/block/',
    explorer: XDAI_MAIN_EXPLORER,
    symbol: symbol,
    name: 'xDAI',
    networkName: 'XDAI mainnet',
    type: 'main',
    label: XDAI_MAIN_CHAINID,
    isSwitch: 1,
    underlying: [],
    suffix: 'xDAI'
  },
}