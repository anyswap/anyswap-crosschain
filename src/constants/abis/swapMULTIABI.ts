import { Interface } from '@ethersproject/abi'
import swapMULTIABI from './swapMULTIABI.json'

const SWAP_MULTI_INTERFACE = new Interface(swapMULTIABI)

export default SWAP_MULTI_INTERFACE
export { SWAP_MULTI_INTERFACE, swapMULTIABI }
