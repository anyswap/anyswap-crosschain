import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const MATIC_MAIN_CHAINID = 137
// export const MATIC_MAINNET = 'https://rpc-mainnet.maticvigil.com'
// export const MATIC_MAINNET = process.env.NODE_ENV === 'development' ? 'https://rpc-mainnet.maticvigil.com' : 'https://maticnode1.anyswap.exchange'
export const MATIC_MAINNET = process.env.NODE_ENV === 'development' ? getLocalRPC(MATIC_MAIN_CHAINID, 'https://rpc-mainnet.matic.network') : getLocalRPC(MATIC_MAIN_CHAINID, 'https://maticnode1.anyswap.exchange')
// export const MATIC_MAIN_EXPLORER = 'https://explorer-mainnet.maticvigil.com'
export const MATIC_MAIN_EXPLORER = 'https://polygonscan.com'
// console.log(MATIC_MAINNET)
export const tokenList = [
  {
    "address": "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
    "chainId": MATIC_MAIN_CHAINID,
    "decimals": 8,
    "name": "Wrapped BTC",
    "symbol": "WBTC"
  },
  {
    "address": "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    "chainId": MATIC_MAIN_CHAINID,
    "decimals": 18,
    "name": "Dai Stablecoin",
    "symbol": "DAI"
  },
]

export const testTokenList = []

const symbol = 'MATIC'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V1_1]: {
    bridgeInitToken: '0xdf00960e0adfea78ee29da7fcca17cfdddc0a4ca',
    bridgeInitChain: '56',
    nativeToken: ''
  },
  [VERSION.V2]: {
    bridgeInitToken: '0x9610b01aaa57ec026001f7ec5cface51bfea0ba6',
    bridgeInitChain: '56',
  },
  [VERSION.V2_1]: {
    bridgeInitToken: '0x9610b01aaa57ec026001f7ec5cface51bfea0ba6',
    bridgeInitChain: '56',
  },
  [VERSION.V2_2]: {
    bridgeInitToken: '0xd69b31c3225728cc57ddaf9be532a4ee1620be51',
    bridgeInitChain: '56',
  }
}

export default {
  [MATIC_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + MATIC_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    swapInitToken: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    multicalToken: '0x95028E5B8a734bb7E2071F96De89BABe75be9C8E',
    v1FactoryToken: '',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    timelock: '0x9a8541Ddf3a932a9A922B607e9CF7301f1d47bD1',
    nodeRpc: MATIC_MAINNET,
    nodeRpcList: [
      'https://rpc-mainnet.matic.network',
      'https://matic-mainnet.chainstacklabs.com',
      'https://rpc-mainnet.maticvigil.com',
      'https://rpc-mainnet.matic.quiknode.pro',
      'https://matic-mainnet-full-rpc.bwarelabs.com',
      'https://matic-mainnet-archive-rpc.bwarelabs.com',
    ],
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
    suffix: 'MATIC',
    anyToken: '0x6ab6d61428fde76768d7b45d8bfeec19c6ef91a8'
  },
}