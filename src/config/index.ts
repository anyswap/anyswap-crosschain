import {chainInfo} from './chainConfig'
import {
  ENV_NODE_CONFIG,
  INIT_NODE,
  USE_VERSION,
  bridgeApi,
  env,
  version,
  controlConfig
} from './constant'

import {getNetwork, getInitBridgeChain} from './getUrlParams'
 
interface ConFig {
  [key: string]: any
}

const ENV = getNetwork(ENV_NODE_CONFIG, INIT_NODE)
const netConfig:ConFig = chainInfo[ENV] ? chainInfo[ENV] : chainInfo[INIT_NODE]

const INITBRIDGE = getInitBridgeChain(netConfig.bridgeInitChain, netConfig.bridgeInitToken)

const config: ConFig = {
  ...netConfig,
  ...INITBRIDGE,
  env,
  version,
  ENV_NODE_CONFIG,
  chainInfo,
  bridgeApi,
  localDataDeadline: 1624700942896,
  farmUrl: '#/',
  explorerUrl: 'https://anyswap.net/explorer',
  isStopSystem: 0,
  getBaseCoin (value:any, chainId:any, type?: number, name?: string) {
    // console.log(value)
    if (
      value
      && (
        value === 'BASECURRENCY'
        || (value === 'W' + this.getCurChainInfo(chainId).symbol && this.getCurChainInfo(chainId).nativeToken)
      )
    ) {
      if (type) {
        return this.getCurChainInfo(chainId).name
      } else {
        return this.getCurChainInfo(chainId).symbol
      }
    } 
    // else if (value && value === 'WETH') {
    //   return 'W' + this.getCurChainInfo(chainId).symbol
    // } 
    else {
      if (type) {
        return name
      } else {
        return value
      }
    }
  },
  getCurConfigInfo (version?:any) {
    version = version ? version : USE_VERSION
    return controlConfig[version]
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
