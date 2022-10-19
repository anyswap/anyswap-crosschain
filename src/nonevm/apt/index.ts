import { useCallback, useMemo } from "react"
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
import config from '../../config'

import {BigAmount} from '../../utils/formatBignumber'

import {recordsTxns} from '../../utils/bridge/register'
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
import { tryParseAmount3 } from '../../state/swap/hooks'

// import {AptosClient} from 'aptos'
// import {connect} from 'Aptos-api-js'
// console.log(Aptos)
// const {AptosClient} = require('aptos')

// function getClient (chainId:any) {
//   const rpc = config.chainInfo[chainId].nodeRpc
//   // return new AptosClient(rpc)
//   return rpc
// }

export function isAptosAddress (address: string) {
  const inputAddress = address;
  if (!address || address.indexOf("0x") === -1) {
    return null
  } else {
    address = address.substring(2)
  }
  return address.length === 64 ? inputAddress : null
}

/**
 * Connect wallet and get account address
 */
 export function useLoginAptos() {
  const dispatch = useDispatch<AppDispatch>()
  const loginAptos = useCallback(async(chainId) => {
    if (window?.aptos) {
      window.aptos.connect().then((res:any) => {
        console.log(res)
        if (res?.address) {
          dispatch(nonevmAddress({chainId, account: res.address}))
        } else {
          dispatch(nonevmAddress({chainId, account: ''}))
        }
      }).catch((error:any) => {
        console.log(error)
        dispatch(nonevmAddress({chainId, account: ''}))
      })
    } else {
      if (confirm('Please install Petra Wallet.') === true) {
        window.open('https://chrome.google.com/webstore/detail/petra/ejjladinnckdgjemekebdpeokbikhfci')
      }
    }
  }, [])

  return {
    loginAptos
  }
}

/**
 * Get native balance and token balance
 *
 * @param account wallet address
 * @param token token address
 */
 export function useAptosBalance () {

  const aptBalanceList:any = useSelector<AppState, AppState['apt']>(state => state.apt.aptBalanceList)
  // const getAptosResource = useCallback(async ({address, res_type}: {address: string | object, res_type: string | null = null}) => {
  // const getAptosResource = (async function (address: string | object, res_type: string | null = null) {
  const getAptosResource = useCallback(async function (chainId:any, address: any, token: string | null = null) {
    // console.log(chainId, address, token)
    // console.log(isAptosAddress(address))
    if (!isAptosAddress(address)) { return null }
    const rpc = config.chainInfo[chainId].nodeRpc
    const options = {method: 'GET', headers: {'Content-Type': 'application/json'}};
    let url 
    if (!token) {
      url = rpc + "/v1/accounts/" + address +"/resources";
    } else {
      url = rpc + "/v1/accounts/" + address +"/resource/" + token;
    }
    const result = await fetch(url, options)
      .then((response) => response.json())
      .catch(err => console.error(err));
      // console.log(result)
    return result;
  }, [])

  return {
    getAptosResource,
    aptBalanceList
    // getAptosTokenBalance,
  }
}

/**
 * Authorization and obtaining authorization information
 *
 * @param account wallet address
 * @param token token address
 * @param spender spender address
 */
export function useAptAllowance() {
  const setAptAllowance = useCallback((
    token: string | null | undefined,
    chainId: string | null | undefined,
    account: string | null | undefined,
  ): Promise<any> => {
    return new Promise(async(resolve, reject) => {
      if (token && account && chainId) {
        const transaction = {
          arguments: [],
          function: '0x1::managed_coin::register',
          type: 'entry_function_payload',
          'type_arguments': [token],
        }
      
        try {
          const txResult:any = await (window as any).aptos.signAndSubmitTransaction(transaction);
          console.log(txResult)
          resolve({hash: txResult?.hash})
        } catch (error) {
          reject(error)
        }
      } else {
        reject('Parameter error.')
      }
    })
  }, [])

  return {
    setAptAllowance,
  }
}

/**
 * Get transaction info
 *
 * @param txid transaction hash
 */
export function getAptTxnsStatus (txid:string, chainId:any) {
  return new Promise(resolve => {
    const data:any = {}
    if (txid) {
      const rpc = config.chainInfo[chainId].nodeRpc
      const url = `${rpc}/v1/transactions/by_hash/${txid}`
      // window?.tronWeb?.trx.getTransaction(txid).then((res:any) => {
      fetch(url).then(res => res.json()).then(json => {
        console.log(json)
        if (json) {
          if (json.success) {
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
    } else {
      data.msg = 'Null'
      data.error = 'Query is empty!'
      resolve(data)
    }
  })
}
// getAptTxnsStatus('0x013dbfba6bee428b70a66603a306dd95044e7e16a7bcddef094154a11b62f070', 'APT_TEST')
/**
 * Cross chain 
 *
 * @param routerToken router token address
 * @param inputToken any or underlying address
 * @param selectCurrency select current token info
 * @param selectChain to chainId
 * @param receiveAddress receive address
 * @param typedValue typed Value
 * @param destConfig to chain info
 */
export function useTempCrossChain (
  routerToken: string | null | undefined,
  inputToken: string | null | undefined,
  selectCurrency: any,
  selectChain: string | null | undefined,
  receiveAddress: any,
  typedValue: any,
  destConfig: any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const { account, chainId } = useActiveReact()
  const {aptBalanceList} = useAptosBalance()

  const { t } = useTranslation()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const addTransaction = useTransactionAdder()

  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [typedValue, selectCurrency])

  const balance = useMemo(() => {
    const token = selectCurrency.address
    if (selectCurrency.tokenType === 'NATIVE') {
      const nativetoken = '0x1::aptos_coin::AptosCoin'
      return BigAmount.format(8, aptBalanceList?.[nativetoken]?.balance)
    } else if (aptBalanceList?.[token]?.balance) {
      return BigAmount.format(selectCurrency.decimals, aptBalanceList?.[token]?.balance)
    }
    return BigAmount.format(selectCurrency.decimals, '0')
  }, [selectCurrency])

  let sufficientBalance = false
  try {
    // sufficientBalance = true
    sufficientBalance = selectCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
  } catch (error) {
    console.log(error)
  }

  return useMemo(() => {
    if (!account || !chainId || !selectCurrency || !receiveAddress) return {}
    return {
      balance: balance,
      execute: async () => {

        const transaction = {
          arguments: [],
          function: '0x1::managed_coin::register',
          type: 'entry_function_payload',
          'type_arguments': [inputToken],
        }
      
        try {
          const txReceipt:any = await (window as any).aptos.signAndSubmitTransaction(transaction);
          console.log(txReceipt)
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
          // reject(error)
          onChangeViewErrorTip('Txns failure.', true)
        }
      },
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: selectCurrency?.symbol})
    }
  }, [routerToken, inputToken, chainId, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account, balance])
}

enum SwapType {
  withdraw = 'withdraw',
  deposit = 'deposit',
}

/**
 * Cross chain 
 *
 * @param routerToken router token address
 * @param selectCurrency select current token info
 * @param inputToken any or underlying address
 * @param typedValue typed Value
 * @param swapType deposit or withdraw
 * @param selectChain to chainId
 * @param receiveAddress receive address
 * @param destConfig to chain info
 */
export function useTempSwapPoolCallback(
  routerToken: string | null | undefined,
  selectCurrency: any,
  inputToken: string | null | undefined,
  typedValue: any,
  swapType: SwapType,
  selectChain: any,
  receiveAddress: string | null | undefined,
  destConfig: any,
): { execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { account, chainId } = useActiveReact()
  const {aptBalanceList} = useAptosBalance()

  const { t } = useTranslation()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const addTransaction = useTransactionAdder()

  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [typedValue, selectCurrency])

  const balance = useMemo(() => {
    const token = selectCurrency.address
    if (selectCurrency.tokenType === 'NATIVE') {
      const nativetoken = '0x1::aptos_coin::AptosCoin'
      return BigAmount.format(8, aptBalanceList?.[nativetoken]?.balance)
    } else if (aptBalanceList?.[token]?.balance) {
      return BigAmount.format(selectCurrency.decimals, aptBalanceList?.[token]?.balance)
    }
    return BigAmount.format(selectCurrency.decimals, '0')
  }, [selectCurrency])

  let sufficientBalance = false
  try {
    // sufficientBalance = true
    sufficientBalance = selectCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
  } catch (error) {
    console.log(error)
  }

  return useMemo(() => {
    if (!account || !chainId || !selectCurrency || !receiveAddress) return {}
    return {
      balance: balance,
      execute: async () => {

        const transaction = {
          arguments: [],
          function: '0x1::managed_coin::register',
          type: 'entry_function_payload',
          'type_arguments': [inputToken],
        }
      
        try {
          const txReceipt:any = await (window as any).aptos.signAndSubmitTransaction(transaction);
          console.log(txReceipt)
          // resolve({hash: txResult?.hash})
          if (txReceipt?.hash) {
            if (chainId.toString() !== selectChain.toString() && swapType !== 'deposit') {

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
            } else {
              addTransaction(txReceipt, { summary: `${swapType === 'deposit' ? 'Deposit' : 'Withdraw'} ${typedValue} ${config.getBaseCoin(selectCurrency?.symbol, chainId)}` })
            }
          }
        } catch (error) {
          // reject(error)
          onChangeViewErrorTip('Txns failure.', true)
        }
      },
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: selectCurrency?.symbol})
    }
  }, [routerToken, inputToken, chainId, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account, balance])
}

interface PoolCalls {
  token: string | null | undefined,
  account: string | null | undefined,
  anytoken: string | null | undefined,
  dec: number
}

interface PoolResult {
  [key:string]: {
    balanceOf: string,
    totalSupply: string,
    balance: string,
  }
}

/**
 * Get pool info
 *
 * @param chainId router token address
 * @param calls [{token: '', anytoken: '', account: ''}]
 * @return {'anytoken': {'balanceOf': '', 'totalSupply': '', 'balance': ''}}
 */
export function useTempPoolDatas () {
  const getTempPoolDatas = useCallback(async(calls: Array<[PoolCalls]>, chainId: string | null | undefined): Promise<PoolResult> => {
    console.log(calls)
    console.log(chainId)
    return {
      'anytoken': {
        balanceOf: '',
        totalSupply: '',
        balance: '',
      }
    }
  }, [])
  return {
    getTempPoolDatas
  }
}