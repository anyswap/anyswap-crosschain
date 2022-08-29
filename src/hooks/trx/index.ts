import { useCallback, useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
// import useInterval from "../useInterval"
import { AppState, AppDispatch } from '../../state'
import { trxAddress } from './actions'
import { useActiveReact } from '../useActiveReact'

import { tryParseAmount3 } from '../../state/swap/hooks'
import { ChainId } from "../../config/chainConfig/chainId"


import {recordsTxns} from '../../utils/bridge/register'
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { BigAmount } from "../../utils/formatBignumber"
// const tronweb = window.tronWeb

export function toHexAddress (address:string) {
  const str = window?.tronWeb?.address?.toHex(address).toLowerCase()
  return '0x' + str.substr(2)
}

export function fromHexAddress (address:string) {
  return '41' + address.substr(2)
}

export function isTRXAddress (address:string) {
  if (address.indexOf('0x') === 0) {
    address = address.replace('0x', '41')
  }
  return window?.tronWeb?.isAddress(address)
}

export function formatTRXAddress (address:string) {
  if (address.indexOf('0x') === 0) {
    address = address.replace('0x', '41')
    address = window?.tronWeb?.address.fromHex(address)
  }
  return address
}

export function useTrxAddress () {
  const account:any = useSelector<AppState, AppState['trx']>(state => state.trx.trxAddress)
  // console.log(window?.tronWeb?.isConnected())
  return {
    // trxAddress: account ? toHexAddress(account) : ''
    trxAddress: account
  }
}

export function useLoginTrx () {
  const dispatch = useDispatch<AppDispatch>()
  const loginTrx = useCallback(() => {
    if (window.tronWeb) {
      if (window?.tronWeb?.address && window.tronWeb.defaultAddress.base58) {
        dispatch(trxAddress({address: window.tronWeb.defaultAddress.base58}))
      } else {
        history.go(0)
      }
    }
  }, [])
  return {
    loginTrx
  }
}

// export function useContract () {
//   let contract = await window?.tronWeb?.contract().at(trc20ContractAddress)
// }

export async function sendTRXTxns ({
  account,
  toAddress,
  amount,
  symbol,
  tokenID
}: {
  account: string,
  toAddress: string,
  amount: string,
  symbol: string,
  tokenID: string
}) {
  // console.log(tronweb)
  if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
    const TRXAccount = window?.tronWeb?.defaultAddress.base58
    const curTRXAccount = toHexAddress(TRXAccount)
    if (curTRXAccount === account.toLowerCase()) {
      let tx:any = ''
      /* eslint-disable */
      try {
        if (symbol === 'TRX') {
          tx = await window?.tronWeb?.transactionBuilder.sendTrx(toAddress, amount, TRXAccount)
          // console.log(tx)
        } else {
          const parameter1 = [{type:'address',value: toAddress},{type:'uint256',value: amount}]
          tx = await window?.tronWeb?.transactionBuilder.triggerSmartContract(tokenID, "transfer(address,uint256)", {}, parameter1, TRXAccount)
          tx = tx.transaction
        }
        const signedTx = await window?.tronWeb?.trx.sign(tx)
        const broastTx = await window?.tronWeb?.trx.sendRawTransaction(signedTx)
        return {
          msg: 'Success',
          info: broastTx
        }
      } catch (error) {
        console.log(error)
        return {
          msg: 'Error',
          // error: error?.toString()
          error: error
        }
      }
      /* eslint-enable */
    } else {
      return {
        msg: 'Error',
        error: 'Account verification failed!'
      }
    }
  } else {
    return {
      msg: 'Error',
      error: 'Not Supported!'
    }
  }
}

export function useTrxBalance () {
  const TRXAccount = window?.tronWeb?.defaultAddress?.base58
  const getTrxBalance = useCallback(({account}) => {
    return new Promise((resolve) => {
      const useAccount = account ? account : TRXAccount
      if (window.tronWeb && window.tronWeb.defaultAddress.base58 && useAccount) {
        window?.tronWeb?.trx.getBalance(useAccount).then((res:any) => {
          console.log(res)
          resolve(res)
        })
      } else {
        resolve('')
      }
    })
  }, [TRXAccount]) 

  const getTrxTokenBalance = useCallback(({account, token}) => {
    return new Promise((resolve) => {
      const useAccount = account ? account : TRXAccount
      const parameter1 = [{type:'address',value: useAccount}]
      const tokenID = token
      if (window.tronWeb && window.tronWeb.defaultAddress.base58 && useAccount && tokenID) {
        window?.tronWeb?.transactionBuilder.triggerSmartContract(tokenID, "balanceOf(address)", {}, parameter1, useAccount).then((res:any) => {
          console.log(res)
          resolve(res)
        })
      } else {
        resolve('')
      }
    })
  }, [TRXAccount])

  return {
    getTrxBalance,
    getTrxTokenBalance
  }
}

// export function getTRXBalance (account:any, token:any) {
//   if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
//     const curAccount = fromHexAddress(account)
//     const TRXAccount = tronweb.defaultAddress.base58

//     if (token === 'TRX') {
//       tronweb.trx.getBalance(curAccount).then((res:any) => {
//         console.log(res)
//       })
//     } else {
//       const parameter1 = [{type:'address',value: curAccount}]
//       const tokenID = token
//       tronweb.transactionBuilder.triggerSmartContract(tokenID, "balanceOf(address)", {}, parameter1, TRXAccount).then((res:any) => {
//         console.log(res)
//         // const bl = res.constant_result[0]
//         // setLocalOutBalance(TRX_MAIN_CHAINID, account, token, {balance: '0x' + bl.toString()})
//       })
//     }
//   }
// }

export function getTRXTxnsStatus (txid:string) {
  return new Promise(resolve => {
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      window?.tronWeb?.trx.getTransaction(txid).then((res:any) => {
        console.log(res)
        if (res.ret) {
          resolve({
            status: true
          })
        } else {
          resolve({
            status: false
          })
        }
      })
    } else {
      resolve({
        status: false
      })
    }
  })
}

export function useTrxCrossChain (
  routerToken: any,
  inputToken: any,
  chainId:any,
  selectCurrency:any,
  selectChain:any,
  receiveAddress:any,
  typedValue:any,
  destConfig:any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const {account} = useActiveReact()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const addTransaction = useTransactionAdder()

  const [balance, setBalance] = useState<any>()

  const {getTrxBalance, getTrxTokenBalance} = useTrxBalance()

  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [typedValue, selectCurrency])

  useEffect(() => {
    if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId) && selectCurrency?.address) {
      const dec = selectCurrency?.decimals
      if (selectCurrency?.tokenType === 'NATIVE') {
        getTrxBalance({}).then((res:any) => {
          console.log(res)
          setBalance('')
        })
      } else {
        const token = fromHexAddress(selectCurrency.address)
        console.log(token)
        getTrxTokenBalance({token: token}).then((res:any) => {
          console.log(res)
          if (res?.constant_result) {
            const bl = '0x' + res?.constant_result[0]
            // console.log(BigAmount.format(dec, bl))
            setBalance(BigAmount.format(dec, bl))
          } else {
            setBalance('')
          }
        })
      }
    }
  }, [selectCurrency, chainId])

  return useMemo(() => {
    if (!account || ![ChainId.TRX, ChainId.TRX_TEST].includes(chainId) || !routerToken) return {}
    return {
      balance: balance,
      execute: async () => {
        // let contract = await window?.tronWeb?.contract()
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
          const TRXAccount = window?.tronWeb?.defaultAddress.base58
          // const curTRXAccount = toHexAddress(TRXAccount)
          // const formatRouterToken = toHexAddress(routerToken)
          const formatRouterToken = routerToken
          // console.log(TRXAccount)
          // console.log(account)
          if (TRXAccount.toLowerCase() === account.toLowerCase()) {
            let tx:any = ''
            try {
              if (destConfig.routerABI.indexOf('anySwapOutNative') !== -1) { // anySwapOutNative
                if (isNaN(selectChain)) {
                  const parameter1 = [{type:'address',value: inputToken},{type:'string',value: receiveAddress},{type:'uint256',value: selectChain}]
                  tx = await window?.tronWeb?.transactionBuilder.triggerSmartContract(formatRouterToken, "anySwapOutNative(address, string, uint256)", {}, parameter1, TRXAccount)
                } else {
                  const parameter1 = [{type:'address',value: inputToken},{type:'address',value: receiveAddress},{type:'uint256',value: selectChain}]
                  tx = await window?.tronWeb?.transactionBuilder.triggerSmartContract(formatRouterToken, "anySwapOutNative(address, address, uint256)", {}, parameter1, TRXAccount)
                }
              } else if (destConfig.routerABI.indexOf('anySwapOutUnderlying') !== -1) { // anySwapOutUnderlying
                if (isNaN(selectChain)) {
                  const parameter1 = [{type:'address',value: inputToken},{type:'string',value: receiveAddress},{type:'uint256',value: inputAmount},{type:'uint256',value: selectChain}]
                  tx = await window?.tronWeb?.transactionBuilder.triggerSmartContract(formatRouterToken, "anySwapOutUnderlying(address, string, uint256, uint256)", {}, parameter1, TRXAccount)
                } else {
                  const parameter1 = [{type:'address',value: inputToken},{type:'string',value: receiveAddress},{type:'uint256',value: inputAmount},{type:'uint256',value: selectChain}]
                  console.log(parameter1)
                  console.log(formatRouterToken)
                  tx = await window?.tronWeb?.transactionBuilder.triggerSmartContract(formatRouterToken, "anySwapOutUnderlying(address, string, uint256, uint256)", {}, parameter1, TRXAccount)
                }
              } else if (destConfig.routerABI.indexOf('anySwapOut') !== -1) { // anySwapOut
                if (isNaN(selectChain)) {
                  const parameter1 = [{type:'address',value: selectCurrency.address},{type:'string',value: receiveAddress},{type:'uint256',value: inputAmount},{type:'uint256',value: selectChain}]
                  tx = await window?.tronWeb?.transactionBuilder.triggerSmartContract(formatRouterToken, "anySwapOut(address, string, uint256, uint256)", {}, parameter1, TRXAccount)
                } else {
                  const parameter1 = [{type:'address',value: selectCurrency.address},{type:'address',value: receiveAddress},{type:'uint256',value: inputAmount},{type:'uint256',value: selectChain}]
                  tx = await window?.tronWeb?.transactionBuilder.triggerSmartContract(formatRouterToken, "anySwapOut(address, address, uint256, uint256)", {}, parameter1, TRXAccount)
                }
              }
              tx = tx.transaction
              const signedTx = await window?.tronWeb?.trx.sign(tx)
              const txReceipt = await window?.tronWeb?.trx.sendRawTransaction(signedTx)
              if (txReceipt?.hash) {
                const data:any = {
                  hash: txReceipt.hash,
                  chainId: chainId,
                  selectChain: selectChain,
                  account: TRXAccount,
                  value: inputAmount,
                  formatvalue: typedValue,
                  to: receiveAddress,
                  symbol: selectCurrency?.symbol,
                  version: destConfig.type,
                  pairid: selectCurrency?.symbol,
                  routerToken: routerToken
                }
                addTransaction(txReceipt, {
                  summary: `Cross bridge ${typedValue} ${selectCurrency?.symbol}`,
                  value: typedValue,
                  toChainId: selectChain,
                  toAddress: receiveAddress.indexOf('0x') === 0 ? receiveAddress?.toLowerCase() : receiveAddress,
                  symbol: selectCurrency?.symbol,
                  version: 'swapin',
                  routerToken: routerToken,
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
            } catch (error) {
              console.log(error);
              console.error(error);
              onChangeViewErrorTip('Txns failure.', true)
            }
          }
        } else {
          onChangeViewErrorTip('Please install TronLink.', true)
        }
      }
    }
  }, [receiveAddress, account, selectCurrency, inputAmount, chainId, routerToken, selectChain, destConfig, inputToken, balance])
}

