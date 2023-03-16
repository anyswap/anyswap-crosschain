import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const MINT_MAIN_CHAINID = ChainId.MINT
export const MINT_MAINNET = getLocalRPC(MINT_MAIN_CHAINID, 'https://rpc.publicmint.io:8545')
export const MINT_MAIN_EXPLORER = 'https://explorer.publicmint.io'

// export const MINT_TEST_CHAINID = ChainId.MINT_TEST
// export const MINT_TESTNET = getLocalRPC(MINT_TEST_CHAINID, 'MINTtps://MINTtp-testnet.hecochain.com')
// export const MINT_TEST_EXPLORER = 'MINTtps://testnet.hecoinfo.com'

const symbol = 'MINT'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    crossBridgeInitToken: ''
  },
}

export default {
  [MINT_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: MINT_MAINNET,
    nodeRpcList: [
      MINT_MAINNET,
    ],
    chainID: MINT_MAIN_CHAINID,
    lookHash: MINT_MAIN_EXPLORER + '/tx/',
    lookAddr: MINT_MAIN_EXPLORER + '/address/',
    lookBlock: MINT_MAIN_EXPLORER + '/block/',
    explorer: MINT_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Public Mint',
    networkName: 'Public Mint mainnet',
    walletName: 'PublicMint Mainnet',
    type: 'main',
    label: MINT_MAIN_CHAINID,
  },
  // [MINT_TEST_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   swapRouterToken: '',
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: MINT_TESTNET,
  //   nodeRpcList: [
  //     MINT_TESTNET,
  //   ],
  //   chainID: MINT_TEST_CHAINID,
  //   lookHash: MINT_TEST_EXPLORER + '/tx/',
  //   lookAddr: MINT_TEST_EXPLORER + '/address/',
  //   lookBlock: MINT_TEST_EXPLORER + '/block/',
  //   explorer: MINT_TEST_EXPLORER,
  //   symbol: symbol,
  //   name: 'Huobi',
  //   networkName: 'Heco testnet',
  //   type: 'test',
  //   label: MINT_TEST_CHAINID,
  // },
}