import {chainInfo} from './chainConfig'
import {
  ENV_NODE_CONFIG,
  INIT_NODE,
  VERSION,
  USE_VERSION
} from './constant'

import {getNetwork, getInitBridgeChain} from './getUrlParams'
 
interface ConFig {
  [key: string]: any
}

const ENV = getNetwork(ENV_NODE_CONFIG, INIT_NODE)
const netConfig:ConFig = chainInfo[ENV] ? chainInfo[ENV] : chainInfo[INIT_NODE]

const INITBRIDGE = getInitBridgeChain(netConfig.bridgeInitChain, netConfig.bridgeInitToken)

const bridgeChain = {
  [VERSION.V1]: {
    bridgeConfigToken: '0xf27ee99622c3c9b264583dacb2cce056e194494f',
    bridgeInitDataChain: '56',
  },
  [VERSION.V2]: {
    bridgeConfigToken: '0xe6f658118bcc6d344c812826b1af13bd7d59956c',
    bridgeInitDataChain: '56',
  }
}

const bridgeTestChain = {
  [VERSION.V1]: {
    bridgeConfigToken: '0x826Ee16b4B401E84c76b48a2A81545cBb994A995',
    bridgeInitDataChain: '256',
  },
  [VERSION.V2]: {
    bridgeConfigToken: '',
    bridgeInitDataChain: '',
  }
}

const config: ConFig = {
  ...netConfig,
  ...INITBRIDGE,
  ENV_NODE_CONFIG,
  chainInfo,
  localDataDeadline: 1622532945161,
  getBaseCoin (value:any, type: number) {
    if (value && value === 'BASECURRENCY') {
      if (type) {
        return netConfig.name
      } else {
        return netConfig.symbol
      }
    } else if (value && value === 'WETH') {
      return 'W' + netConfig.symbol
    } else {
      return value
    }
  },
  getCurBridgeConfigInfo (chainID:any) {
    let envConfig:ConFig = bridgeChain[USE_VERSION]
    if (chainID && chainInfo[chainID].type === 'test') {
      envConfig = bridgeTestChain[USE_VERSION]
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
