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
    const ip:any = await getUrlData('https://api.ipify.org/?format=json')
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
      userAgent: window?.navigator?.userAgent,
      userIP: window?.returnCitySN ? window?.returnCitySN : (ip?.data?.ip ? {cip: ip?.data?.ip} : '')
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
// hash: ceac140bff1f9d1da04e7ec94ebcef83a8d868ed527149b3a6e842e65a5e5fb4
// srcChainID: TERRA
// destChainID: 250
// token: 
// from: terra19vq4dqkmehun49nr5jmrmrswq476ehgdln4aws
// version: swapin
// value: 50000000
// formatvalue: 50
// to: 0xC03033d8b833fF7ca08BF2A58C9BC9d711257249
// symbol: UST
// pairid: USTv5
// recordsTxns({
//   hash: '0xa8d9cb02e8f9fb0328b2a9a6f3a77eeeb741ff308db4237eac68c557dac578bb',
//   chainId: '32659',
//   selectChain: '56',
//   account: '0xC03033d8b833fF7ca08BF2A58C9BC9d711257249',
//   value: '',
//   formatvalue: '',
//   to: '0xC03033d8b833fF7ca08BF2A58C9BC9d711257249',
//   symbol: 'any',
//   version: 'swapout',
//   pairid: 'any',
//   routerToken: ''
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