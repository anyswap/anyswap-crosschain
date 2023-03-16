
import { useDispatch, useSelector } from 'react-redux'
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from 'react-i18next'
import {getWeb3} from '../../utils/tools/web3UtilsV2'
import config from '../../config'
import { ChainId } from "../../config/chainConfig/chainId"
import { AppState, AppDispatch } from '../../state'

import { BigAmount } from '../../utils/formatBignumber'
import { tryParseAmount3 } from '../../state/swap/hooks'
import {xlmAddress, balanceList} from './actions'

import {recordsTxns} from '../../utils/bridge/register'
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'

const StellarSdk = require('stellar-sdk')
const NOT_APPLICABLE = { }

export function formatXlmMemo (address:any, chainId:any) {
  if (!address || !chainId) return ''
  const web3 = getWeb3()
  const totalLength = 64

  const addressToBytes = web3.utils.hexToBytes(address)
  const addressBytesLength = addressToBytes.length
  const addressBytesStr = Buffer.from([addressBytesLength]).toString('hex')

  const addressHexStr = address.replace('0x', '')
  const addressLength = addressHexStr.length

  const chainIdToHex = web3.utils.numberToHex(chainId)
  const chainIdHexStr = chainIdToHex.replace('0x', '')
  const chainIdLength = chainIdHexStr.length

  const differLength = totalLength - addressLength - chainIdLength - addressBytesStr.length

  const zeroArr = []
  for (let i = 0; i < differLength; i++) {
    zeroArr.push(0)
  }
  const zreoStr = zeroArr.join('')
  return addressBytesStr + addressHexStr + zreoStr + chainIdHexStr
}

// function HexString2Bytes(str:any) {
//   var pos = 0;
//   var len = str.length;
//   if (len % 2 != 0) {
//     return null;
//   }
//   len /= 2;
//   var arrBytes = new Array();
//   for (var i = 0; i < len; i++) {
//     var s = str.substr(pos, 2);
//     var v = intToByte(parseInt(s, 16));
//     arrBytes.push(v);
//     pos += 2;
//   }
//   return arrBytes;
// }
// export function formatXlmMemo (address:any, chainId:any) {
//   if (!address || !chainId) return ''
//   const web3 = getWeb3()
//   const totalLength = 64

//   const addressToBytes = web3.utils.hexToBytes(address)
//   // const addressToBytes = Buffer.from(address)
//   const addressLength = addressToBytes.length

//   const chainIdToHex = web3.utils.numberToHex(chainId)
//   // console.log(chainIdToHex)
//   const chainIdToBytes = web3.utils.hexToBytes(chainIdToHex)
//   // const chainIdToBytes = Buffer.from(chainId + '')
//   const chainIdLength = chainIdToBytes.length
  
//   // console.log(chainIdToBytes)
//   // console.log(chainIdToBytes.toString('hex'))
//   console.log('addressLength', addressLength)
//   // console.log(chainIdLength)
//   const differLength = totalLength - 1 - addressLength - chainIdLength
//   const differLength1 = totalLength - 1 - addressLength
  
//   const zeroArr = []
//   for (let i = 0; i < differLength; i++) {
//     zeroArr.push(0)
//   }
//   const resultArr = [addressLength, ...addressToBytes, ...zeroArr, ...chainIdToBytes]
//   console.log('differLength1', differLength1)
//   console.log('differLength', differLength)
//   console.log(web3.utils.padLeft(chainIdToHex, differLength1 + chainIdLength))
//   console.log(Buffer.from([addressLength, ...addressToBytes]).toString('hex'))
//   // console.log(Buffer.from(resultArr).toString('hex'))
//   return Buffer.from(resultArr).toString('hex')
// }

// console.log(formatXlmMemo('0xC5107334A3Ae117E3DaD3570b419618C905Aa5eC', '5777'))
// console.log(formatXlmMemo('0xC03033d8b833fF7ca08BF2A58C9BC9d711257249', '2000'))

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
    return new Promise(resolve => {
      if (!isOpenXlmWallet) {
        isOpenXlmWallet = 1
        if (window?.freighterApi?.isConnected()) {
          window?.freighterApi?.getPublicKey().then((res:any) => {
            // console.log(res)
            dispatch(xlmAddress({address: res}))
            isOpenXlmWallet = 0
            resolve(res)
          }).catch(() => {
            isOpenXlmWallet = 0
            resolve('')
          })
        } else {
          // setAddress('')
          if (confirm('Please install Freighter Wallet.') === true) {
            window.open('https://chrome.google.com/webstore/detail/freighter/bcacfldlkkdogcmkkibnjlakofdplcbk')
          }
          isOpenXlmWallet = 0
          resolve('')
        }
      }
    })
  }, [isOpenXlmWallet])
  
  return {
    loginXlm,
    xlmAddress: account
  }
}

export function useXlmBalance () {
  const {xlmAddress} = connectXlmWallet()
  const dispatch = useDispatch<AppDispatch>()
  const balanceListResult:any = useSelector<AppState, AppState['xlm']>(state => state.xlm.balanceList)
  const TimeKey = 'timestamp'
  const getAllBalance = useCallback((chainId:any, account?:any) => {
    return new Promise(resolve => {
      const useAccount = account ? account : xlmAddress
      if ([ChainId.XLM, ChainId.XLM_TEST].includes(chainId) && useAccount) {
        // console.log(useAccount)
        if (balanceListResult && balanceListResult[TimeKey] && Date.now() - balanceListResult[TimeKey] < 5000) {
          resolve(balanceListResult)
        } else {
          const url = `${config.chainInfo[chainId].nodeRpc}/accounts/${useAccount}`
          fetch(url).then(res => res.json()).then(json => {
            // console.log(json)
            const res = json
            const list:any = {[TimeKey]: Date.now()}
            for (const obj of res.balances) {
              let token = obj.asset_code + '/' + obj.asset_issuer
              if (obj.asset_type === 'native') {
                token = 'native'
              } else if (obj.asset_code && obj.asset_issuer) {
                token = obj.asset_code + '/' + obj.asset_issuer
              }
              list[token] = {
                balance: obj.balance,
                limit: obj.limit
              }
            }
            // console.log(list)
            dispatch(balanceList({list}))
            resolve(list)
          }).catch((err) => {
            console.log(err)
            resolve('')
          })
        }
      } else {
        resolve('')
      }
    })
  }, [xlmAddress, balanceListResult])

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

export function useTrustlines() {
  const {loginXlm} = connectXlmWallet()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  
  const setTrustlines = useCallback(async(chainId, receiveAddress, typedValue, destConfig) => {
    try {
      const url = config.chainInfo[chainId].nodeRpc
      console.log(url)
      console.log(receiveAddress)
      console.log(typedValue)
      const xlmAddress = await loginXlm()
      if (xlmAddress) {
        console.log(xlmAddress)
        const server = new StellarSdk.Server(url)
        console.log(server)
        const account = await server.loadAccount(xlmAddress)
        console.log(account)
        const fee = await server.fetchBaseFee();
        const network = await window.freighterApi.getNetwork()
        const tokenArr = destConfig.address.split('/')
        const asset = new StellarSdk.Asset(tokenArr[0], tokenArr[1])
        
        const transaction = new StellarSdk.TransactionBuilder(account, { fee, networkPassphrase: chainId === ChainId.XLM ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET })
        .addOperation(StellarSdk.Operation.changeTrust({
          // asset: StellarSdk.Asset.native(),
          // destination: receiveAddress,
          asset: asset,
          amount: typedValue
        }))
        .setTimeout(30)
        .build();
        console.log(transaction)
        console.log(transaction.toXDR())
        const signedTransaction = await window.freighterApi.signTransaction(
          transaction.toXDR(),
          network,
        )
        console.log(signedTransaction)
        // const transaction = new Transaction(transactionXDR, networkPassphrase)
        const tx = StellarSdk.TransactionBuilder.fromXDR(signedTransaction, chainId === ChainId.XLM ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET)
        const txReceipt = await server.submitTransaction(tx);
        alert('Set Trustlines Success, hash: ' + txReceipt?.hash)
      } else {
        alert('Set Trustlines Error, please set trustlines in your wallet.')
      }
    } catch (error) {
      console.error(error);
      onChangeViewErrorTip('Txns failure.', true)
    }
  }, [])

  return {
    setTrustlines
  }
}

export function useXlmCrossChain (
  chainId:any,
  selectCurrency:any,
  selectChain:any,
  receiveAddress:any,
  receiveXlmAddress:any,
  typedValue:any,
  destConfig:any,
  useToChainId:any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const { t } = useTranslation()
  const {xlmAddress} = connectXlmWallet()
  const url = [ChainId.XLM, ChainId.XLM_TEST].includes(chainId) ? config.chainInfo[chainId].nodeRpc : ''
  const server = url ? new StellarSdk.Server(url) : ''
  const {getAllBalance} = useXlmBalance()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const addTransaction = useTransactionAdder()

  const [balance, setBalance] = useState<any>()

  useEffect(() => {
    getAllBalance(chainId, xlmAddress).then((res:any) => {
      // console.log(res)
      const token = selectCurrency?.address
      const dec = selectCurrency?.decimals
      // console.log(token)
      // console.log(res?.[token]?.balance)
      if (res?.[token]?.balance) {
        const blvalue = tryParseAmount3(res?.[token]?.balance, dec)
        const bl = res ? BigAmount.format(dec, blvalue) : undefined
        setBalance(bl)
      } else {
        setBalance(0)
      }
    })
  }, [selectCurrency, xlmAddress, chainId])
  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [typedValue, selectCurrency])

  let sufficientBalance = false
  try {
    // sufficientBalance = true
    sufficientBalance = selectCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
  } catch (error) {
    console.log(error)
  }
  // const receiveAddress = '0xC03033d8b833fF7ca08BF2A58C9BC9d711257249'
  // const receiveXlmAddress = 'GC2YB64P5VXJQATUZN7UJOEINHROOIRJLYW3F6Q3AARZJ55UVGHUZRSL'
  return useMemo(() => {
    if (!xlmAddress || !chainId || !selectCurrency || !receiveXlmAddress || !server || !useToChainId) return NOT_APPLICABLE
    return {
      balance,
      execute: async () => {
        try {
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
          const memo = formatXlmMemo(receiveAddress, useToChainId)
          console.log(memo)
          const transaction = new StellarSdk.TransactionBuilder(account, { fee, networkPassphrase: chainId === ChainId.XLM ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET })
          .addOperation(
              // this operation funds the new account with XLM
              StellarSdk.Operation.payment({
                  destination: receiveXlmAddress,
                  asset: asset,
                  amount: typedValue
              })
          )
          .setTimeout(30)
          .addMemo(StellarSdk.Memo.hash(memo))
          .build();
          console.log(transaction)
          console.log(transaction.toXDR())
          // console.log(window.freighterApi)
          // console.log(network)
          const signedTransaction = await window.freighterApi.signTransaction(
          // const signedTransaction = await signTransaction(
            transaction.toXDR(),
            network,
          )
          console.log(signedTransaction)
          // const transaction = new Transaction(transactionXDR, networkPassphrase)
          const tx = StellarSdk.TransactionBuilder.fromXDR(signedTransaction, chainId === ChainId.XLM ? StellarSdk.Networks.PUBLIC : StellarSdk.Networks.TESTNET)
        
          const txReceipt = await server.submitTransaction(tx);
          console.log(txReceipt);

          if (txReceipt?.hash) {
            const data:any = {
              hash: txReceipt.hash,
              chainId: chainId,
              selectChain: selectChain,
              account: xlmAddress,
              value: inputAmount,
              formatvalue: typedValue,
              to: receiveAddress,
              symbol: selectCurrency?.symbol,
              version: destConfig.type,
              pairid: selectCurrency?.symbol,
              routerToken: receiveXlmAddress
            }
            addTransaction(txReceipt, {
              summary: `Cross bridge ${typedValue} ${selectCurrency?.symbol}`,
              value: typedValue,
              toChainId: selectChain,
              toAddress: receiveAddress.indexOf('0x') === 0 ? receiveAddress?.toLowerCase() : receiveAddress,
              symbol: selectCurrency?.symbol,
              version: 'swapin',
              routerToken: receiveXlmAddress,
              token: selectCurrency?.address,
              logoUrl: selectCurrency?.logoUrl,
              isLiquidity: destConfig?.isLiquidity,
              fromInfo: {
                symbol: selectCurrency?.symbol,
                name: selectCurrency?.name,
                decimals: selectCurrency?.decimals,
                address: selectCurrency?.address,
              },
              toInfo: {
                symbol: destConfig?.symbol,
                name: destConfig?.name,
                decimals: destConfig?.decimals,
                address: destConfig?.address,
              },
            })
            recordsTxns(data)
            onChangeViewDtil(txReceipt?.hash, true)
          }
        } catch (err) {
          console.error(err);
          onChangeViewErrorTip('Txns failure.', true)
        }
      },
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: selectCurrency?.symbol})
    }
  }, [xlmAddress, chainId, selectCurrency, selectChain, balance, receiveAddress, receiveXlmAddress, typedValue, destConfig, server, useToChainId])
}