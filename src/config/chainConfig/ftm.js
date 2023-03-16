import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION, CHAIN_TYPE} from '../constant'
import {ChainId} from './chainId'

export const FTM_MAIN_CHAINID = ChainId.FTM
// const useNode = 'https://rpc.fantom.network'
// const useNode = 'https://rpc2.fantom.network'
// const useNode = 'https://rpc3.fantom.network'
// const useNode = 'https://rpcapi.fantom.network'
const useNode = 'https://rpc.ftm.tools/'
export const FTM_MAINNET = process.env.NODE_ENV === 'development' ? getLocalRPC(FTM_MAIN_CHAINID, useNode) : getLocalRPC(FTM_MAIN_CHAINID, 'https://rpc.ftm.tools/')
export const FTM_MAIN_EXPLORER = 'https://ftmscan.com'

export const FTM_TEST_CHAINID = ChainId.FTM_TEST
export const FTM_TESTNET = getLocalRPC(FTM_TEST_CHAINID, 'https://endpoints.omniatech.io/v1/fantom/testnet/public')
export const FTM_TEST_EXPLORER = 'https://testnet.ftmscan.com/'

const symbol = 'FTM'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V2]: {
    bridgeInitToken: '0x95bf7e307bc1ab0ba38ae10fc27084bc36fcd605',
    bridgeInitChain: '137',
  },
  [VERSION.V2_1]: {
    bridgeInitToken: '0x95bf7e307bc1ab0ba38ae10fc27084bc36fcd605',
    bridgeInitChain: '137',
  },
  [VERSION.V2_2]: {
    bridgeInitToken: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    bridgeInitChain: '137',
  },
  [VERSION.V5]: {
    bridgeInitToken: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    bridgeInitChain: '137',
    nativeToken: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    crossBridgeInitToken: 'FTM'
  },
  [VERSION.V6_1]: {
    bridgeInitToken: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    bridgeInitChain: '137',
    nftInitToken: '0xa0b20decbc557e3f68e140ed5a0c69bc865f865a',
    crossBridgeInitToken: 'FTM'
  },
  [VERSION.V7]: {
    bridgeInitToken: '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
    bridgeInitChain: '137',
    nativeToken: '0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83',
    crossBridgeInitToken: 'FTM'
  },
  [VERSION.V7_TEST]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [FTM_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    multicalToken: '0x22D4cF72C45F8198CfbF4B568dBdB5A85e8DC0B5',
    v1FactoryToken: '',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    nodeRpc: FTM_MAINNET,
    nodeRpcList: [
      FTM_MAINNET,
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
    networkName: 'Fantom mainnet',
    walletName: 'Fantom Opera',
    type: 'main',
    label: FTM_MAIN_CHAINID,
    hotType: CHAIN_TYPE.HOT
  },
  [FTM_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x5aF9b9de61F645C08eA4540C177737C6c6622060',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: FTM_TESTNET,
    nodeRpcList: [
      FTM_TESTNET,
    ],
    chainID: FTM_TEST_CHAINID,
    lookHash: FTM_TEST_EXPLORER + '/tx/',
    lookAddr: FTM_TEST_EXPLORER + '/address/',
    lookBlock: FTM_TEST_EXPLORER + '/block/',
    explorer: FTM_TEST_EXPLORER,
    symbol: symbol,
    name: 'Fantom',
    networkName: 'Fantom testnet',
    walletName: 'Fantom Testnet',
    type: 'test',
    label: FTM_TEST_CHAINID,
  },
}