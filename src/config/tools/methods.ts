import { chainInfo } from '../chainConfig'
import {
  ENV_NODE_CONFIG
} from '../constant'

export function selectNetwork (chainID:any, type?: any) {
  return new Promise(resolve => {
    const { ethereum } = window
    const ethereumFN:any = {
      request: '',
      ...ethereum
    }
    window.localStorage.setItem(ENV_NODE_CONFIG, chainInfo[chainID].label)
    if (ethereumFN && ethereumFN.request) {
      // console.log(ethereumFN)
      // console.log(ethereumFN.chainId)
      const data = {
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: '0x' + Number(chainID).toString(16), // A 0x-prefixed hexadecimal string
            chainName: chainInfo[chainID].networkName,
            nativeCurrency: {
              name: chainInfo[chainID].name,
              symbol: chainInfo[chainID].symbol, // 2-6 characters long
              decimals: 18,
            },
            rpcUrls: [chainInfo[chainID].nodeRpc],
            blockExplorerUrls: chainInfo[chainID].explorer ? [chainInfo[chainID].explorer] : [],
            iconUrls: null // Currently ignored.
          }
        ],
      }
      // console.log(data)
      ethereumFN.request(data).then((res: any) => {
        // console.log(chainID)
        console.log(res)
        if (!type) {
          history.go(0)
        }
        resolve({
          msg: 'Success'
        })
      }).catch((err: any) => {
        console.log(err)
        resolve({
          msg: 'Error'
        })
      })
    } else {
      resolve({
        msg: 'Error'
      })
    }
  })
}

export function addToken (address:string, symbol: string, decimals: number, logoUrl?:string) {
  return new Promise(resolve => {
    const { ethereum } = window
    const ethereumFN:any = {
      request: '',
      ...ethereum
    }
    if (ethereumFN && ethereumFN.request) {
      const params = {
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // 最初只支持ERC20，但最终支持更多
          options: {
            address: address, // 令牌所在的地址。
            symbol: symbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: decimals, // The number of decimals in the token
            image: logoUrl, // A string url of the token logo
          },
        },
      }
      // console.log(params)
      ethereumFN.request(params).then((res: any) => {
        console.log(res)
        resolve({
          msg: 'Success'
        })
      }).catch((err: any) => {
        console.log(err)
        resolve({
          msg: 'Error'
        })
      })
    } else {
      resolve({
        msg: 'Error'
      })
    }
  })
}