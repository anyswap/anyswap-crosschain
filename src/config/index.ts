import {chainInfo} from './chainConfig'
import {
  ENV_NODE_CONFIG,
  INIT_NODE,
  VERSION,
  USE_VERSION,
  bridgeApi
} from './constant'

import {getNetwork, getInitBridgeChain} from './getUrlParams'
 
interface ConFig {
  [key: string]: any
}

const ENV = getNetwork(ENV_NODE_CONFIG, INIT_NODE)
const netConfig:ConFig = chainInfo[ENV] ? chainInfo[ENV] : chainInfo[INIT_NODE]

const INITBRIDGE = getInitBridgeChain(netConfig.bridgeInitChain, netConfig.bridgeInitToken)

function formatHiddenCoin (list?:Array<any>) {
  const arr:any = []
  if (list) {
    for (let str of list) {
      if (str.indexOf('any') === 0) str = 'any' + str
      arr.push(str)
    }
  }
  return arr
}

const bridgeChain:ConFig = {
  [VERSION.V1]: {
    bridgeConfigToken: '0xf27ee99622c3c9b264583dacb2cce056e194494f',
    bridgeInitDataChain: '56',
  },
  [VERSION.V2]: {
    bridgeConfigToken: '0xe6f658118bcc6d344c812826b1af13bd7d59956c',
    bridgeInitDataChain: '56',
    hiddenCoin: formatHiddenCoin([]),
    hiddenChain: [],
  },
  [VERSION.V3]: {
    bridgeConfigToken: '0x7beb05cf5681f402e762f8569c2fc138a2172978',
    bridgeInitDataChain: '56',
  }
}

const bridgeTestChain:ConFig = {
  [VERSION.V1]: {
    bridgeConfigToken: '0x826Ee16b4B401E84c76b48a2A81545cBb994A995',
    bridgeInitDataChain: '256',
  },
  [VERSION.V2]: {
    bridgeConfigToken: '',
    bridgeInitDataChain: '',
  },
  [VERSION.V3]: {
    bridgeConfigToken: '',
    bridgeInitDataChain: '',
  }
}

const config: ConFig = {
  ...netConfig,
  ...INITBRIDGE,
  ENV_NODE_CONFIG,
  chainInfo,
  bridgeApi,
  localDataDeadline: 1622532945161,
  farmUrl: '#/',
  explorerUrl: 'https://anyswap.net/explorer',
  getBaseCoin (value:any, chainId:any, type?: number, name?: string) {
    // console.log(value)
    if (
      value
      && (
        value === 'BASECURRENCY'
        || value === 'W' + this.getCurChainInfo(chainId).symbol
      )
    ) {
      if (type) {
        return this.getCurChainInfo(chainId).name
      } else {
        return this.getCurChainInfo(chainId).symbol
      }
    } else if (value && value === 'WETH') {
      return 'W' + this.getCurChainInfo(chainId).symbol
    } else {
      if (type) {
        return name
      } else {
        return value
      }
    }
  },
  getCurBridgeConfigInfo (chainID:any, version?:any) {
    version = version ? version : USE_VERSION
    let envConfig:ConFig = bridgeChain[version]
    if (chainID && chainInfo[chainID].type === 'test') {
      envConfig = bridgeTestChain[version]
    }
    return envConfig
  },
  getCurChainInfo (chainID:any) {
    if (chainID && chainInfo[chainID]) {
      return chainInfo[chainID]
    } else {
      return netConfig
    }
  }
}
export default config
