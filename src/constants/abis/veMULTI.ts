import { Interface } from '@ethersproject/abi'
import veMULTI from './veMULTI.json'

const VE_MULTI_INTERFACE = new Interface(veMULTI)

export default VE_MULTI_INTERFACE
export { VE_MULTI_INTERFACE, veMULTI }
