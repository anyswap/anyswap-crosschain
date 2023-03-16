import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const BOBABEAM_MAIN_CHAINID = ChainId.BOBABEAM
export const BOBABEAM_MAINNET = getLocalRPC(BOBABEAM_MAIN_CHAINID, 'https://bobabeam.boba.network')
export const BOBABEAM_MAIN_EXPLORER = 'https://blockexplorer.bobabeam.boba.network'

const symbol = 'BOBA'

const bridgeToken = {
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
    nativeToken: '',
    BOBABEAMssBridgeInitToken: ''
  },
}

export default {
  [BOBABEAM_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '',
    multicalToken: '0x6aB6d61428fde76768D7b45D8BFeec19c6eF91A8',
    v1FactoryToken: '',
    v2FactoryToken: '',
    nodeRpc: BOBABEAM_MAINNET,
    nodeRpcList: [
      BOBABEAM_MAINNET,
    ],
    chainID: BOBABEAM_MAIN_CHAINID,
    lookHash: BOBABEAM_MAIN_EXPLORER + '/tx/',
    lookAddr: BOBABEAM_MAIN_EXPLORER + '/address/',
    lookBlock: BOBABEAM_MAIN_EXPLORER + '/block/',
    explorer: BOBABEAM_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Boba Beam',
    networkName: 'Boba Beam mainnet',
    networkLogo: 'BOBABEAM',
    walletName: 'Bobabeam',
    type: 'main',
    label: BOBABEAM_MAIN_CHAINID,
  },
}