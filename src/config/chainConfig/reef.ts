
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

// export const REEF_MAINNET = 'https://cosmos-mainnet-rpc.allthatnode.com:1317'
// export const REEF_MAIN_CHAINID = ChainId.REEF
// export const REEF_MAIN_EXPLORER = 'https://atomscan.com'

export const REEF_TESTNET = 'https://rpc.reefscan.com'
export const REEF_TEST_CHAINID = ChainId.REEF_TEST
export const REEF_TEST_EXPLORER = 'https://reefscan.com'

const symbol = 'REEF'

const bridgeToken:any = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: ''
  }
}

export default {
  // [REEF_MAIN_CHAINID]: {
  //   ...bridgeToken[USE_VERSION],
  //   multicalToken: '',
  //   v1FactoryToken: '',
  //   v2FactoryToken: '',
  //   nodeRpc: REEF_MAINNET,
  //   nodeRpcList: [
  //     REEF_MAINNET,
  //     'https://cosmos-mainnet-archive.allthatnode.com:1317',
  //     'https://cosmos-mainnet-rpc.allthatnode.com:26657',
  //     'https://cosmos-mainnet-archive.allthatnode.com:26657'
  //   ],
  //   chainID: REEF_MAIN_CHAINID,
  //   lookHash: REEF_MAIN_EXPLORER + '/transactions/',
  //   lookAddr: REEF_MAIN_EXPLORER + '/accounts/',
  //   lookBlock: REEF_MAIN_EXPLORER + '/blocks/',
  //   explorer: REEF_MAIN_EXPLORER,
  //   symbol: symbol,
  //   name: 'Cosmos',
  //   networkName: 'Cosmos mainnet',
  //   networkLogo: 'SEI',
  //   type: 'main',
  //   label: REEF_MAIN_CHAINID,
  //   chainType: REEF_MAIN_CHAINID,
  // },
  [REEF_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    multicalToken: '',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: REEF_TESTNET,
    nodeRpcList: [
      REEF_TESTNET,
    ],
    chainID: REEF_TEST_CHAINID,
    lookHash: REEF_TEST_EXPLORER + '/transaction/',
    lookAddr: REEF_TEST_EXPLORER + '/account/',
    lookBlock: REEF_TEST_EXPLORER + '/blocks/',
    explorer: REEF_TEST_EXPLORER,
    symbol: symbol,
    name: 'Reef',
    networkName: 'Reef testnet',
    networkLogo: 'Reef',
    type: 'test',
    label: REEF_TEST_CHAINID,
    chainType: REEF_TEST_CHAINID
  },
}