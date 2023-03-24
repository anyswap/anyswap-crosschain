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


// import {AptosClient} from 'aptos'
// import {connect} from 'Aptos-api-js'
// console.log(Aptos)
// const {AptosClient} = require('aptos')

// function getClient (chainId:any) {
//   const rpc = config.chainInfo[chainId].nodeRpc
//   // return new AptosClient(rpc)
//   return rpc
// }
const aptAddressReg = /^0x[0-9A-Za-z]{64}$/
export function isAptosAddress (address: string) {
  if (aptAddressReg.test(address)) {
    return address
  }
  return false
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
export const bytecode = 'a11ceb0b0500000006010004030411041508051d0e072b36086120000000010102000100000301040100000400020100010302030105020501060c010500010900010101090104636f696e067369676e65720a616464726573735f6f661569735f6163636f756e745f7265676973746572656408726567697374657200000000000000000000000000000000000000000000000000000000000000010200000001150a0011000c010a013800200308050a0a0038010b01380220030f05120b00380305140b000102'
export function useAptAllowance() {
  const setAptAllowance = useCallback((
    token: string | null | undefined,
    chainId: any,
    account: string | null | undefined,
    anytoken?: any
  ): Promise<any> => {
    return new Promise(async(resolve, reject) => {
      const curAccount = await window.aptos.account()
      if (curAccount?.address !== account) {
        alert('This address is not the current wallet address. Please switch wallets.')
      } else {
        if (token && account && chainId && [ChainId.APT, ChainId.APT_TEST].includes(chainId)) {
          const transaction = {
            arguments: [],
            function: '0x1::managed_coin::register',
            type: 'entry_function_payload',
            'type_arguments': [token],
          }
          // const transaction = {
          //   arguments: [],
          //   code: {
          //     bytecode: bytecode
          //   },
          //   function: '0x1::coin::transfer',
          //   type: 'script_payload',
          //   'type_arguments': [token, anytoken ? anytoken : token],
          // }
          console.log(anytoken)
          console.log(transaction)
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
          if (json.success === true) {
            data.msg = 'Success'
            data.info = json
          } else if (json.success === false) {
            data.msg = 'Failure'
            data.error = 'Txns is failure!'
          } else {
            data.msg = 'Null'
            data.error = 'Query is empty!'
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
export function useAptCrossChain (
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
  const {aptBalanceList} = useAptosBalance()

  const { t } = useTranslation()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const addTransaction = useTransactionAdder()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()

  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [typedValue, selectCurrency])

  const balance:any = useMemo(() => {
    const token = selectCurrency?.address
    if (token) {
      if (selectCurrency?.tokenType === 'NATIVE' && aptBalanceList?.[token]?.balance) {
        return BigAmount.format(8, aptBalanceList?.[token]?.balance)
      } else if (aptBalanceList?.[token]?.balance && aptBalanceList?.[token]?.balance) {
        return BigAmount.format(selectCurrency?.decimals, aptBalanceList?.[token]?.balance)
      }
      return BigAmount.format(selectCurrency?.decimals, '0')
    }
    return undefined
  }, [selectCurrency, aptBalanceList])

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
    if (!account || !chainId || !selectCurrency || !receiveAddress || !useToChainId) return {}
    return {
      balance: balance,
      execute: (sufficientBalance || !userInterfaceBalanceValid) && inputAmount
      ? async () => {

        const transaction = {
          arguments: [inputAmount, receiveAddress, useToChainId],
          function: routerToken + '::Router::swapout',
          type: 'entry_function_payload',
          'type_arguments': [selectCurrency.address],
        }
        console.log(transaction)
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
          onChangeViewErrorTip('Txns failure.', true)
        }
      } : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: selectCurrency?.symbol})
    }
  }, [routerToken, inputToken, chainId, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account, balance, useToChainId, userInterfaceBalanceValid])
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
export function useAptSwapPoolCallback(
  routerToken: string | null | undefined,
  selectCurrency: any,
  inputToken: string | null | undefined,
  typedValue: any,
  swapType: any,
  selectChain: any,
  receiveAddress: string | null | undefined,
  destConfig: any,
  inputCurrency: any,
  useToChainId: any,
): { execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { account, chainId } = useActiveReact()
  const {aptBalanceList} = useAptosBalance()

  const { t } = useTranslation()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const addTransaction = useTransactionAdder()

  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [typedValue, selectCurrency])

  const balance:any = useMemo(() => {
    const token = selectCurrency?.address
    if (token) {
      if (selectCurrency?.tokenType === 'NATIVE' && aptBalanceList?.[token]?.balance) {
        return BigAmount.format(8, aptBalanceList?.[token]?.balance)
      } else if (aptBalanceList?.[token]?.balance && aptBalanceList?.[token]?.balance) {
        return BigAmount.format(selectCurrency.decimals, aptBalanceList?.[token]?.balance)
      }
      return BigAmount.format(selectCurrency.decimals, '0')
    }
    return undefined
  }, [selectCurrency, aptBalanceList])

  let sufficientBalance = false
  try {
    // sufficientBalance = true
    sufficientBalance = selectCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
  } catch (error) {
    console.log(error)
  }

  return useMemo(() => {
    if (!account || !chainId || !selectCurrency || !swapType) return {}
    return {
      balance: balance,
      execute: async () => {

        let transaction = {}
        if (chainId.toString() !== selectChain.toString() && swapType !== 'deposit') {
          transaction = {
            arguments: [inputAmount, receiveAddress, useToChainId],
            function: routerToken + '::Router::swapout',
            type: 'entry_function_payload',
            'type_arguments': [inputToken],
          }
        } else {
          if (swapType === 'deposit') {
            transaction = {
              arguments: [inputAmount],
              function: routerToken + '::Pool::deposit',
              type: 'entry_function_payload',
              'type_arguments': [inputCurrency.address,inputToken],
            }
          } else {
            transaction = {
              arguments: [inputAmount],
              function: routerToken + '::Pool::withdraw',
              type: 'entry_function_payload',
              'type_arguments': [inputToken, inputCurrency.address],
            }
          }
        }
        console.log(transaction)
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
                toAddress: receiveAddress?.indexOf('0x') === 0 ? receiveAddress?.toLowerCase() : receiveAddress,
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
  }, [routerToken, inputToken, chainId, selectCurrency, selectChain, receiveAddress, typedValue, destConfig, account, balance, inputCurrency, useToChainId])
}


/**
 * Get pool info
 *
 * @param chainId router token address
 * @param calls [{token: '', anytoken: '', account: ''}]
 * @return {'anytoken': {'balanceOf': '', 'totalSupply': '', 'balance': ''}}
 */
export function useAptPoolDatas () {
  const {getAptosResource} = useAptosBalance()
  const getAptPoolDatas = useCallback(async(calls: any, chainId: any): Promise<void> => {
    return new Promise(resolve => {
      const arr = []
      const labelArr:any = []
      // console.log(calls)
      if ([ChainId.APT, ChainId.APT_TEST].includes(chainId) ) {
        // console.log(calls)
        // const useAccount = window.tronWeb.defaultAddress.base58
        for (const item of calls) {
          const anytoken = item.anytoken ? item.anytoken.split('::')[0] : ''
          const anytokenSource = item.anytoken
          const underlyingToken = item.token
          // console.log('anytoken', anytoken)
          // console.log('underlyingToken', underlyingToken)
          if (underlyingToken && anytoken) {
            // console.log(underlyingToken, anytoken)
            // arr.push(window?.tronWeb?.transactionBuilder.triggerSmartContract(underlyingToken, "balanceOf(address)", {}, {type:'address',value: anytoken}, useAccount))
            arr.push(getAptosResource(chainId, anytoken))
            // arr.push(window?.tronWeb?.transactionBuilder.triggerSmartContract(underlyingToken, "balanceOf(address)", {}, {type:'address',value: anytoken}, useAccount))
            labelArr.push({
              key: anytokenSource,
              label: 'balanceOf',
              dec: item.dec
            })
          }
          // console.log(item)
          // console.log(chainId)
          if (anytoken && isAptosAddress(item.account)) {
            // arr.push(window?.tronWeb?.transactionBuilder.triggerSmartContract(anytoken, "balanceOf(address)", {}, {type:'address',value: item.account}, useAccount))
            arr.push(getAptosResource(chainId, item.account))
            labelArr.push({
              key: anytokenSource,
              label: 'balance',
              dec: item.dec
            })
          }
        }
      }
      // console.log(arr)
      const list:any = {}
      Promise.all(arr).then(res => {
        // console.log(res)
        for (let i = 0, len = arr.length; i < len; i++) {
          const k = labelArr[i].key
          const l = labelArr[i].label
          const result = res[i]
          // const dec = labelArr[i].dec
          if (!list[k]) list[k] = {}
          // list[k][l] = res[i] ? BigAmount.format(dec, res[i].toString()).toExact() : ''
          // list[k][l] = result
          if (result) {
            for (const obj of result) {
              if (obj && !obj.error_code) {
                const type = obj.type
                const tokenKey = type.replace('0x1::coin::CoinStore<', '').replace('>', '')
                if (tokenKey === k) {
                  list[k][l] = obj.data.coin.value
                  break
                }
              }
            }
          }
        }
        // console.log(list)
        resolve(list)
      }).catch((error:any) => {
        console.log(error)
        resolve(list)
      })
    })
  }, [])
  return {
    getAptPoolDatas
  }
}