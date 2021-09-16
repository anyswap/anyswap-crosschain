import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const ARBITRUM_MAIN_CHAINID = 42161
export const ARBITRUM_MAINNET = getLocalRPC(ARBITRUM_MAIN_CHAINID, 'https://arb-mainnet.g.alchemy.com/v2/u04Uw5dp98OohbK6fylEVaEd2OD2Rxaj')
export const ARBITRUM_MAIN_EXPLORER = 'https://arbiscan.io/'

export const ARBITRUM_TEST_CHAINID = 421611
export const ARBITRUM_TESTNET = getLocalRPC(ARBITRUM_TEST_CHAINID, 'https://rinkeby.arbitrum.io/rpc')
export const ARBITRUM_TEST_EXPLORER = 'https://rinkeby-explorer.arbitrum.io/#'

export const tokenList = []

const symbol = 'ETH'

const bridgeToken = {
  [VERSION.V3]: {
    bridgeInitToken: '0x461d52769884ca6235b685ef2040f47d30c94eb5',
    bridgeInitChain: '1',
    nativeToken: '0x461d52769884ca6235b685ef2040f47d30c94eb5'
  },
  [VERSION.V3_1]: {
    bridgeInitToken: '0x765277eebeca2e31912c9946eae1021199b39c61',
    bridgeInitChain: '1',
    nativeToken: '0x765277eebeca2e31912c9946eae1021199b39c61'
  },
  [VERSION.V2_T2]: {
    bridgeInitToken: '0x218c3c3d49d0e7b37aff0d8bb079de36ae61a4c0',
    bridgeInitChain: '4',
    nativeToken: ''
  },
  [VERSION.V2_T3]: {
    bridgeInitToken: '0x338726dd694db9e2230ec2bb8624a2d7f566c96d',
    bridgeInitChain: '4',
    nativeToken: '0x338726dd694db9e2230ec2bb8624a2d7f566c96d'
  },
  [VERSION.V5]: {
    bridgeInitToken: '0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a',
    bridgeInitChain: '1',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
  // [VERSION.V5]: {
  //   bridgeInitToken: '0x765277eebeca2e31912c9946eae1021199b39c61',
  //   bridgeInitChain: '1',
  //   nativeToken: '0x765277eebeca2e31912c9946eae1021199b39c61',
  //   crossBridgeInitToken: ''
  // },
}

export default {
  
  [ARBITRUM_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + ARBITRUM_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    // multicalToken: '0x9e73d56dd1942743ffdf055449b052a806b854be',
    multicalToken: '0x80C7DD17B01855a6D2347444a0FCC36136a314de',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: ARBITRUM_MAINNET,
    chainID: ARBITRUM_MAIN_CHAINID,
    lookHash: ARBITRUM_MAIN_EXPLORER + '/tx/',
    lookAddr: ARBITRUM_MAIN_EXPLORER + '/address/',
    lookBlock: ARBITRUM_MAIN_EXPLORER + '/block/',
    explorer: ARBITRUM_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Arbitrum',
    networkName: 'Arbitrum mainnet',
    networkLogo: 'ARBITRUM',
    type: 'main',
    label: ARBITRUM_MAIN_CHAINID,
    isSwitch: 1,
    suffix: 'ARBITRUM',
    anyToken: ''
  },
  [ARBITRUM_TEST_CHAINID]: {
    tokenListUrl: tokenListUrl + ARBITRUM_TEST_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    swapInitToken: '',
    multicalToken: '0xf27ee99622c3c9b264583dacb2cce056e194494f',
    v1FactoryToken: '',
    v2FactoryToken: '',
    timelock: '',
    nodeRpc: ARBITRUM_TESTNET,
    chainID: ARBITRUM_TEST_CHAINID,
    lookHash: ARBITRUM_TEST_EXPLORER + '/tx/',
    lookAddr: ARBITRUM_TEST_EXPLORER + '/address/',
    lookBlock: ARBITRUM_TEST_EXPLORER + '/block/',
    explorer: ARBITRUM_TEST_EXPLORER,
    symbol: symbol,
    name: 'Arbitrum',
    networkName: 'Arbitrum Rinkeby',
    networkLogo: 'ARBITRUM',
    type: 'main',
    label: ARBITRUM_TEST_CHAINID,
    isSwitch: 1,
    suffix: 'ARBITRUM'
  },
}