import {getUrlData} from '../tools/axios'
import {setLocalConfig, getLocalConfig} from '../tools/tools'

import config from '../../config'
import {timeout, USE_VERSION} from '../../config/constant'

import {
  BRIDGEALLCHAIN,
  BRIDGETOKENCONFIG
} from './type'
import { isAddress } from '..'

// 获取可支持跨链的ID
export function getAllChainIDs (chainId:any, version?:any) {
  return new Promise(resolve => {
    if (!chainId) resolve(false)
    else {
      version = version ? version : USE_VERSION
      // resolve(["56", "137", "250"])
      const lData = getLocalConfig(BRIDGEALLCHAIN, BRIDGEALLCHAIN, chainId, BRIDGEALLCHAIN, timeout, undefined, version)
      if (lData) {
        resolve(lData.list)
      } else {
        const url = `${config.bridgeApi}/v3/chaininfo?version=${version}`
        getUrlData(url).then((res:any) => {
          console.log(res)
          if (res.msg === 'Success') {
            const arr:any = []
            for (const c of res.data) {
              if (config.getCurConfigInfo(version)?.hiddenChain?.includes(c)) continue
              arr.push(c)
            }
            setLocalConfig(BRIDGEALLCHAIN, BRIDGEALLCHAIN, chainId, BRIDGEALLCHAIN, {list: arr}, undefined, version)
            const lData1 = getLocalConfig(BRIDGEALLCHAIN, BRIDGEALLCHAIN, chainId, BRIDGEALLCHAIN, timeout, undefined, version)
            if (lData1) {
              resolve(lData1.list)
            } else {
              resolve('')
            }
          }
        })
      }
    }
  })
}

function getTokenInfo(token:any, chainId:any, version?:any) {
  return new Promise(resolve => {
    if (!chainId) resolve(false)
    else {
      version = version ? version : USE_VERSION
      // console.log(version)
      const lData = getLocalConfig(BRIDGETOKENCONFIG, token, chainId, BRIDGETOKENCONFIG, timeout, undefined, version)
      if (lData) {
        resolve(lData)
      } else {
        const url = `${config.bridgeApi}/v3/serverinfo?chainId=${chainId}&version=${version}`
        getUrlData(url).then((res:any) => {
          console.log(res)
          if (res.msg === 'Success' && res.data) {
            for (const t in res.data) {
              if (config.getCurConfigInfo(version)?.hiddenCoin?.includes(res.data[t].symbol)) continue
              if (!isAddress(t)) continue
              setLocalConfig(BRIDGETOKENCONFIG, t, chainId, BRIDGETOKENCONFIG, {list: res.data[t]}, undefined, version)
            }
            const lData1 = getLocalConfig(BRIDGETOKENCONFIG, token, chainId, BRIDGETOKENCONFIG, timeout, undefined, version)

            if (lData1) {
              resolve(lData1)
            } else {
              resolve('')
            }
          }
        })
      }
    }
  })
}

export function getTokenConfig (token:any, chainId:any, version?:any) {
  return new Promise(resolve => {
    getTokenInfo(token, chainId, version).then((res:any) => {
      resolve(res.list)
    })
  })
}

export function getAllToken (chainId:any, version?:any) {
  return new Promise(resolve => {
    getTokenInfo('all', chainId, version).then((res:any) => {
      // resolve({list: res})
      // console.log(res)
      resolve(res)
    })
  })
}