import { Interface } from '@ethersproject/abi'
import RouterSwapAction from './RouterSwapAction.json'

const ROUTER_SWAP_ACTION_INTERFACE = new Interface(RouterSwapAction)

export { RouterSwapAction, ROUTER_SWAP_ACTION_INTERFACE}
