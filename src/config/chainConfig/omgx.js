import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const OMGX_MAIN_CHAINID = ''
export const OMGX_MAINNET = getLocalRPC(OMGX_MAIN_CHAINID, '')
export const OMGX_MAIN_EXPLORER = ''

export const OMGX_TEST_CHAINID = ChainId.OMGX_TEST
export const OMGX_TESTNET = getLocalRPC(OMGX_TEST_CHAINID, 'https://rinkeby.omgx.network')
export const OMGX_TEST_EXPLORER = 'https://blockexplorer.rinkeby.omgx.network/?network=OmgX'

const symbol = 'OMGX'

const bridgeToken = {
  [VERSION.V3]: {
    bridgeInitToken: '0x461d52769884ca6235b685ef2040f47d30c94eb5',
    bridgeInitChain: '1',
    nativeToken: '0x461d52769884ca6235b685ef2040f47d30c94eb5'
  },
  [VERSION.V2_T2]: {
    bridgeInitToken: '',
    bridgeInitChain: '4',
    nativeToken: ''
  },
  [VERSION.V2_T3]: {
    bridgeInitToken: '0x4200000000000000000000000000000000000006',
    bridgeInitChain: '421611',
    nativeToken: ''
  },
}

export default {
  
  [OMGX_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x9e73d56dd1942743ffdf055449b052a806b854be',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: OMGX_MAINNET,
    nodeRpcList: [
      OMGX_MAINNET,
    ],
    chainID: OMGX_MAIN_CHAINID,
    lookHash: OMGX_MAIN_EXPLORER + '/tx/',
    lookAddr: OMGX_MAIN_EXPLORER + '/address/',
    lookBlock: OMGX_MAIN_EXPLORER + '/block/',
    explorer: OMGX_MAIN_EXPLORER,
    symbol: symbol,
    name: 'OMGX',
    networkName: 'OMGX mainnet',
    networkLogo: 'OMGX',
    type: 'main',
    label: OMGX_MAIN_CHAINID,
  },
  [OMGX_TEST_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x667fd83e24ca1d935d36717d305d54fa0cac991c',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: OMGX_TESTNET,
    nodeRpcList: [
      OMGX_TESTNET,
    ],
    chainID: OMGX_TEST_CHAINID,
    lookHash: OMGX_TEST_EXPLORER + '/tx/',
    lookAddr: OMGX_TEST_EXPLORER + '/address/',
    lookBlock: OMGX_TEST_EXPLORER + '/block/',
    explorer: OMGX_TEST_EXPLORER,
    symbol: symbol,
    name: 'OMGX',
    networkName: 'OMGX Rinkeby',
    networkLogo: 'OMGX',
    type: 'main',
    label: OMGX_TEST_CHAINID,
  },
}