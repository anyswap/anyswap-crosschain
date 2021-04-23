import { getContract, web3Fn } from '../tools/web3Utils'
import {setLocalConfig, getLocalConfig, fromWei} from '../tools/tools'
import config from '../../config'
const contract = getContract()

const DESTBALANCE = 'DESTBALANCE'

export function getNodeBalance(account?:any, token?:string, chainID?:any, dec?:any) {
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

const SRCTOTALSUPPLY = 'SRCTOTALSUPPLY'
export function getNodeTotalsupply(token?:string, chainID?:any, dec?:any) {
  return new Promise(resolve => {
    
    if (
      token
      && chainID
    ) {
      const lObj = getLocalConfig(SRCTOTALSUPPLY, token, chainID, SRCTOTALSUPPLY, 1000 * 10)
      if (lObj && lObj.totalsupply) {
        resolve(fromWei(lObj.totalsupply, dec))
      } else {
        contract.options.address = token
        web3Fn.setProvider(config.getCurChainInfo(chainID).nodeRpc)
        contract.methods.totalSupply().call((err:any, res:any) => {
          if (err) {
            console.log(err)
            resolve('')
          } else {
            // console.log(res)
            setLocalConfig(SRCTOTALSUPPLY, token, chainID, SRCTOTALSUPPLY, {totalsupply: res})
            resolve(fromWei(res, dec))
          }
        })
      }
    } else {
      resolve('')
    }
  })
}
export function getGroupTotalsupply (tokenList:any, chainId?:any) {
  return new Promise(resolve => {
    if (!chainId) resolve(false)
    else {
      const lData = getLocalConfig(SRCTOTALSUPPLY, 'all', chainId, SRCTOTALSUPPLY, 1000 * 10)
      // console.log(lData)
      // console.log(token)
      if (lData && lData.list) {
        resolve(lData.list)
      } else {
        const batch = new web3Fn.BatchRequest()
        const len = tokenList.length
        for (let i = 0; i < len; i++) {
          const token = tokenList[i]
          contract.options.address = token
          const tsData = contract.methods.totalSupply().encodeABI()
          batch.add(web3Fn.eth.call.request({data: tsData, to: token}, 'latest', (err:any, res:any) => {
            if (err) {
              console.log(err)
            } else {
              if ((i + 1) === len) {

              }
              console.log(res)
            }
          }))
        }
      }
    }
  })
}
