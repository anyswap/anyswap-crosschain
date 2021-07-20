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
}
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
  pairid
}: RecordsTxnsProp) {
  return new Promise(resolve => {
    // console.log(hash)
    const url = `${config.bridgeApi}/v3/records`
    const useVersion = version ? version : USE_VERSION
    // console.log(version)
    // console.log(USE_VERSION)
    postUrlData(url, {
      hash: hash,
      srcChainID: chainId,
      destChainID: selectChain,
      token: !version || version === USE_VERSION ? config.getCurChainInfo(chainId).bridgeRouterToken : '',
      from: account,
      version: useVersion,
      value: value,
      formatvalue: formatvalue,
      to: to,
      symbol: symbol,
      pairid: pairid
    }).then(res => {
      console.log(res)
      resolve(res)
    })
  })
}

// recordsTxns({
//   hash: '0xc0a1123b0e95c5bfc32bfb7411852795d91d1e053762b1146af21e32232c2841',
//   chainId: '56',
//   selectChain: '128',
//   account: '0xc03033d8b833ff7ca08bf2a58c9bc9d711257249',
//   value: '50000000000000000',
//   formatvalue: '0.05',
//   to: '0xe09c98f97dafb1f954cea0ce550383e2bd0c8829',
//   symbol: 'BNB',
//   version: 'swapin',
//   pairid: 'BNB'
// })
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