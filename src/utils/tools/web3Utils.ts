// import config from '../../config'
import ERC20_ABI from '../../constants/abis/erc20.json'
const Web3 = require('web3')

// export const web3Fn = new Web3(new Web3.providers.HttpProvider(config.nodeRpc))
export const web3Fn = new Web3()

export function getContract(ABI?: any) {
  ABI = ABI ? ABI : ERC20_ABI
  return new web3Fn.eth.Contract(ABI)
}
