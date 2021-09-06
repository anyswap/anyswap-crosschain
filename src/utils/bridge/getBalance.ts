import { getContract, web3Fn } from '../tools/web3Utils'
import {setLocalConfig, getLocalConfig, fromWei} from '../tools/tools'
// import {isUnderlying} from './getBaseInfo'
import config from '../../config'
import { isAddress } from '..'
const contract = getContract()

const DESTBALANCE = 'DESTBALANCE'

export function getNodeBalance(account?:any, token?:string, chainID?:any, dec?:any, isNativeToken?:boolean) {
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
        // console.log('token', token)
        web3Fn.setProvider(config.getCurChainInfo(chainID).nodeRpc)
        if (isNativeToken || !isAddress(token)) {
          web3Fn.eth.getBalance(account).then((res:any) => {
            // console.log(res)
            setLocalConfig(account, token, chainID, DESTBALANCE, {balance: res})
            resolve(fromWei(res, dec))
          }).catch((err:any) => {
            console.log(err)
            resolve('')
          })
        } else {
          contract.options.address = token
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
      }
    } else {
      resolve('')
    }
  })
}

const SRCTOTALSUPPLY = 'SRCTOTALSUPPLY'
function getBlandTs (tokenList:any, chainId?:any, account?:string | null | undefined) {
  return new Promise(async(resolve) => {
    // console.log(config.getCurChainInfo(chainId).nodeRpc)
    // console.log(tokenList)
    web3Fn.setProvider(config.getCurChainInfo(chainId).nodeRpc)
    const batch = new web3Fn.BatchRequest()
    const len = tokenList.length
    const list:any = {}
    for (let i = 0; i < len; i++) {
      const tokenObj = tokenList[i]
      // const underlyingInfo:any = await isUnderlying(tokenObj.token, chainId)
      // console.log(tokenObj)
      // console.log(tokenObj.underlying)
      if (tokenObj.underlying) {
        contract.options.address = tokenObj.underlying
        const tsData = contract.methods.balanceOf(tokenObj.token).encodeABI()
        batch.add(web3Fn.eth.call.request({data: tsData, to: tokenObj.underlying}, 'latest', (err:any, res:any) => {
        // batch.add(web3Fn.eth.call.request({data: tsData, to: tokenObj.token}, 'latest', (err:any, res:any) => {
          if (!list[tokenObj.token]) list[tokenObj.token] = {}
          if (err) {
            console.log(err)
            list[tokenObj.token].ts = ''
          } else {
            list[tokenObj.token].ts = fromWei(web3Fn.utils.hexToNumberString(res), tokenObj.dec)
          }
        }))
      }

      if (isAddress(tokenObj.token)) {
        contract.options.address = tokenObj.token
        const tsData = contract.methods.totalSupply().encodeABI()
        batch.add(web3Fn.eth.call.request({data: tsData, to: tokenObj.token}, 'latest', (err:any, res:any) => {
        // batch.add(web3Fn.eth.call.request({data: tsData, to: tokenObj.token}, 'latest', (err:any, res:any) => {
          if (!list[tokenObj.token]) list[tokenObj.token] = {}
          if (err) {
            // console.log(err)
            list[tokenObj.token].anyts = ''
          } else {
            list[tokenObj.token].anyts = fromWei(web3Fn.utils.hexToNumberString(res), tokenObj.dec)
          }
          if ((i + 1) === len) {
            resolve(list)
          }
        }))
      }

      if (account) {
        if (isAddress(tokenObj.token)) {
          const blData = contract.methods.balanceOf(account).encodeABI()
          batch.add(web3Fn.eth.call.request({data: blData, to: tokenObj.token}, 'latest', (err:any, res:any) => {
            if (!list[tokenObj.token]) list[tokenObj.token] = {}
            if (err) {
              console.log(err)
              list[tokenObj.token].balance = ''
            } else {
              list[tokenObj.token].balance = fromWei(web3Fn.utils.hexToNumberString(res), tokenObj.dec)
            }
          }))
        } else {
          batch.add(web3Fn.eth.getBalance.request(account, 'latest', (err:any, res:any) => {
          // batch.add(web3Fn.eth.getBalance(account, 'latest', (err:any, res:any) => {
            if (!list[tokenObj.token]) list[tokenObj.token] = {}
            // console.log(res)
            if (err) {
              console.log(err)
              list[tokenObj.token].balance = ''
            } else {
              list[tokenObj.token].balance = fromWei(res, tokenObj.dec)
            }
          }))
        }
      }
    }
    batch.execute()
  })
}
export function getNodeTotalsupply(token?:string, chainId?:any, dec?:any, account?:string | null | undefined, underlying?:string | undefined) {
  return new Promise(resolve => {
    if (
      token
      && chainId
    ) {
      const lObj = getLocalConfig(SRCTOTALSUPPLY, SRCTOTALSUPPLY, chainId, SRCTOTALSUPPLY, 1000 * 10)
      if (lObj && lObj.totalsupply) {
        resolve(lObj)
      } else {
        const tokenList = [{
          token: token,
          dec: dec,
          underlying: underlying
        }]
        getBlandTs(tokenList, chainId, account).then((res:any) => {
          // console.log(token)
          // console.log(res)
          resolve(res)
        })
      }
    } else {
      resolve('')
    }
  })
}


export function getGroupTotalsupply (tokenList:any, chainId?:any, account?:string | null | undefined) {
  return new Promise(resolve => {
    // console.log(chainId)
    if (!chainId) resolve(false)
    else {
      const lData = getLocalConfig(SRCTOTALSUPPLY, SRCTOTALSUPPLY, chainId, SRCTOTALSUPPLY, 1000 * 10)
      // console.log(lData)
      // console.log(token)
      if (lData && lData.list) {
        resolve(lData.list)
      } else {
        getBlandTs(tokenList, chainId, account).then((res:any) => {
          // console.log(res)
          if (res) {
            setLocalConfig(SRCTOTALSUPPLY, SRCTOTALSUPPLY, chainId, SRCTOTALSUPPLY, {list: res})
          }
          resolve(res)
        })
      }
    }
  })
}
