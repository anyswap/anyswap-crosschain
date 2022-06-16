// import {
//   connect,
//   // Contract,
//   keyStores,
//   WalletConnection
// } from 'near-api-js'
import { useCallback, useState } from 'react'
import {getConfig} from './config'


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

export function useNearSendTxns () {
  const {sendNear} = useSendNear()
  const sendNearTxns = useCallback(async(receiverId, amount) => {
    sendNear(receiverId, amount)
  }, [])
  return {
    sendNearTxns
  }
}