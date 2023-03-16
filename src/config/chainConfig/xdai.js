import {getLocalRPC} from './methods'
import {VERSION, USE_VERSION} from '../constant'
import {ChainId} from './chainId'

export const XDAI_MAIN_CHAINID = ChainId.XDAI
export const XDAI_MAINNET = getLocalRPC(XDAI_MAIN_CHAINID, 'https://rpc.ankr.com/gnosis')
export const XDAI_MAIN_EXPLORER = 'https://blockscout.com/xdai/mainnet'

const symbol = 'GNO'

const bridgeToken = {
  [VERSION.V1]: {
    bridgeInitToken: '',
    bridgeInitChain: '',
  },
  [VERSION.V5]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: '0xb44a9b6905af7c801311e8f4e76932ee959c663c'
  },
  [VERSION.V7]: {
    bridgeInitToken: '',
    bridgeInitChain: '56',
    nativeToken: '',
    crossBridgeInitToken: '0xb44a9b6905af7c801311e8f4e76932ee959c663c'
  },
}

export default {
  [XDAI_MAIN_CHAINID]: {
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    multicalToken: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287',
    v1FactoryToken: '',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    nodeRpc: XDAI_MAINNET,
    nodeRpcList: [
      XDAI_MAINNET,
      'https://gnosischain-rpc.gateway.pokt.network',
      'https://gnosis-mainnet.public.blastapi.io/',
      'https://xdai-rpc.gateway.pokt.network/',
      'https://rpc.ankr.com/gnosis',
      'https://rpc.gnosischain.com/',
      'https://xdai-archive.blockscout.com/',
    ],
    chainID: XDAI_MAIN_CHAINID,
    lookHash: XDAI_MAIN_EXPLORER + '/tx/',
    lookAddr: XDAI_MAIN_EXPLORER + '/address/',
    lookBlock: XDAI_MAIN_EXPLORER + '/block/',
    explorer: XDAI_MAIN_EXPLORER,
    symbol: symbol,
    name: 'Gnosis',
    networkName: 'Gnosis mainnet',
    walletName: 'Gnosis',
    type: 'main',
    label: XDAI_MAIN_CHAINID,
  },
}