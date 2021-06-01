import {formatSwapTokenList} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

// export const BNB_MAINNET = 'https://bsc-dataseed1.defibit.io/'
// export const BNB_MAINNET = 'https://bsc-dataseed2.defibit.io/'
export const BNB_MAINNET = 'https://bsc-dataseed3.defibit.io/'
// export const BNB_MAINNET = 'https://bsc-dataseed4.defibit.io/'

// export const BNB_MAINNET = 'https://bsc-dataseed1.ninicoin.io/'
// export const BNB_MAINNET = 'https://bsc-dataseed2.ninicoin.io/'
// export const BNB_MAINNET = 'https://bsc-dataseed3.ninicoin.io/'
// export const BNB_MAINNET = 'https://bsc-dataseed4.ninicoin.io/'

// export const BNB_MAINNET = 'https://bsc-dataseed1.binance.org/'
// export const BNB_MAINNET = 'https://bsc-dataseed2.binance.org/'
// export const BNB_MAINNET = 'https://bsc-dataseed3.binance.org/'
// export const BNB_MAINNET = 'https://bsc-dataseed4.binance.org/'
export const BNB_MAIN_CHAINID = 56
export const BNB_MAIN_EXPLORER = 'https://bscscan.com'

export const BNB_TESTNET = 'https://data-seed-prebsc-1-s1.binance.org:8545'
export const BNB_TEST_CHAINID = 97
export const BNB_TEST_EXPLORER = 'https://testnet.bscscan.com/'

export const tokenList = [
  {
    "address": "0x66a79d23e58475d2738179ca52cd0b41d73f0bea",
    "chainId": BNB_MAIN_CHAINID,
    "decimals": 18,
    "name": "",
    "symbol": ""
  }
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
  [VERSION.V2]: {
    bridgeInitToken: '0xaeDdc4A469acE97e90C605e3F52EB89620e305C0',
    bridgeRouterToken: '0xd1c5966f9f5ee6881ff6b261bbeda45972b1b5f3',
    bridgeInitChain: '137'
  }
}

export default {
  [BNB_MAIN_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + BNB_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    multicalToken: '0xe348b292e8eA5FAB54340656f3D374b259D658b8',
    v1FactoryToken: '',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    timelock: '0x9a8541Ddf3a932a9A922B607e9CF7301f1d47bD1',
    nodeRpc: BNB_MAINNET,
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
    suffix: 'BEP20'
  },
  [BNB_TEST_CHAINID]: {
    oldAppName: 'Anyswap V1',
    appName: 'HTswap LP',
    baseCurrency: 'ANY',
    tokenListUrl: tokenListUrl + BNB_TEST_CHAINID,
    tokenList: formatSwapTokenList(symbol, testTokenList),
    bridgeInitToken: '0xc9baa8cfdde8e328787e29b4b078abf2dadc2055',
    bridgeRouterToken: '0x332730a4F6E03D9C55829435f10360E13cfA41Ff',
    bridgeInitChain: '4',
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