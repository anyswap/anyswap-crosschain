import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const SOL_MAINNET = 'https://api.mainnet-beta.solana.com'
export const SOL_MAINNET = 'https://rpc.ankr.com/solana'
// export const SOL_MAINNET = 'https://delicate-chaotic-dust.solana-mainnet.discover.quiknode.pro/3a539ea8473757ef14934012e91be6ea432b6799/'
export const SOL_MAIN_CHAINID = ChainId.SOL
export const SOL_MAIN_EXPLORER = 'https://solscan.io'

export const SOL_TESTNET = 'https://api.testnet.solana.com'
export const SOL_TEST_CHAINID = ChainId.SOL_TEST
export const SOL_TEST_EXPLORER = 'https://solana.fm'

const symbol = 'SOL'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  [SOL_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: SOL_MAINNET,
    nodeRpcList: [
      'https://api.mainnet-beta.solana.com',
      'https://rpc.ankr.com/solana'
    ],
    chainID: SOL_MAIN_CHAINID,
    lookHash: SOL_MAIN_EXPLORER + '/tx/',
    lookAddr: SOL_MAIN_EXPLORER + '/account/',
    lookBlock: SOL_MAIN_EXPLORER + '/block/',
    explorer: SOL_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Solana',
    networkName: 'Solana mainnet',
    networkLogo: 'SOL',
    type: 'main',
    label: SOL_MAIN_CHAINID,
    chainType: SOL_MAIN_CHAINID
  },
  [SOL_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: SOL_TESTNET,
    chainID: SOL_TEST_CHAINID,
    nodeRpcList: [],
    lookHash: SOL_TEST_EXPLORER + '/tx/',
    lookAddr: SOL_TEST_EXPLORER + '/address/',
    lookBlock: SOL_TEST_EXPLORER + '/block/',
    explorer: SOL_TEST_EXPLORER,
    symbol: symbol,
    name: 'Solana',
    networkName: 'Solana testnet',
    networkLogo: 'SOL',
    type: 'test',
    label: SOL_TEST_CHAINID,
    chainType: SOL_TEST_CHAINID
  },
}