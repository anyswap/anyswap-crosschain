import {getLocalConfig, setLocalConfig} from './tools'

import {useMulticall} from './multicall'

const TOKENINFO = 'TOKENINFO'
const UNKNOWN = 'UNKNOWN'

export function getTokensInfo (token:any, chainId:any, delay?:any) {
  return new Promise(resolve => {
    const callArr = [
      {
        target: token,
        call: ['name()(string)'],
        returns: [['name']]
      },
      {
        target: token,
        call: ['decimals()(uint8)'],
        returns: [['decimals']]
      },
      {
        target: token,
        call: ['symbol()(string)'],
        returns: [['symbol']]
      }
    ]
    if (delay) {
      setTimeout(() => {
        useMulticall(chainId, callArr).then((res:any) => {
          console.log(res)
          if (res.msg === 'Success') {
            resolve(res.info)
          } else {
            resolve({
              name: UNKNOWN,
              symbol: UNKNOWN,
              decimals: UNKNOWN,
            })
          }
        })
      }, 3000)
    } else {
      useMulticall(chainId, callArr).then((res:any) => {
        console.log(res)
        if (res.msg === 'Success') {
          resolve(res.info)
        } else {
          resolve({
            name: UNKNOWN,
            symbol: UNKNOWN,
            decimals: UNKNOWN,
          })
        }
      })
    }
  })
}


export default async function getTokenInfo (token:any, chainId:any, delay?:any):Promise<any> {
  const lData = getLocalConfig(TOKENINFO, token, chainId, TOKENINFO, 1000 * 60 * 60 * 24 * 1000, 1)
  // console.log(lData)
  if (lData
    && lData.data.name !== UNKNOWN
    && lData.data.symbol !== UNKNOWN
    && lData.data.decimals !== UNKNOWN
  ) {
    return lData.data
  }
  const data:any = await getTokensInfo(token, chainId, delay)
  if (data
    && data.name !== UNKNOWN
    && data.symbol !== UNKNOWN
    && data.decimals !== UNKNOWN
  ) {
    setLocalConfig(TOKENINFO, token, chainId, TOKENINFO, {data: data}, 1)
    return data
  }
  return getTokenInfo(token, chainId, 1)
}