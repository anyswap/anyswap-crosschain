import {formatSwapTokenList, getLocalRPC} from './methods'
import {tokenListUrl, VERSION, USE_VERSION} from '../constant'

export const XDAI_MAIN_CHAINID = 100
export const XDAI_MAINNET = getLocalRPC(XDAI_MAIN_CHAINID, 'https://rpc.xdaichain.com')
export const XDAI_MAIN_EXPLORER = 'https://blockscout.com/xdai/mainnet'

export const tokenList = []
export const testTokenList = []

const symbol = 'xDAI'

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
}

export default {
  [XDAI_MAIN_CHAINID]: {
    tokenListUrl: tokenListUrl + XDAI_MAIN_CHAINID,
    tokenList: formatSwapTokenList(symbol, tokenList),
    ...bridgeToken[USE_VERSION],
    swapRouterToken: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
    swapInitToken: '',
    // multicalToken: '0xb5b692a88BDFc81ca69dcB1d924f59f0413A602a',
    multicalToken: '0x67dA5f2FfaDDfF067AB9d5F025F8810634d84287',
    v1FactoryToken: '',
    v2FactoryToken: '0xc35DADB65012eC5796536bD9864eD8773aBc74C4',
    timelock: '0x9a8541Ddf3a932a9A922B607e9CF7301f1d47bD1',
    nodeRpc: XDAI_MAINNET,
    nodeRpcList: [
      XDAI_MAINNET,
    ],
    chainID: XDAI_MAIN_CHAINID,
    lookHash: XDAI_MAIN_EXPLORER + '/tx/',
    lookAddr: XDAI_MAIN_EXPLORER + '/address/',
    lookBlock: XDAI_MAIN_EXPLORER + '/block/',
    explorer: XDAI_MAIN_EXPLORER,
    symbol: symbol,
    name: 'xDAI',
    networkName: 'XDAI mainnet',
    type: 'main',
    label: XDAI_MAIN_CHAINID,
    isSwitch: 1,
    underlying: [],
    suffix: 'xDAI',
    anyToken: '0xb44a9b6905af7c801311e8f4e76932ee959c663c'
  },
}