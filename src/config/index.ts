import { chainInfo } from './chainConfig'
import { ENV_NODE_CONFIG, INIT_NODE, USE_VERSION, bridgeApi, routerApi, env, version, controlConfig } from './constant'
import { BNB_TEST_CHAINID } from './chainConfig/bsc'
import { getNetwork, getInitBridgeChain } from './tools/getUrlParams'

interface ConFig {
  [key: string]: any
}

const ENV = getNetwork(ENV_NODE_CONFIG, INIT_NODE)
const netConfig: ConFig = chainInfo[ENV] ? chainInfo[ENV] : chainInfo[INIT_NODE]
// console.log(ENV)
const INITBRIDGE = getInitBridgeChain(netConfig.bridgeInitChain, netConfig.bridgeInitToken)

const config: ConFig = {
  ...netConfig,
  ...INITBRIDGE,
  env,
  version,
  ENV_NODE_CONFIG,
  chainInfo,
  bridgeApi,
  routerApi,
  CHAIN_CONFIG: '0xf37f50d6bcff79e7f4f45ab87de136e05559c838',
  CHAIN_CONFIG_ID: 97,
  STORAGE_CHAIN_ID: BNB_TEST_CHAINID,
  oldAppName: 'Anyswap V1',
  appName: 'Cross-chain',
  baseCurrency: 'ANY',
  localDataDeadline: 1624700942896,
  farmUrl: '#/',
  explorerUrl: 'https://anyswap.net/explorer',
  isStopSystem: 0,
  getBaseCoin(value: any, chainId: any, type?: number, name?: string) {
    // console.log(value)
    if (
      value &&
      (value === 'BASECURRENCY' ||
        (value === 'W' + this.getCurChainInfo(chainId).symbol && this.getCurChainInfo(chainId).nativeToken))
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
  getCurConfigInfo(version?: any) {
    version = version ? version : USE_VERSION
    return controlConfig[version]
  },
  getCurChainInfo(chainID: any) {
    if (chainID && chainInfo[chainID]) {
      return chainInfo[chainID]
    } else {
      return netConfig
    }
  }
}
console.log('config', config)
export default config
