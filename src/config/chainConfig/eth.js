import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION, CHAIN_TYPE} from '../constant'
import {ChainId} from './chainId'

const navLang = navigator.language

export const ETH_MAIN_CHAINID = ChainId.ETH
// export const ETH_MAINNET = process.env.NODE_ENV === 'development' ? getLocalRPC(ETH_MAIN_CHAINID, process.env.REACT_APP_NETWORK_URL) : getLocalRPC(ETH_MAIN_CHAINID, 'https://ethmainnet.anyswap.exchange')
// export const ETH_MAINNET = process.env.NODE_ENV === 'development' ? getLocalRPC(ETH_MAIN_CHAINID, 'https://rpc.ankr.com/eth') : getLocalRPC(ETH_MAIN_CHAINID, 'https://ethmainnet.anyswap.exchange')
export const ETH_MAINNET = getLocalRPC(ETH_MAIN_CHAINID, 'https://rpc.ankr.com/eth')
// export const ETH_MAINNET = getLocalRPC(ETH_MAIN_CHAINID, 'https://ethmainnet.anyswap.exchange')
export const ETH_MAIN_EXPLORER = navLang === 'zh-CN' ? 'https://cn.etherscan.com' : 'https://etherscan.io'

export const ETH_TEST_CHAINID = ChainId.RINKEBY
export const ETH_TESTNET = getLocalRPC(ETH_TEST_CHAINID, 'https://rinkeby.infura.io/v3/613a4ccfe37f4870a2c3d922e58fa2bd')
export const ETH_TEST_EXPLORER = 'https://rinkeby.etherscan.io'

export const ETH_TEST1_CHAINID = ChainId.GOERLI
// export const ETH_TEST1NET = getLocalRPC(ETH_TEST1_CHAINID, 'https://goerli.infura.io/v3/613a4ccfe37f4870a2c3d922e58fa2bd')
export const ETH_TEST1NET = getLocalRPC(ETH_TEST1_CHAINID, 'https://rpc.ankr.com/eth_goerli')
export const ETH_TEST1_EXPLORER = 'https://goerli.etherscan.io'

export const BASEGOERLI_TEST1_CHAINID = ChainId.BASEGOERLI
export const BASEGOERLI_TEST1NET = getLocalRPC(ETH_TEST1_CHAINID, 'https://goerli.base.org')
export const BASEGOERLI_TEST1_EXPLORER = 'https://goerli.basescan.org'

const symbol = 'ETH'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c',
    bridgeInitChain: '56'
  },
  [VERSION.V1_1]: {
    bridgeInitToken: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c',
    bridgeInitChain: '56'
  },
  [VERSION.V2]: {
    bridgeInitToken: '0x7ea2be2df7ba6e54b1a9c70676f668455e329d29',
    bridgeInitChain: '56'
  },
  [VERSION.V2_1]: {
    bridgeInitToken: '0x7ea2be2df7ba6e54b1a9c70676f668455e329d29',
    bridgeInitChain: '56'
  },
  [VERSION.V2_2]: {
    bridgeInitToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    bridgeInitChain: '56',
    nativeToken: ''
  },
  [VERSION.V2_T1]: {
    bridgeInitToken: '0xd4143e8db48a8f73afcdf13d7b3305f28da38116',
    bridgeInitChain: '97'
  },
  [VERSION.V2_T2]: {
    bridgeInitToken: '0x5fcb9de282af6122ce3518cde28b7089c9f97b26',
    bridgeInitChain: '421611',
    nativeToken: '0x5fcb9de282af6122ce3518cde28b7089c9f97b26'
  },
  [VERSION.V2_T3]: {
    bridgeInitToken: '0xecb6d48e04d1df057e398b98ac8b3833eb3839ec',
    bridgeInitChain: '421611',
    nativeToken: '0xecb6d48e04d1df057e398b98ac8b3833eb3839ec'
  },
  [VERSION.V3]: {
    bridgeInitToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    bridgeInitChain: '42161',
    nativeToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  },
  [VERSION.V3_1]: {
    bridgeInitToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    bridgeInitChain: '42161',
    nativeToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  },
  [VERSION.V4_MOVR]: {
    bridgeInitToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    bridgeInitChain: '56',
    nativeToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    crossBridgeInitToken: 'ETH'
  },
  [VERSION.V5]: {
    bridgeInitToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    bridgeInitChain: '56',
    nativeToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    crossBridgeInitToken: 'ETH'
  },
  [VERSION.V6_1]: {
    bridgeInitToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    bridgeInitChain: '56',
    nftInitToken: '0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7',
    nativeToken: '',
    crossBridgeInitToken: 'ETH'
  },
  [VERSION.V7]: {
    bridgeInitToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    bridgeInitChain: '56',
    nativeToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    crossBridgeInitToken: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
  },
  [VERSION.V7_TEST]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [ETH_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F',
    multicalToken: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    v1FactoryToken: '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95',
    v2FactoryToken: '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac',
    nodeRpc: ETH_MAINNET,
    nodeRpcList: [
      ETH_MAINNET
    ],
    chainID: ETH_MAIN_CHAINID,
    lookHash: ETH_MAIN_EXPLORER + '/tx/',
    lookAddr: ETH_MAIN_EXPLORER + '/address/',
    lookBlock: ETH_MAIN_EXPLORER + '/block/',
    explorer: ETH_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Ethereum',
    networkName: 'Ethereum mainnet',
    walletName: 'Ethereum Mainnet',
    type: 'main',
    label: ETH_MAIN_CHAINID,
    hotType: CHAIN_TYPE.HOT
  },
  [ETH_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x42Ad527de7d4e9d9d011aC45B31D8551f8Fe9821',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: ETH_TESTNET,
    nodeRpcList: [
      ETH_TESTNET,
      'https://rinkeby.infura.io/v3/613a4ccfe37f4870a2c3d922e58fa2bd',
      'https://rinkeby.infura.io/v3/0e40cfd5e7a64b2d9aea8427e4bd52a0'
    ],
    chainID: ETH_TEST_CHAINID,
    lookHash: ETH_TEST_EXPLORER + '/tx/',
    lookAddr: ETH_TEST_EXPLORER + '/address/',
    lookBlock: ETH_TEST_EXPLORER + '/block/',
    explorer: ETH_TEST_EXPLORER,
    symbol: symbol,
    name: 'Rinkeby',
    networkName: 'ETH rinkeby',
    walletName: 'Rinkeby',
    type: 'test',
    label: ETH_TEST_CHAINID,
  },
  [ETH_TEST1_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    crossBridgeInitToken: '0x639a647fbe20b6c8ac19e48e2de44ea792c62c5c',
    swapRouterToken: '',
    multicalToken: '0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: ETH_TEST1NET,
    nodeRpcList: [
      ETH_TEST1NET
    ],
    chainID: ETH_TEST1_CHAINID,
    lookHash: ETH_TEST1_EXPLORER + '/tx/',
    lookAddr: ETH_TEST1_EXPLORER + '/address/',
    lookBlock: ETH_TEST1_EXPLORER + '/block/',
    explorer: ETH_TEST1_EXPLORER,
    symbol: symbol,
    name: 'Goerli',
    networkName: 'ETH Goerli',
    walletName: 'Goerli',
    type: 'test',
    label: ETH_TEST1_CHAINID,
  },
  [BASEGOERLI_TEST1_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    crossBridgeInitToken: '',
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: BASEGOERLI_TEST1NET,
    nodeRpcList: [
      BASEGOERLI_TEST1NET
    ],
    chainID: BASEGOERLI_TEST1_CHAINID,
    lookHash: BASEGOERLI_TEST1_EXPLORER + '/tx/',
    lookAddr: BASEGOERLI_TEST1_EXPLORER + '/address/',
    lookBlock: BASEGOERLI_TEST1_EXPLORER + '/block/',
    explorer: BASEGOERLI_TEST1_EXPLORER,
    symbol: symbol,
    name: 'Base Goerli',
    networkName: 'Base Goerli',
    networkLogo: 'BASEGOERLI',
    walletName: 'Base Goerli',
    type: 'test',
    label: BASEGOERLI_TEST1_CHAINID,
  },
}