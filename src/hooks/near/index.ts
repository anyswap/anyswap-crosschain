// import {
//   connect,
//   // Contract,
//   keyStores,
//   WalletConnection
// } from 'near-api-js'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {getConfig} from './config'
import { tryParseAmount3 } from '../../state/swap/hooks'
import { BigAmount } from '../../utils/formatBignumber'
import { useTransactionAdder } from '../../state/transactions/hooks'
import {recordsTxns} from '../../utils/bridge/register'
import {useTxnsDtilOpen} from '../../state/application/hooks'
// export enum WrapType {
//   NOT_APPLICABLE,
//   WRAP,
//   UNWRAP,
//   NOCONNECT
// }

const NOT_APPLICABLE = { }

const nearConfig:any = getConfig(process.env.NODE_ENV || 'development')
const contractId = nearConfig.contractName
// const wNearContractId = nearConfig.wNearContractId

export function useLogout() {
  const logout = useCallback(() => {
    if (window?.near) {
      window.near.disconnect()
    }
  }, [])
  return {
    logout
  }
}

export function useNearAddress () {
  return window?.near?.accountId
}

export function useLogin() {
  const [access, setAccess] = useState<any>({})
  const login = useCallback(async() => {
    if (window?.near) {
      try {
        const res = await window.near.requestSignIn({ contractId, methodNames: [] })
        if (!res.error) {
          if (res && res.accessKey) {
            setAccess(res.accessKey)
          } else {
            console.log('res: ', res)
          }
        }
      } catch (error) {
        console.log('error: ', error)
      }
    } else {
      alert('Please install Sender Wallet.')
    }
  }, [])

  return {
    login,
    access
  }
}

export function useNearBalance () {
  const getNearBalance = useCallback(async() => {
    let bl:any = ''
    try {
      bl = await window?.near?.account().getAccountBalance()
    } catch (error) {
      
    }
    // const res2 = await window.near.account().getAccountDetails()
    // console.log(res)
    // console.log(res)
    return bl
    // console.log(res2)
  }, [])

  const getNearTokenBalance = useCallback(async(contractId) => {
    let bl:any
    try {
      
      bl = await window?.near?.account().viewFunction(
        contractId,
        'storage_balance_of',
        { "account_id": window.near.accountId },
      )
    } catch (error) {
      
    }
    // const res1 = await window.near.account().getAccountBalance()
    // const res2 = await window.near.account().getAccountDetails()
    console.log(bl)
    return bl
    // console.log(res1)
    // console.log(res2)
  }, [])

  return {
    getNearBalance,
    getNearTokenBalance
  }
}

export function useSendNear () {
  const sendNear = useCallback(async(routerContractId, amount, bindaddr, selectchain) => {
    const res = window.near.signAndSendTransaction({
      receiverId: routerContractId,
      actions: [
        {
          methodName: 'swap_out_native',
          args: {
            "to": `${bindaddr}`,
            "to_chain_id": `${selectchain}`, 
          },
        }
      ],
      amount: amount
    })
    console.log(res)
    return {}
  }, [])

  const sendNearToken = useCallback(async(contractId, anyContractId, routerContractId, amount, bindaddr, selectchain) => {
    const res = await window.near.signAndSendTransaction({
      receiverId: contractId,
      actions: [
        {
          methodName: 'ft_tranfser_call',
          args: {
            'receiver_id': routerContractId,
            amount: amount,  // wNear decimals is 24
            msg: `any_swap_out ${anyContractId} ${bindaddr} ${selectchain}`
          },
        }
      ]
    })
    console.log(res)
    return {}
  }, [])
  return {
    sendNear,
    // sendWnear,
    sendNearToken
  }
}

// contractId, anyContractId, routerContractId, amount, bindaddr, selectchain
export function useNearSendTxns(
  routerToken:any,
  inputCurrency: any,
  anyContractId:any,
  contractId:any,
  typedValue:any,
  receiverId:any,
  chainId:any,
  selectChain:any,
  destConfig:any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const {sendNear, sendNearToken} = useSendNear()
  const { t } = useTranslation()
  const address = useNearAddress()
  const addTransaction = useTransactionAdder()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const [balance, setBalance] = useState<any>()
  const inputAmount = useMemo(() => tryParseAmount3(typedValue, inputCurrency?.decimals), [typedValue, inputCurrency])
  const {
    getNearBalance,
    getNearTokenBalance
  } = useNearBalance()

  useEffect(() => {
    if (inputCurrency?.tokenType === 'NATIVE') {
      getNearBalance().then(res => {
        if (res?.available) {
          setBalance(BigAmount.format(inputCurrency?.decimals,res?.available))
        } else {
          setBalance('')
        }
      })
    } else {
      getNearTokenBalance(contractId).then(res => {
        if (res?.available) {
          setBalance(BigAmount.format(inputCurrency?.decimals,res?.available))
        } else {
          setBalance('')
        }
      })
    }
  }, [inputCurrency, contractId])

  let sufficientBalance = false
  try {
    sufficientBalance = inputCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
  } catch (error) {
    console.log(error)
  }

  return useMemo(() => {
    console.log(receiverId)
    console.log(inputAmount)
    console.log(typedValue)
    if (!inputAmount || !receiverId || !selectChain || !routerToken || !anyContractId || !contractId || !chainId) return NOT_APPLICABLE
    return {
      // wrapType: WrapType.WRAP,
      balance,
      execute: async () => {
        const txReceipt:any = await inputCurrency?.tokenType === "NATIVE" ? sendNear(routerToken, inputAmount, receiverId, selectChain) : sendNearToken(contractId, anyContractId, routerToken, inputAmount, receiverId, selectChain)
        console.log(txReceipt)
        if (txReceipt?.hash) {
          const data:any = {
            hash: txReceipt.hash,
            chainId: chainId,
            selectChain: selectChain,
            account: address,
            value: inputAmount,
            formatvalue: typedValue,
            to: receiverId,
            symbol: inputCurrency?.symbol,
            version: destConfig.type,
            pairid: inputCurrency?.symbol,
          }
          addTransaction(txReceipt, {
            summary: `Cross bridge ${typedValue} ${inputCurrency?.symbol}`,
            value: typedValue,
            toChainId: selectChain,
            toAddress: receiverId.indexOf('0x') === 0 ? receiverId?.toLowerCase() : receiverId,
            symbol: inputCurrency?.symbol,
            version: 'swapin',
            routerToken: '',
            token: inputCurrency?.address,
            logoUrl: inputCurrency?.logoUrl,
            underlying: inputCurrency?.underlying
          })
          recordsTxns(data)
          onChangeViewDtil(txReceipt?.hash, true)
        }
      },
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [inputAmount, receiverId, selectChain, routerToken, anyContractId, contractId, chainId, inputCurrency])
}