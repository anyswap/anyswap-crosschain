import { Interface } from '@ethersproject/abi'
import RouterConfig from './RouterConfig.json'

const ROUTER_Config_INTERFACE = new Interface(RouterConfig)

export { RouterConfig, ROUTER_Config_INTERFACE}
