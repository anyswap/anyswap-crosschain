// import {
//   connect,
//   // Contract,
//   keyStores,
//   WalletConnection
// } from 'near-api-js'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {getConfig} from './config'
import { tryParseAmount3 } from '../../state/swap/hooks'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
  NOCONNECT
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }

const nearConfig:any = getConfig(process.env.NODE_ENV || 'development')
const contractId = nearConfig.contractName
// const wNearContractId = 'wrap.testnet';

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
    const res1 = await window.near.account().getAccountBalance()
    // const res2 = await window.near.account().getAccountDetails()
    // console.log(res)
    console.log(res1)
    // console.log(res2)
  }, [])

  const getNearTokenBalance = useCallback(async(contractId) => {
    const res = await window.near.account().viewFunction(
      contractId,
      'storage_balance_of',
      { "account_id": window.near.accountId },
    )
    // const res1 = await window.near.account().getAccountBalance()
    // const res2 = await window.near.account().getAccountDetails()
    console.log(res)
    // console.log(res1)
    // console.log(res2)
  }, [])

  return {
    getNearBalance,
    getNearTokenBalance
  }
}

export function useSendNear () {
  const sendNear = useCallback(async(receiverId, amount) => {
    const res = await window.near.sendMoney({
      receiverId: receiverId,
      amount: amount,
    });
    console.log(res)
  }, [])
  return {
    sendNear
  }
}

export function useSendNearToken () {
  const sendNear = useCallback(async(receiverId, amount) => {
    const res = await window.near.sendMoney({
      receiverId: receiverId,
      amount: amount,
    });
    console.log(res)
  }, [])
  return {
    sendNear
  }
}

export function useNearSendTxns(
  // inputCurrency,
  typedValue:any,
  receiverId:any,
  // chainId,
  // selectChain,
): {
  wrapType?: WrapType
  inputError?: string
  execute?: undefined | (() => Promise<void>)
} {
  const {sendNear} = useSendNear()
  const inputAmount = useMemo(() => tryParseAmount3(typedValue, 24), [typedValue])
  const {
    getNearBalance,
    getNearTokenBalance
  } = useNearBalance()

  useEffect(() => {
    getNearBalance()
    getNearTokenBalance('bridge-1.crossdemo.testnet')
  }, [])

  return useMemo(() => {
    console.log(receiverId)
    console.log(inputAmount)
    console.log(typedValue)
    if (!inputAmount || !receiverId) return NOT_APPLICABLE
    return {
      wrapType: WrapType.WRAP,
      execute: async () => {
        sendNear(receiverId, inputAmount)
      }
    }
  }, [inputAmount, receiverId])
}