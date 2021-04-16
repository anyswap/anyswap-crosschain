import { getContract, web3Fn } from '../tools/web3Utils'
// import {setLocalConfig, getLocalConfig, formatWeb3Str, fromWei} from '../tools/tools'
import config from '../../config'
const contract = getContract()

export function getNodeBalance(account:string, token:string, srcChainID:any, destChainID:any) {
  return new Promise(resolve => {
    if (
      account
      && token
      && srcChainID
      && destChainID
    ) {
      web3Fn.setProvider(config.chainInfo[srcChainID].nodeRpc)
      contract.options.address = token
      contract.methods.balanceOf(account).call((err:any, res:any) => {
        if (err) {
          console.log(err)
        } else {
          // console.log(res)
          resolve(res)
        }
      })
    } else {
      resolve('')
    }
  })
}