import {
  isConnected,
  getPublicKey,
  // signTransaction,
} from "@stellar/freighter-api"
import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from "react"
import {getWeb3} from '../../utils/tools/web3UtilsV2'
import config from '../../config'
import { ChainId } from "../../config/chainConfig/chainId"
import { AppState, AppDispatch } from '../../state'

import {xlmAddress} from './actions'

export function formatXlmMemo (address:any, chainId:any) {
  if (!address || !chainId) return ''
  const web3 = getWeb3()
  const totalLength = 32

  const addressToBytes = web3.utils.hexToBytes(address)
  // const addressToBytes = Buffer.from(address)
  const addressLength = addressToBytes.length

  const chainIdToHex = web3.utils.numberToHex(chainId)
  // console.log(chainIdToHex)
  const chainIdToBytes = web3.utils.hexToBytes(chainIdToHex)
  // const chainIdToBytes = Buffer.from(chainId + '')
  const chainIdLength = chainIdToBytes.length

  const differLength = totalLength - 1 - addressLength - chainIdLength

  const zeroArr = []
  for (let i = 0; i < differLength; i++) {
    zeroArr.push(0)
  }
  const resultArr = [addressLength, ...addressToBytes, ...zeroArr, ...chainIdToBytes]
  // console.log(resultArr)
  // console.log(Buffer.from(resultArr).toString('hex'))
  return Buffer.from(resultArr).toString('hex')
}

let isOpenXlmWallet = 0

export function useXlmAddress () {
  const account:any = useSelector<AppState, AppState['xlm']>(state => state.xlm.xlmAddress)
  // console.log(account)
  return account
}

export function connectXlmWallet () {
  const dispatch = useDispatch<AppDispatch>()
  const account:any = useSelector<AppState, AppState['xlm']>(state => state.xlm.xlmAddress)
  
  const loginXlm = useCallback(() => {
    if (!isOpenXlmWallet) {
      isOpenXlmWallet = 1
      if (isConnected()) {
        getPublicKey().then((res:any) => {
          // console.log(res)
          dispatch(xlmAddress({address: res}))
          isOpenXlmWallet = 0
        }).catch(() => {
          isOpenXlmWallet = 0
        })
      } else {
        // setAddress('')
        if (confirm('Please install Freighter Wallet.') === true) {
          window.open('https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk')
        }
        isOpenXlmWallet = 0
      }
    }
  }, [isConnected, isOpenXlmWallet])
  
  return {
    loginXlm,
    xlmAddress: account
  }
}

export function useXlmBalance () {
  const {xlmAddress} = connectXlmWallet()

  const getAllBalance = useCallback((chainId:any, account?:any) => {
    return new Promise(resolve => {
      const useAccount = account ? account : xlmAddress
      if ([ChainId.XLM, ChainId.XLM_TEST].includes(chainId) && useAccount) {
        console.log(useAccount)
        const url = `${config.chainInfo[chainId].nodeRpc}/accounts/${useAccount}`
        fetch(url).then(res => res.json()).then(json => {
          console.log(json)
          resolve(json)
        }).catch((err) => {
          console.log(err)
          resolve('')
        })
      } else {
        resolve('')
      }
    })
  }, [xlmAddress])

  return {
    getAllBalance
  }
}


export function updateXlmHash (hash:any, chainId:any) {
  const data:any = {
    msg: 'Error',
    info: ''
  }
  return new Promise(resolve => {
    // const url = 'https://rpc.testnet.near.org'
    const url = config.chainInfo[chainId].nodeRpc
    fetch(`${url}/transactions/${hash}`).then(res => res.json()).then(json => {
      // console.log(json)
      if (json) {
        if (json.successful) {
          data.msg = 'Success'
          data.info = json
        } else {
          data.msg = 'Failure'
          data.error = 'Txns is failure!'
        }
      } else {
        data.msg = 'Null'
        data.error = 'Query is empty!'
      }
      resolve(data)
    }).catch(err => {
      console.log(err.toString())
      data.error = 'Query is empty!'
      resolve(data)
    })
  })
}