import {getUrlData} from '../tools/axios'
import {USE_VERSION} from '../../config/constant'
export function registerSwap (hash:string, chainId:any) {
  return new Promise(resolve => {
    const url = `https://bridgeapi.anyswap.exchange/v3/register?hash=${hash}&chainId=${chainId}&type=${USE_VERSION}`
    getUrlData(url).then(res => {
      console.log(res)
      resolve(res)
    })
  })
}