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
// console.log(returnCitySN)
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
  return new Promise(resolve => {
    // console.log(hash)
    const url = `${config.bridgeApi}/v3/records`
    const useVersion = version ? version : USE_VERSION
    // console.log(version)
    // console.log(USE_VERSION)
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
      userIP: window?.returnCitySN
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
// hash: 0x380da576e0d50d4d78ad21952417dfd4d7aaf3c2034cf31541c35b941522ec96
// srcChainID: 250
// destChainID: 56
// token: 0x1ccca1ce62c62f7be95d4a67722a8fdbed6eecb4
// from: 0xc03033d8b833ff7ca08bf2a58c9bc9d711257249
// version: STABLEV3
// value: 12000000
// formatvalue: 12
// to: 0xc03033d8b833ff7ca08bf2a58c9bc9d711257249
// symbol: USDC
// recordsTxns({
//   hash: '8ce1495c5952eea2dc7f8bc580e4ea654292aba1c36dcfb6a37a054c6bb31f70',
//   chainId: 'TERRA',
//   selectChain: '250',
//   account: 'terra19vq4dqkmehun49nr5jmrmrswq476ehgdln4aws',
//   value: '1000000',
//   formatvalue: '1',
//   to: '0xC03033d8b833fF7ca08BF2A58C9BC9d711257249',
//   symbol: 'USD',
//   version: 'swapin',
//   pairid: 'USD',
//   routerToken: ''
// })
// hash: 8ce1495c5952eea2dc7f8bc580e4ea654292aba1c36dcfb6a37a054c6bb31f70
// srcChainID: 250
// destChainID: 250
// token: 
// from: terra19vq4dqkmehun49nr5jmrmrswq476ehgdln4aws
// version: swapin
// value: 1000000
// formatvalue: 1
// to: 0xC03033d8b833fF7ca08BF2A58C9BC9d711257249
// symbol: USD
// pairid: USD
// https://bridgeapi.anyswap.exchange/v2/register/account/chainId/symbol


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