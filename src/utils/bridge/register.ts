import {getUrlData, postUrlData} from '../tools/axios'
import {USE_VERSION} from '../../config/constant'

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
}
export function recordsTxns ({
  hash,
  chainId,
  selectChain,
  account,
  value,
  formatvalue,
  to,
  symbol
}: RecordsTxnsProp) {
  return new Promise(resolve => {
    // console.log(hash)
    const url = `${config.bridgeApi}/v3/records`
    postUrlData(url, {
      hash: hash,
      srcChainID: chainId,
      destChainID: selectChain,
      token: config.getCurChainInfo(chainId).bridgeRouterToken,
      from: account,
      version: USE_VERSION,
      value: value,
      formatvalue: formatvalue,
      to: to,
      symbol: symbol
    }).then(res => {
      console.log(res)
      resolve(res)
    })
  })
}