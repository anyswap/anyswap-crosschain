import {
  connect,
  // Contract,
  keyStores,
  // WalletConnection
} from 'Aptos-api-js'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'
// import {getConfig} from './config'
import { tryParseAmount3 } from '../../state/swap/hooks'
import { BigAmount } from '../../utils/formatBignumber'
import { useTransactionAdder } from '../../state/transactions/hooks'
import {recordsTxns} from '../../utils/bridge/register'
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
import useInterval from '../../hooks/useInterval'
import { isAddress } from '../../utils/isAddress'
import { ChainId } from '../../config/chainConfig/chainId'
import {VALID_BALANCE} from '../../config/constant'
import config from '../../config'
// export enum WrapType {
//   NOT_APPLICABLE,
//   WRAP,
//   UNWRAP,
//   NOCONNECT
// }

const NOT_APPLICABLE = { }

// const AptosConfig:any = getConfig(process.env.NODE_ENV || 'development')
const contractId = 'bridge-1.crossdemo.testnet'


//  `await window.aptos.connect()` either throw error "inpage.js:3 Uncaught Rejected: The user rejected the request" or
//    return a object {address: '0xcd0c8805e0de0997900ef335562455d1d99a1ec114e071cd95d77e8ebec4cf90',
//      publicKey: '0xfe05900daca856ad9e6cee82cd31a63805cd725e4417f03deac75a7708a87d4d'}

export async function initConnect () {
  let account
  try {
    account = await window.aptos.connect()
  } catch (error) {
    console.log('initConnect')
    console.log(error)
    if (window?.aptos) {
      console.log("Whereeeee is my Petro walllllllllet?")
    }
  }
  return account;
}

export function useLogout() {
  const logout = useCallback(async() => {
    if (window?.aptos) {
      await window.aptos.disconnect()
    }
  }, [])
  return {
    logout
  }
}

export async function useAptosAddress () {
  return window?.aptos?.account().address
}

export function useLogin() {
  const [access, setAccess] = useState<any>({})
  const login = useCallback(async() => {
    if (window?.aptos) {
      try {
        await window.aptos.connect()
      } catch (error) {
        console.log('error: ', error)
      }
    } else {
      if (confirm('Please install Petra Wallet.') === true) {
        window.open('https://chrome.google.com/webstore/detail/petra/ejjladinnckdgjemekebdpeokbikhfci')
      }
    }
  }, [])

  return {
    login,
    access
  }
}

export function isAptosAddress (address: string) {
  const input_address = address;
  if (address.indexOf("0x") === -1) {} else {
    address = address.substring(2)
  }
  return address.length != 64 ? input_address : null
}

export function useAptosBalance () {
  
  const rpc_url = config.chainInfo[2].nodeRpc
  // const getAptosResource = useCallback(async ({address, res_type}: {address: string | object, res_type: string | null = null}) => {
  // const getAptosResource = (async function (address: string | object, res_type: string | null = null) {
  const getAptosResource = useCallback(async function (address: string | object, res_type: string | null = null) {
    if ((typeof address?.account) == 'function') ( address = address.account().address) // if address wasnt address but a petra wallet object.
    if (!isAptosAddress(address)) { return null }
    const options = {method: 'GET', headers: {'Content-Type': 'application/json'}};
    if (!res_type) {
      const url = rpc_url + "/accounts/" + address +"/resources";
    } else {
      const url = rpc_url + "/accounts/" + address +"/resource/" + res_type;
    }

    const res_json = await fetch(url, options)
      .then((response) => response.json())
      .catch(err => console.error(err));
    return res_json;
  }, [])

  const getAptosTokenBalance = useCallback(async({token, account}) => {
    let bl:any
    const useAccount = account ? account : window?.Aptos?.accountId
    try {
      bl = await getAptosResource(window?.aptos, "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
    } catch (error) {
      
    }
    return bl
  }, [])

  return {
    getAptosResource,
    getAptosTokenBalance,
  }
}

export function useAptosPoolDatas () {
}

export function useSendAptos () {
}

export function useAptosSendTxns() {
}

export function updateAptosHash (hash:any, chainId:any) {
}