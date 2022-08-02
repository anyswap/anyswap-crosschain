
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useMemo } from "react"
import {getWeb3} from '../../utils/tools/web3UtilsV2'
import config from '../../config'
import { ChainId } from "../../config/chainConfig/chainId"
import { AppState, AppDispatch } from '../../state'

import {xlmAddress} from './actions'

const StellarSdk = require('stellar-sdk')
const NOT_APPLICABLE = { }

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
      if (window?.freighterApi?.isConnected()) {
        window?.freighterApi?.getPublicKey().then((res:any) => {
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
  }, [isOpenXlmWallet])
  
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
        // console.log(useAccount)
        const url = `${config.chainInfo[chainId].nodeRpc}/accounts/${useAccount}`
        fetch(url).then(res => res.json()).then(json => {
          // console.log(json)
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

export function useXlmCrossChain (
  chainId:any,
  selectCurrency:any,
  selectChain:any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const {xlmAddress} = connectXlmWallet()
  const url = config.chainInfo[chainId].nodeRpc
  const server = new StellarSdk.Server(url)
  const receiveAddress = '0xC03033d8b833fF7ca08BF2A58C9BC9d711257249'
  const receiveXlmAddress = 'GC2YB64P5VXJQATUZN7UJOEINHROOIRJLYW3F6Q3AARZJ55UVGHUZRSL'
  return useMemo(() => {
    if (!xlmAddress || !chainId || !selectCurrency) return NOT_APPLICABLE
    return {
      execute: async () => {
        const account = await server.loadAccount(xlmAddress)
        console.log(account)
        const fee = await server.fetchBaseFee();
        const network = await window.freighterApi.getNetwork()
        console.log(fee)
        let asset = StellarSdk.Asset.native()
        if (selectCurrency.tokenType === 'NATIVE' || selectCurrency.address === 'native') {
          asset = StellarSdk.Asset.native()
        } else {
          const tokenArr = selectCurrency.address.split('/')
          asset = new StellarSdk.Asset(tokenArr[0], tokenArr[1])
        }
        console.log(asset)
        const memo = formatXlmMemo(receiveAddress, selectChain)
        console.log(memo)
        const transaction = new StellarSdk.TransactionBuilder(account, { fee, networkPassphrase: StellarSdk.Networks.TESTNET })
        .addOperation(
            // this operation funds the new account with XLM
            StellarSdk.Operation.payment({
                destination: receiveXlmAddress,
                asset: asset,
                amount: "2"
            })
        )
        .setTimeout(30)
        .addMemo(StellarSdk.Memo.hash(memo))
        .build();
        console.log(transaction)
        console.log(transaction.toXDR())
        console.log(window.freighterApi)
        console.log(network)
        const signedTransaction = await window.freighterApi.signTransaction(
        // const signedTransaction = await signTransaction(
          transaction.toXDR(),
          network,
        )
        console.log(signedTransaction)
        // const transaction = new Transaction(transactionXDR, networkPassphrase)
        const tx = StellarSdk.TransactionBuilder.fromXDR(signedTransaction, StellarSdk.Networks.TESTNET)
        try {
          const transactionResult = await server.submitTransaction(tx);
          console.log(transactionResult);
        } catch (err) {
          console.error(err);
        }
      }
    }
  }, [xlmAddress, chainId, selectCurrency, selectChain])
}