import { getUrlData, postUrlData } from '../tools/axios'
import { USE_VERSION, timeout } from '../../config/constant'
import { getLocalConfig } from '../tools/tools'
import { CROSSCHAINBRIDGE } from './type'

export function registerSwap(hash: string, chainId: any, apiAddress: string) {
  return new Promise((resolve, reject) => {
    console.log(`Swap > chain id: ${chainId}; hash: ${hash}`)

    const url = `${apiAddress}/swap/register/${chainId}/${hash}`

    postUrlData(url, {
      logindex: 0
    })
      .then((res: any) => {
        console.log('Router response: ', res)
        resolve(res)
      })
      .catch(error => {
        console.error('Router error: ', error)
        reject(error)
      })
  })
}

interface RecordsTxnsProp {
  api: string
  hash: string
  chainId: any
  selectChain: any
  account: string | null | undefined
  value: string
  formatvalue: string
  to: string
  symbol: string | undefined
  version?: string | undefined
  pairid?: string | undefined
  routerToken?: string | undefined
}
const registerList: any = {}

export function recordsTxns({
  api,
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
  return new Promise(async resolve => {
    const url = `${api}/v3/records`
    const useVersion = version || USE_VERSION
    const ip: any = await getUrlData('https://api.ipify.org/?format=json')
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
      userIP: window?.returnCitySN ? window?.returnCitySN : ip?.data?.ip ? { cip: ip?.data?.ip } : ''
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
    postUrlData(url, data).then((res: any) => {
      console.log(res)
      if (res.msg === 'Success' || res.data === 'Error') {
        registerList[hash].isRegister = 1
      } else {
        if (Date.now() - registerList[hash].timestamp <= 3000) {
          setTimeout(() => {
            recordsTxns({ api, ...registerList[hash] })
          }, 1000)
        }
      }
      resolve(res)
    })
  })
}

const approveList: any = {}
export function recordsApprove({
  api,
  token,
  spender,
  account,
  amount,
  symbol,
  decimals,
  hash,
  chainId,
  type
}: {
  api: string
  token: any
  spender: any
  account: any
  amount: any
  symbol: any
  decimals: any
  hash: any
  chainId: any
  type: any
}) {
  console.log('>>> call utils/bridge -> approve')
  return new Promise(async resolve => {
    const url = `${api}/v3/records/approved`
    const data = {
      token,
      spender,
      account,
      amount,
      symbol,
      decimals,
      hash,
      chainId,
      type
    }
    console.log('>>> approve data', data)
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
    postUrlData(url, data).then((res: any) => {
      console.log(res)
      if (res.msg === 'Success' || res.data === 'Error') {
        approveList[hash].isRegister = 1
      } else {
        if (Date.now() - approveList[hash].timestamp <= 3000) {
          setTimeout(() => {
            recordsApprove({ api, ...approveList[hash] })
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
//   hash: 'ceac140bff1f9d1da04e7ec94ebcef83a8d868ed527149b3a6e842e65a5e5fb4',
//   chainId: 'TERRA',
//   selectChain: '250',
//   account: 'terra19vq4dqkmehun49nr5jmrmrswq476ehgdln4aws',
//   value: '50000000',
//   formatvalue: '50',
//   to: '0xC03033d8b833fF7ca08BF2A58C9BC9d711257249',
//   symbol: 'USD',
//   version: 'swapin',
//   pairid: 'USTv5',
//   routerToken: ''
// })

export function getP2PInfo({
  api,
  account,
  chainId,
  symbol,
  token
}: {
  api: string
  account: any
  chainId: any
  symbol: string
  token: any
}) {
  console.log('>>>> getP2PInfo')
  return new Promise(resolve => {
    const lData = getLocalConfig(account, token, chainId, CROSSCHAINBRIDGE, timeout, undefined)

    if (lData) {
      resolve({ p2pAddress: lData.p2pAddress })
    } else {
      const url = `${api}/v2/register/${account}/${chainId}/${symbol}`

      getUrlData(url).then((res: any) => {
        if (res.msg === 'Success') {
          resolve({ p2pAddress: res?.data?.P2shAddress ?? res?.data?.info?.P2shAddress })
        } else {
          resolve('')
        }
      })
    }
  })
}
