// import {
//   connect,
//   // Contract,
//   keyStores,
//   WalletConnection
// } from 'near-api-js'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'
// import {getConfig} from './config'
import { tryParseAmount3 } from '../../state/swap/hooks'
import { BigAmount } from '../../utils/formatBignumber'
import { useTransactionAdder } from '../../state/transactions/hooks'
import {recordsTxns} from '../../utils/bridge/register'
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
import useInterval from '../useInterval'
// export enum WrapType {
//   NOT_APPLICABLE,
//   WRAP,
//   UNWRAP,
//   NOCONNECT
// }

const NOT_APPLICABLE = { }

// const nearConfig:any = getConfig(process.env.NODE_ENV || 'development')
const contractId = 'bridge-1.crossdemo.testnet'

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
    // console.log(bl)
    return bl
    // console.log(res2)
  }, [])

  const getNearTokenBalance = useCallback(async(contractId) => {
    let bl:any
    try {
      
      bl = await window?.near?.account().viewFunction(
        contractId,
        'ft_balance_of',
        { "account_id": window.near.accountId },
      )
    } catch (error) {
      
    }
    // const res1 = await window.near.account().getAccountBalance()
    // const res2 = await window.near.account().getAccountDetails()
    // console.log(contractId)
    // console.log(bl)
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
    return new Promise((resolve, reject) => {
      console.log('sendNear')
      const actions = {
        receiverId: routerContractId,
        actions: [
          {
            methodName: 'swap_out_native',
            args: {
              "to": `${bindaddr}`,
              "to_chain_id": `${selectchain}`, 
            },
            gas: '300000000000000',
            // deposit: '1'
            deposit: amount
          }
        ],
        // amount: amount
      }
      console.log(actions)
      // let res:any
      let tx:any = {}
      window.near.signAndSendTransaction(actions).then((res:any) => {
        console.log(res)
        if (res?.response && !res?.response.error && res?.response.length > 0) {
          tx = res?.response[0]?.transaction
          resolve(tx)
        } else {
          reject(res?.response?.error)
        }
      }).catch((error:any) => {
        reject(error)
      })
    })
  }, [])

  const sendNearToken = useCallback(async(contractId, anyContractId, routerContractId, amount, bindaddr, selectchain) => {
    return new Promise((resolve, reject) => {
      console.log('sendNearToken')
      const actions = {
        receiverId: contractId,
        actions: [
          {
            methodName: 'ft_transfer_call',
            args: {
              'receiver_id': routerContractId,
              amount: amount,  // wNear decimals is 24
              msg: `any_swap_out ${anyContractId} ${bindaddr} ${selectchain}`
            },
            gas: '300000000000000',
            deposit: '1'
          }
        ]
      }
      console.log(actions)
      let tx:any = {}
      window.near.signAndSendTransaction(actions).then((res:any) => {
        console.log(res)
        if (res?.response && !res?.response.error && res?.response.length > 0) {
          tx = res?.response[0]?.transaction
          resolve(tx)
        } else {
          reject(res?.response?.error)
        }
      }).catch((error:any) => {
        reject(error)
      })
    })
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
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const [balance, setBalance] = useState<any>()
  const inputAmount = useMemo(() => tryParseAmount3(typedValue, inputCurrency?.decimals), [typedValue, inputCurrency])
  const underlyingToken = contractId ? contractId : anyContractId
  const {
    getNearBalance,
    getNearTokenBalance
  } = useNearBalance()

  const getBalance = useCallback(() => {
    if (inputCurrency?.tokenType === 'NATIVE') {
      getNearBalance().then(res => {
        if (res?.available) {
          // setBalance(BigAmount.format(inputCurrency?.decimals,res?.available))
          setBalance(BigAmount.format(inputCurrency?.decimals,res?.total))
        } else {
          setBalance('')
        }
      })
    } else {
      getNearTokenBalance(contractId).then(res => {
        // console.log(contractId)
        // console.log(res)
        if (res) {
          // setBalance(BigAmount.format(inputCurrency?.decimals,res?.available))
          setBalance(BigAmount.format(inputCurrency?.decimals,res))
        } else {
          setBalance('')
        }
      })
    }
  }, [inputCurrency, contractId])

  useEffect(() => {
    getBalance()
  }, [inputCurrency, contractId])

  useInterval(getBalance, 1000 * 10)

  let sufficientBalance = false
  try {
    // sufficientBalance = true
    sufficientBalance = inputCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
  } catch (error) {
    console.log(error)
  }

  return useMemo(() => {
    // console.log(inputAmount)
    // console.log(receiverId)
    // console.log(selectChain)
    // console.log(routerToken)
    // console.log(underlyingToken)
    // console.log(chainId)
    if (!selectChain || !routerToken || !underlyingToken || !chainId) return NOT_APPLICABLE
    // console.log(balance)
    return {
      // wrapType: WrapType.WRAP,
      balance,
      execute: receiverId &&  inputAmount ? async () => {
        try {
          
          const txReceipt:any = inputCurrency?.tokenType === "NATIVE" ? await sendNear(routerToken, inputAmount, receiverId, selectChain) : await sendNearToken(contractId, anyContractId, routerToken, inputAmount, receiverId, selectChain)
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
              isLiquidity: destConfig?.isLiquidity
            })
            recordsTxns(data)
            onChangeViewDtil(txReceipt?.hash, true)
          }
        } catch (error) {
          console.log('Could not swapout', error)
          onChangeViewErrorTip('Txns failure.', true)
        }
      } : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [inputAmount, receiverId, selectChain, routerToken, anyContractId, contractId, chainId, inputCurrency, balance, underlyingToken])
}