import { getContract, web3Fn } from '../tools/web3Utils'
import {setLocalConfig, getLocalConfig, fromWei} from '../tools/tools'
import config from '../../config'
const contract = getContract()

const DESTBALANCE = 'DESTBALANCE'

export function getNodeBalance(account:string, token:string, chainID:any, dec:any) {
  return new Promise(resolve => {
    
    if (
      account
      && token
      && chainID
    ) {
      const lObj = getLocalConfig(account, token, chainID, DESTBALANCE, 1000 * 10)
      if (lObj && lObj.balance) {
        resolve(fromWei(lObj.balance, dec))
      } else {
        contract.options.address = token
        web3Fn.setProvider(config.getCurChainInfo(chainID).nodeRpc)
        contract.methods.balanceOf(account).call((err:any, res:any) => {
          if (err) {
            console.log(err)
            resolve('')
          } else {
            // console.log(res)
            setLocalConfig(account, token, chainID, DESTBALANCE, {balance: res})
            resolve(fromWei(res, dec))
          }
        })
      }
    } else {
      resolve('')
    }
  })
}