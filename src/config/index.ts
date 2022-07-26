import { chainInfo } from './chainConfig'
import { ENV_NODE_CONFIG, INIT_NODE, USE_VERSION, env, version, controlConfig } from './constant'
import { BNB_MAIN_CHAINID } from './chainConfig/bsc'
import { getNetwork, getInitBridgeChain } from './tools/getUrlParams'
import { MATIC_TEST_CHAINID } from './chainConfig/matic'

interface Config {
  [key: string]: any
}

const ENV = getNetwork(ENV_NODE_CONFIG, INIT_NODE)
const netConfig: Config = chainInfo[ENV] ? chainInfo[ENV] : chainInfo[INIT_NODE]
const INITBRIDGE = getInitBridgeChain(netConfig.bridgeInitChain, netConfig.bridgeInitToken)
const STORAGE_CHAIN_ID = process.env.NODE_ENV === 'production' ? BNB_MAIN_CHAINID : MATIC_TEST_CHAINID

const config: Config = {
  ...netConfig,
  ...INITBRIDGE,
  env,
  version,
  ENV_NODE_CONFIG,
  chainInfo,
  STORAGE_CHAIN_ID,
  oldAppName: 'Anyswap V1',
  appName: 'Cross-chain',
  baseCurrency: 'ANY',
  localDataDeadline: 1624700942896,
  farmUrl: '#/',
  explorerUrl: 'https://anyswap.net/explorer',
  isStopSystem: 0,
  getBaseCoin(value: any, chainId: any, type?: number, name?: string) {
    if (
      value &&
      (value === 'BASECURRENCY' ||
        (value === 'W' + this.getCurChainInfo(chainId).symbol && this.getCurChainInfo(chainId).nativeToken))
    ) {
      if (type) {
        return this.getCurChainInfo(chainId).name
      }

      return this.getCurChainInfo(chainId).symbol
    } else {
      return type ? name : value
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

if (process.env.NODE_ENV === 'development') {
  console.group('%c config', 'color: brown')
  console.log(config)
  console.groupEnd()
}

export default config
