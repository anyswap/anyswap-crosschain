import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

// export const MATIC_MAINNET = 'https://rpc-mainnet.maticvigil.com'
export const MATIC_MAINNET = 'https://maticnode1.anyswap.exchange'
export const MATIC_MAIN_CHAINID = 137
export const MATIC_MAIN_EXPLORER = 'https://explorer-mainnet.maticvigil.com'

export const tokenList = []

export const testTokenList = []

const symbol = 'MATIC'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeRouterToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V2]: {
    bridgeInitToken: '0x95bf7e307bc1ab0ba38ae10fc27084bc36fcd605',
    bridgeRouterToken: '0x1ccca1ce62c62f7be95d4a67722a8fdbed6eecb4',
    bridgeInitChain: '250',
  }
}

export default {
  [MATIC_MAIN_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + MATIC_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '0x95028E5B8a734bb7E2071F96De89BABe75be9C8E',
    v1FactoryToken: '',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    timelock: '0x9a8541Ddf3a932a9A922B607e9CF7301f1d47bD1',
    nodeRpc: MATIC_MAINNET,
    chainID: MATIC_MAIN_CHAINID,
    lookHash: MATIC_MAIN_EXPLORER + '/tx/',
    lookAddr: MATIC_MAIN_EXPLORER + '/address/',
    lookBlock: MATIC_MAIN_EXPLORER + '/block/',
    explorer: MATIC_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Polygon',
    networkName: 'MATIC mainnet',
    type: 'main',
    label: MATIC_MAIN_CHAINID,
    isSwitch: 1,
    underlying: [],
    suffix: 'MATIC'
  },
}