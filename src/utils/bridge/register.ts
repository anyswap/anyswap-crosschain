import {getUrlData, postUrlData} from '../tools/axios'
import {USE_VERSION, timeout} from '../../config/constant'
import {getLocalConfig} from '../tools/tools'
import {CROSSCHAINBRIDGE} from './type'

import config from '../../config'

export function registerSwap (hash:string, chainId:any) {
  return new Promise(resolve => {
    console.log(hash)
    const url = `${config.bridgeApi}/v3/register?hash=${hash}&chainId=${chainId}&type=${USE_VERSION}`
    getUrlData(url).then(res => {
      console.log(res)
      resolve(res)
    })
  })
}


interface RecordsTxnsProp {
  hash: string
  chainId:any
  selectChain:any,
  account: string | null | undefined,
  value: string,
  formatvalue: string,
  to: string,
  symbol: string | undefined,
  version?: string | undefined,
  pairid?: string | undefined,
  routerToken?: string | undefined,
}
const registerList:any = {}

// console.log(window?.navigator)
// console.log(window)
// getUrlData('https://api.ipify.org/?format=json').then(res => console.log(res))
export function recordsTxns ({
  hash,
  chainId,
  selectChain,
  account,
  value,
  formatvalue,
  to,
  symbol,
  version,
  pairid,
  routerToken
}: RecordsTxnsProp) {
  return new Promise(async(resolve) => {
    // console.log(hash)
    const url = `${config.bridgeApi}/v3/records`
    const useVersion = version ? version : USE_VERSION
    // console.log(version)
    // console.log(USE_VERSION)
    // const ip:any = await getUrlData('https://api.ipify.org/?format=json')
    const data = {
      hash: hash,
      srcChainID: chainId,
      destChainID: selectChain,
      token: routerToken ? routerToken : '',
      from: account,
      version: useVersion,
      value: value,
      formatvalue: formatvalue,
      to: to,
      symbol: symbol,
      pairid: pairid,
      // userAgent: window?.navigator?.userAgent,
      // userIP: window?.returnCitySN ? window?.returnCitySN : (ip?.data?.ip ? {cip: ip?.data?.ip} : '')
    }
    if (!registerList[hash]) {
      registerList[hash] = {
        hash,
        chainId,
        selectChain,
        account,
        value,
        formatvalue,
        to,
        symbol,
        version,
        pairid,
        routerToken,
        isRegister: 0,
        timestamp: Date.now()
      }
    }
    postUrlData(url, data).then((res:any) => {
      console.log(res)
      if (res.msg === 'Success' || res.data === 'Error') {
        registerList[hash].isRegister = 1
      } else {
        if ((Date.now() - registerList[hash].timestamp) <= 3000) {
          setTimeout(() => {
            recordsTxns(registerList[hash])
          }, 1000)
        }
      }
      resolve(res)
    })
  })
}

const approveList:any = {}
export function recordsApprove ({
  token,
  spender,
  account,
  amount,
  symbol,
  decimals,
  hash,
  chainId,
  type,
}: {
  token: any,
  spender: any,
  account: any,
  amount: any,
  symbol: any,
  decimals: any,
  hash: any,
  chainId: any,
  type: any,
}) {
  return new Promise(async(resolve) => {
    // console.log(hash)
    const url = `${config.bridgeApi}/v3/records/approved`
    const data = {
      token,
      spender,
      account,
      amount,
      symbol,
      decimals,
      hash,
      chainId,
      type,
    }
    if (!approveList[hash]) {
      approveList[hash] = {
        token,
        spender,
        account,
        amount,
        symbol,
        decimals,
        hash,
        chainId,
        type,
        isRegister: 0,
        timestamp: Date.now()
      }
    }
    postUrlData(url, data).then((res:any) => {
      console.log(res)
      if (res.msg === 'Success' || res.data === 'Error') {
        approveList[hash].isRegister = 1
      } else {
        if ((Date.now() - approveList[hash].timestamp) <= 3000) {
          setTimeout(() => {
            recordsApprove(approveList[hash])
          }, 1000)
        }
      }
      resolve(res)
    })
  })
}
// recordsApprove({
//   token: '',
//   spender: '0xb153fb3d196a8eb25522705560ac152eeec57901',
//   account: '0xC03033d8b833fF7ca08BF2A58C9BC9d711257249',
//   amount: '0x0',
//   symbol: 'WETH',
//   decimals: '18',
//   hash: '0xf31d62838189bae0a40c0420b2d6b79aa502d7850ee0f30abcd7aaa91fadaf3a',
//   chainId: 1,
//   type: 'Revoke'
// })
export function getP2PInfo (account:any, chainId:any, symbol:string, token:any) {
  return new Promise(resolve => {
    // console.log(hash)
    const lData = getLocalConfig(account, token, chainId, CROSSCHAINBRIDGE, timeout, undefined)
    if (lData) {
      // console.log(lData)
      resolve({p2pAddress: lData.p2pAddress})
    } else {
      const url = `${config.bridgeApi}/v2/register/${account}/${chainId}/${symbol}`
      getUrlData(url).then((res:any) => {
        // console.log(res)
        if (res.msg === 'Success') {
          resolve({p2pAddress: res?.data?.P2shAddress ?? res?.data?.info?.P2shAddress})
        } else {
          resolve('')
        }
      })
    }
  })
}