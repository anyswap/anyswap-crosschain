import { Interface } from '@ethersproject/abi'
import RouterAction from './RouterAction.json'

const ROUTER_ACTION_INTERFACE = new Interface(RouterAction)

export { RouterAction, ROUTER_ACTION_INTERFACE}
