import { Interface } from '@ethersproject/abi'
import veMULTIReward from './veMULTIReward.json'

const VE_MULTI_REWARD_INTERFACE = new Interface(veMULTIReward)

export default VE_MULTI_REWARD_INTERFACE
export { veMULTIReward, VE_MULTI_REWARD_INTERFACE }
