import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'
// console.log(process.env)
// alert(process.env.NODE_ENV)

// const useNode = 'https://bsc-dataseed1.defibit.io/'
// const useNode = 'https://bsc-dataseed2.defibit.io/'
// const useNode = 'https://bsc-dataseed3.defibit.io/'
// const useNode = 'https://bsc-dataseed4.defibit.io/'

// const useNode = 'https://bsc-dataseed1.ninicoin.io/'
// const useNode = 'https://bsc-dataseed2.ninicoin.io/'
const useNode = 'https://bsc-dataseed3.ninicoin.io/'
// const useNode = 'https://bsc-dataseed4.ninicoin.io/'

// const useNode = 'https://bsc-dataseed1.binance.org/'
// const useNode = 'https://bsc-dataseed2.binance.org/'
// const useNode = 'https://bsc-dataseed3.binance.org/'
// const useNode = 'https://bsc-dataseed4.binance.org/'

export const BNB_MAIN_CHAINID = 56
export const BNB_MAINNET = process.env.NODE_ENV === 'development' ? getLocalRPC(BNB_MAIN_CHAINID, useNode) : getLocalRPC(BNB_MAIN_CHAINID, 'https://bscnode1.anyswap.exchange')
export const BNB_MAIN_EXPLORER = 'https://bscscan.com'
// console.log(BNB_MAINNET)
export const BNB_TEST_CHAINID = 97
export const BNB_TESTNET = getLocalRPC(BNB_TEST_CHAINID, 'https://data-seed-prebsc-1-s1.binance.org:8545')
export const BNB_TEST_EXPLORER = 'https://testnet.bscscan.com'

export const tokenList = [
  {
    "address": "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    "chainId": BNB_MAIN_CHAINID,
    "decimals": 18,
    "name": "Binance-Peg Ethereum",
    "symbol": "ETH"
  },
  {
    "address": "0x4338665cbb7b2485a8855a139b75d5e34ab0db94",
    "chainId": BNB_MAIN_CHAINID,
    "decimals": 18,
    "name": "Binance-Peg Litecoin",
    "symbol": "LTC"
  },
  {
    "address": "0x55d398326f99059ff775485246999027b3197955",
    "chainId": BNB_MAIN_CHAINID,
    "decimals": 18,
    "name": "Binance-Peg BSC-USD",
    "symbol": "USDT"
  },
]
export const testTokenList = [

]

const symbol = 'BNB'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
    bridgeRouterToken: '0xabd380327fe66724ffda91a87c772fb8d00be488',
    bridgeInitChain: '1'
  },
  [VERSION.V1_1]: {
    bridgeInitToken: '0xb12c13e66ade1f72f71834f2fc5082db8c091358',
    bridgeRouterToken: '0xabd380327fe66724ffda91a87c772fb8d00be488',
    bridgeInitChain: '1'
  },
  [VERSION.V2]: {
    bridgeInitToken: '0xaeddc4a469ace97e90c605e3f52eb89620e305c0',
    bridgeRouterToken: '0xd1c5966f9f5ee6881ff6b261bbeda45972b1b5f3',
    bridgeInitChain: '137'
  },
  [VERSION.V2_1]: {
    bridgeInitToken: '0xaeddc4a469ace97e90c605e3f52eb89620e305c0',
    bridgeRouterToken: '0xd1c5966f9f5ee6881ff6b261bbeda45972b1b5f3',
    bridgeInitChain: '137'
  },
  [VERSION.V2_2]: {
    bridgeInitToken: '0x8965349fb649a33a30cbfda057d8ec2c48abe2a2',
    bridgeRouterToken: '0xd1c5966f9f5ee6881ff6b261bbeda45972b1b5f3',
    bridgeInitChain: '137'
  },
  [VERSION.V2_T1]: {
    bridgeInitToken: '0x6fd2b7fc5db32a133a6824e1117d0f290ba43abc',
    bridgeRouterToken: '0x76a0182cd55ed477c54d747b88314b8687a04c4c',
    bridgeInitChain: '4'
  },
}

export default {
  [BNB_MAIN_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + BNB_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    swapInitToken: '0x55d398326f99059ff775485246999027b3197955',
    multicalToken: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
    v1FactoryToken: '',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    timelock: '0x9a8541Ddf3a932a9A922B607e9CF7301f1d47bD1',
    nodeRpc: BNB_MAINNET,
    nodeRpcList: [
      'https://bsc-dataseed1.defibit.io/',
      'https://bsc-dataseed2.defibit.io/',
      'https://bsc-dataseed3.defibit.io/',
      'https://bsc-dataseed4.defibit.io/',
      'https://bsc-dataseed1.ninicoin.io/',
      'https://bsc-dataseed2.ninicoin.io/',
      'https://bsc-dataseed3.ninicoin.io/',
      'https://bsc-dataseed4.ninicoin.io/',
      'https://bsc-dataseed1.binance.org/',
      'https://bsc-dataseed2.binance.org/',
      'https://bsc-dataseed3.binance.org/',
      'https://bsc-dataseed4.binance.org/',
    ],
    chainID: BNB_MAIN_CHAINID,
    lookHash: BNB_MAIN_EXPLORER + '/tx/',
    lookAddr: BNB_MAIN_EXPLORER + '/address/',
    lookBlock: BNB_MAIN_EXPLORER + '/block/',
    explorer: BNB_MAIN_EXPLORER,
    symbol: symbol,
    name: 'BSC',
    networkName: 'BSC mainnet',
    type: 'main',
    label: BNB_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'BEP20',
    anyToken: '0xf68c9df95a18b2a5a5fa1124d79eeeffbad0b6fa'
  },
  [BNB_TEST_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + BNB_TEST_CHAINID,
    tokenList: formatSwapTokenList(symbol, testTokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    swapInitToken: '0x461d52769884ca6235b685ef2040f47d30c94eb5',
    multicalToken: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
    v1FactoryToken: '',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    timelock: '0x1a9C8182C09F50C8318d769245beA52c32BE35BC',
    nodeRpc: BNB_TESTNET,
    chainID: BNB_TEST_CHAINID,
    lookHash: BNB_TEST_EXPLORER + '/tx/',
    lookAddr: BNB_TEST_EXPLORER + '/address/',
    lookBlock: BNB_TEST_EXPLORER + '/block/',
    explorer: BNB_TEST_EXPLORER,
    symbol: symbol,
    name: 'BSC',
    networkName: 'BSC testnet',
    type: 'test',
    label: BNB_TEST_CHAINID,
    isSwitch: 1,
    suffix: 'BEP20'
  }
}