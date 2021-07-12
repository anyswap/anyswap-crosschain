import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const FTM_MAIN_CHAINID = 250
// export const FTM_MAINNET = 'https://rpc.fantom.network'
// export const FTM_MAINNET = 'https://rpc2.fantom.network'
export const FTM_MAINNET = process.env.NODE_ENV === 'development' ? getLocalRPC(FTM_MAIN_CHAINID, 'https://rpc3.fantom.network') : getLocalRPC(FTM_MAIN_CHAINID, 'https://ftmnode1.anyswap.exchange')
// export const FTM_MAINNET = 'https://rpcapi.fantom.network'
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
    bridgeInitChain: '137',
  },
  [VERSION.V2_1]: {
    bridgeInitToken: '0x95bf7e307bc1ab0ba38ae10fc27084bc36fcd605',
    bridgeRouterToken: '0x1ccca1ce62c62f7be95d4a67722a8fdbed6eecb4',
    bridgeInitChain: '137',
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
    swapRouterToken: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    swapInitToken: '0xf99d58e463a2e07e5692127302c20a191861b4d6',
    multicalToken: '0x63B8310c5093ac917552931D8b15d5AB6945c0a6',
    v1FactoryToken: '',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    timelock: '0x1a9C8182C09F50C8318d769245beA52c32BE35BC',
    nodeRpc: FTM_MAINNET,
    nodeRpcList: [
      'https://rpc.fantom.network',
      'https://rpc2.fantom.network',
      'https://rpc3.fantom.network',
      'https://rpcapi.fantom.network'
    ],
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
    suffix: 'FRC20',
    anyToken: '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83'
  },
}