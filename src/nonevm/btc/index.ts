import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from 'react-i18next'
import {
  useDispatch,
  useSelector
} from 'react-redux'
import {
  AppState,
  AppDispatch
} from '../../state'
import {nonevmAddress} from '../hooks/actions'
import { useActiveReact } from '../../hooks/useActiveReact'
// import {VALID_BALANCE} from '../../config/constant'
import {
  // useDarkModeManager,
  // useExpertModeManager,
  // useInterfaceModeManager,
  useInterfaceBalanceValidManager
  // useUserTransactionTTL,
  // useUserSlippageTolerance
} from '../../state/user/hooks'

import {BigAmount} from '../../utils/formatBignumber'

import {recordsTxns} from '../../utils/bridge/register'
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { tryParseAmount3 } from '../../state/swap/hooks'
import { ChainId } from "../../config/chainConfig/chainId"
import config from '../../config'

import {getP2PInfo} from '../../utils/bridge/register'
import { createAddress } from '../../utils/isAddress/BTC'
import {setLocalConfig} from '../../utils/tools/tools'
import {CROSSCHAINBRIDGE} from '../../utils/bridge/type'

import { isAddress } from "../../utils/isAddress"

export function useLoginBtc() {
  const dispatch = useDispatch<AppDispatch>()
  const loginBtc = useCallback(async(chainId) => {
    // console.log(chainId)
    console.log(window.bitcoin)
    if (window.bitcoin) {
      if (window.bitcoin.enable) {
        window.bitcoin.enable().then((res:any) => {
          console.log(res)
          // window.bitcoin.request({
          //   method: 'wallet_getAddresses',
          //   params: []
          // }).then((res:any) => {
          //   console.log(res)
          // }).catch((error:any) => {
          //   console.log(error)
          // })
          // window.bitcoin.request({
          //   method: 'wallet_getConnectedNetwork',
          //   params: []
          // }).then((res:any) => {
          //   console.log(res)
          // }).catch((error:any) => {
          //   console.log(error)
          // })
          // window.bitcoin.request({
          //   method: 'wallet_signMessage',
          //   params: []
          // }).then((res:any) => {
          //   console.log(res)
          // }).catch((error:any) => {
          //   console.log(error)
          // })
          // window.bitcoin.getAccount().then((res:any) => {
          //   console.log(res)
          //   dispatch(nonevmAddress({chainId, account: res.address}))
          // }).catch((error:any) => {
          //   console.log(error)
          //   dispatch(nonevmAddress({chainId, account: ''}))
          // })
          // window.providerManager.getProviderFor('BTC').getMethod('wallet.getAddresses')().then((res:any) => {
          //   console.log(res)
          // }).catch((error:any) => {
          //   console.log(error)
          // })
          dispatch(nonevmAddress({chainId, account: res?.[0]?.address}))
        }).catch((error:any) => {
          console.log(error)
          dispatch(nonevmAddress({chainId, account: ''}))
        })
      } else if (window.bitcoin.getAccount) {
        // window.bitcoin.getAccount().then((res:any) => {
        //   console.log(res)
        //   dispatch(nonevmAddress({chainId, account: res.address}))
        // }).catch((error:any) => {
        //   console.log(error)
        //   dispatch(nonevmAddress({chainId, account: ''}))
        // })
        dispatch(nonevmAddress({chainId, account: ''}))
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

  const btcBalanceList:any = useSelector<AppState, AppState['btc']>(state => state.btc.btcBalanceList)
  const getBtcBalance = useCallback(async function (chainId:any, address: any) {
    // console.log(chainId, address, token)
    // console.log(!isAddress(address, chainId),address,chainId)
    if (!isAddress(address, chainId) || ![ChainId.BTC, ChainId.BTC_TEST].includes(chainId)) { return null }
    const rpc = config.chainInfo[chainId].nodeRpc
    // const url = `${rpc}address/${address}/utxo`
    const url = `${rpc}/address/${address}`
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
    btcBalanceList
    // getAptosTokenBalance,
  }
}

export function getBtcHash (hash:any, chainId:any) {
  const data:any = {
    msg: 'Error',
    info: ''
  }
  return new Promise(resolve => {
    // const url = 'https://rpc.testnet.near.org'
    const rpc = config.chainInfo[chainId].nodeRpc
    const url = `${rpc}/tx/${hash}`
      // window?.tronWeb?.trx.getTransaction(txid).then((res:any) => {
    fetch(url).then(res => res.json()).then(json => {
      console.log(json)
      if (json) {
        if (json.status.confirmed === true) {
          data.msg = 'Success'
          data.info = json
        } else if (json.status.confirmed === false) {
          data.msg = 'Null'
          data.error = 'Query is empty!'
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

export function useBtcCrossChain (
  routerToken: string | null | undefined,
  inputToken: string | null | undefined,
  selectCurrency: any,
  selectChain: any,
  receiveAddress: any,
  typedValue: any,
  destConfig: any,
  useToChainId: any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const { account, chainId } = useActiveReact()
  const {btcBalanceList} = useBtcBalance()

  const { t } = useTranslation()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const addTransaction = useTransactionAdder()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()

  const [p2pAddress, setP2pAddress] = useState<any>('')

  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [typedValue, selectCurrency])

  const balance:any = useMemo(() => {
    const token = selectCurrency?.address
    if (token) {
      if (btcBalanceList?.NATIVE) {
        return BigAmount.format(8, btcBalanceList?.NATIVE)
      }
      return BigAmount.format(selectCurrency?.decimals, '0')
    }
    return undefined
  }, [selectCurrency, btcBalanceList])

  const onCreateP2pAddress = useCallback(() => {
    setP2pAddress('')
    if (receiveAddress && selectCurrency && destConfig && selectChain && destConfig?.type === 'swapin') {
      getP2PInfo(receiveAddress, selectChain, selectCurrency?.symbol, selectCurrency?.address).then((res:any) => {
        // console.log(res)
        // console.log(selectCurrency)
        if (res?.p2pAddress) {
          const localAddress = createAddress(receiveAddress, selectCurrency?.symbol, destConfig?.DepositAddress)
          if (res?.p2pAddress === localAddress && isAddress(localAddress, chainId)) {
            // console.log(localAddress)
            setP2pAddress(localAddress)
            setLocalConfig(receiveAddress, selectCurrency?.address, selectChain, CROSSCHAINBRIDGE, {p2pAddress: localAddress})
          }
        }
      })
    }
  }, [receiveAddress, selectCurrency, destConfig, selectChain, chainId])

  useEffect(() => {
    onCreateP2pAddress()
  }, [receiveAddress, selectCurrency, destConfig, selectChain, chainId])

  // console.log(balance)
  let sufficientBalance:any = false
  try {
    // sufficientBalance = true
    sufficientBalance = selectCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
  } catch (error) {
    console.log(error)
  }

  return useMemo(() => {
    // console.log(sufficientBalance)
    // console.log(balance ? balance?.toExact() : '')
    // console.log(typedValue)
    if (
      !account
      || !chainId
      || !selectCurrency
      || (!receiveAddress && destConfig?.type !== 'swapin')
      || (!p2pAddress && destConfig?.type === 'swapin')
    ) return {}
    return {
      balance: balance,
      execute: (sufficientBalance || !userInterfaceBalanceValid) && inputAmount
      ? async () => {
        // const transactionParams = [{to: routerToken, value: inputAmount, memo: receiveAddress + ':' + selectChain}]
        const transactionParams = [routerToken, inputAmount, receiveAddress + ':' + useToChainId]
        console.log(transactionParams)
        try {
          const txResult:any = await (window as any)?.bitcoin?.request({
              // method: 'wallet_sendTransaction',
              // method: 'wallet_signMessage',
              method: 'wallet_signPSBT',
              params: transactionParams
            })
            // .then((res:any) => {
            //   console.log(res)
            // }).catch((error:any) => {
            //   console.log(error)
            // })
          console.log(txResult)
          const txReceipt:any = txResult?.txHash ? {hash: txResult?.txHash} : {}
          // resolve({hash: txResult?.hash})
          if (txReceipt?.hash) {
            const data:any = {
              hash: txReceipt.hash,
              chainId: chainId,
              selectChain: selectChain,
              account: account,
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
              version: destConfig?.type,
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
          // reject(error)
          console.error(error)
          onChangeViewErrorTip('Txns failure.', true)
        }
      } : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: selectCurrency?.symbol})
    }
  }, [routerToken, inputToken, chainId, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account, balance, p2pAddress, useToChainId, userInterfaceBalanceValid])
}