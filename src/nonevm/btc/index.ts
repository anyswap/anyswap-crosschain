import { useCallback } from "react"
// import { useTranslation } from 'react-i18next'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import {
  AppState,
  AppDispatch
} from '../../state'
import {nonevmAddress} from '../hooks/actions'
// import { useActiveReact } from '../../hooks/useActiveReact'
import config from '../../config'
// import {VALID_BALANCE} from '../../config/constant'

// import {BigAmount} from '../../utils/formatBignumber'

// import {recordsTxns} from '../../utils/bridge/register'
// import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
// import { useTransactionAdder } from '../../state/transactions/hooks'
// import { tryParseAmount3 } from '../../state/swap/hooks'
// import { ChainId } from "../../config/chainConfig/chainId"
import { isAddress } from "../../utils/isAddress"

export function useLoginBtc() {
  const dispatch = useDispatch<AppDispatch>()
  const loginBtc = useCallback(async(chainId) => {
    // console.log(chainId)
    // console.log(window.bitcoin)
    if (window.bitcoin) {
      if (window.bitcoin.enable) {
        window.bitcoin.enable().then((res:any) => {
          console.log(res)
          dispatch(nonevmAddress({chainId, account: res?.[0]?.address}))
        }).catch((error:any) => {
          console.log(error)
          dispatch(nonevmAddress({chainId, account: ''}))
        })
      } else if (window.bitcoin.getAccount) {
        window.bitcoin.getAccount().then((res:any) => {
          console.log(res)
          dispatch(nonevmAddress({chainId, account: res.address}))
        }).catch((error:any) => {
          console.log(error)
          dispatch(nonevmAddress({chainId, account: ''}))
        })
      }
    } else {
      if (confirm('Please install Bitcoin Wallet.') === true) {
        window.open('https://mathwallet.org/bitcoin-wallet')
      }
    }
  }, [])

  return {
    loginBtc
  }
}

export function useBtcBalance () {

  const aptBalanceList:any = useSelector<AppState, AppState['apt']>(state => state.apt.aptBalanceList)
  const getBtcBalance = useCallback(async function (chainId:any, address: any) {
    // console.log(chainId, address, token)
    // console.log(isAptosAddress(address))
    if (!isAddress(address, chainId)) { return null }
    const rpc = config.chainInfo[chainId].nodeRpc
    // const url = `${rpc}address/${address}/utxo`
    const url = `${rpc}address/${address}`
    // const options = {
    //   "method": "gethistory",
    //   "params": ["BLOCK", [address]]
    // }
    const result = await fetch(url)
      .then((response) => response.json())
      .catch(err => console.error(err));
      // console.log(result)
    return result;
  }, [])

  return {
    getBtcBalance,
    aptBalanceList
    // getAptosTokenBalance,
  }
}