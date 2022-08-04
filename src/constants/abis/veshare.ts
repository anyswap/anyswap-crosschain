import { Interface } from '@ethersproject/abi'
import veshare from './veshare.json'

const VE_SHARE_INTERFACE = new Interface(veshare)

export default VE_SHARE_INTERFACE
export { veshare, VE_SHARE_INTERFACE }
