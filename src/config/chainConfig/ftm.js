import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const FTM_MAINNET = 'https://rpc.fantom.network'
export const FTM_MAIN_CHAINID = 250
export const FTM_MAIN_EXPLORER = 'https://ftmscan.com'

export const tokenList = [
  {
    "address": "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    "chainId": FTM_MAIN_CHAINID,
    "decimals": 6,
    "name": "USDC",
    "symbol": "USDC"
  },
  {
    "address": "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    "chainId": FTM_MAIN_CHAINID,
    "decimals": 18,
    "name": "Dai",
    "symbol": "DAI"
  },
]

const symbol = 'FTM'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeRouterToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V2]: {
    bridgeInitToken: '0x95bf7e307bc1ab0ba38ae10fc27084bc36fcd605',
    bridgeRouterToken: '0x1ccca1ce62c62f7be95d4a67722a8fdbed6eecb4',
    bridgeInitChain: '56',
  }
}

export default {
  [FTM_MAIN_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + FTM_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '0x63B8310c5093ac917552931D8b15d5AB6945c0a6',
    v1FactoryToken: '',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    timelock: '0x1a9C8182C09F50C8318d769245beA52c32BE35BC',
    nodeRpc: FTM_MAINNET,
    chainID: FTM_MAIN_CHAINID,
    lookHash: FTM_MAIN_EXPLORER + '/tx/',
    lookAddr: FTM_MAIN_EXPLORER + '/address/',
    lookBlock: FTM_MAIN_EXPLORER + '/block/',
    explorer: FTM_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Fantom',
    networkName: 'FTM mainnet',
    type: 'main',
    label: FTM_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'FRC20'
  },
}