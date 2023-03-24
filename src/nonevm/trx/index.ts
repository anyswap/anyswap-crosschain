import { useCallback, useMemo } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
// import useInterval from "../useInterval"
import { MaxUint256 } from '@ethersproject/constants'
import { AppState, AppDispatch } from '../../state'
import { trxAddress } from './actions'
import { useActiveReact } from '../../hooks/useActiveReact'

import {useBaseBalances, useTokensBalance} from '../../hooks/useAllBalances'

import { tryParseAmount3 } from '../../state/swap/hooks'
import { ChainId } from "../../config/chainConfig/chainId"


import {recordsTxns} from '../../utils/bridge/register'
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../../state/application/hooks'
import { useTransactionAdder } from '../../state/transactions/hooks'
// import { BigAmount } from "../../utils/formatBignumber"
import { isAddress } from '../../utils/isAddress'

import {
  ABI_TO_ADDRESS,
  // ABI_TO_ADDRESS,
  // ABI_TO_ADDRESS,
  // ABI_TO_ADDRESS
} from './crosschainABI'
// import {VALID_BALANCE} from '../../config/constant'
import {
  // useDarkModeManager,
  // useExpertModeManager,
  // useInterfaceModeManager,
  useInterfaceBalanceValidManager
  // useUserTransactionTTL,
  // useUserSlippageTolerance
} from '../../state/user/hooks'
import config from '../../config'
// import useInterval from "../useInterval"
// const tronweb = window.tronWeb

import TronWeb from 'tronweb'
// import { BigAmount } from "../../utils/formatBignumber"
// console.log(TronWeb)
export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
  NOCONNECT
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }

export function initTronWeb (chainId?:any) {
  let fullNode = 'https://api.shasta.trongrid.io';
  let solidityNode = 'https://api.shasta.trongrid.io';
  let eventServer = 'https://api.shasta.trongrid.io';
  if (chainId === ChainId.TRX) {
    fullNode = 'https://api.trongrid.io';
    solidityNode = 'https://api.trongrid.io';
    eventServer = 'https://api.trongrid.io';
  }
  const tronWeb = new TronWeb(
    fullNode,
    solidityNode,
    eventServer
  );
  return tronWeb
}

export function toHexAddress (address:string) {
  const tronWeb = initTronWeb()
  const str = tronWeb?.address?.toHex(address).toLowerCase()
  return '0x' + str.substr(2)
}

export function fromHexAddress (address:string) {
  return '41' + address.substr(2)
}

export function isTRXAddress (address:string) {
  const tronWeb = initTronWeb()
  if (address.indexOf('0x') === 0) {
    address = address.replace('0x', '41')
  }
  return tronWeb?.isAddress(address)
}

export function formatTRXAddress (address:string) {
  const tronWeb = initTronWeb()
  if (address.indexOf('0x') === 0) {
    address = address.replace('0x', '41')
    address = tronWeb?.address.fromHex(address)
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
    // window.open('tronlinkoutside://pull.activity?param={}')
    if (window.tronWeb) {
      window.tronWeb.request({method: 'tron_requestAccounts'}).then((res:any) => {
        if (res?.code === 200) {
          dispatch(trxAddress({address: window.tronWeb.defaultAddress.base58}))
        } else {
          dispatch(trxAddress({address: ''}))
          alert('Please connect TronLink.')
        }
      }).catch((err:any) => {
        console.log(err)
        dispatch(trxAddress({address: ''}))
        alert('Please connect TronLink.')
      })
    } else {
      if (confirm('Please open TronLink or install TronLink.') === true) {
        window.open('https://www.tronlink.org/')
      }
    }
  }, [])
  return {
    loginTrx
  }
}

export function useTrxBalance () {
  const TRXAccount = window?.tronWeb?.defaultAddress?.base58
  const getTrxBalance = useCallback(({account}) => {
    return new Promise((resolve) => {
      const useAccount = account ? account : TRXAccount
      if (window.tronWeb && window.tronWeb.defaultAddress.base58 && useAccount) {
        window?.tronWeb?.trx.getBalance(useAccount).then((res:any) => {
          // console.log(res)
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
      const tokenID = fromHexAddress(token)
      // console.log('tokenID', tokenID)
      if (window.tronWeb && window.tronWeb.defaultAddress.base58 && useAccount && tokenID) {
        window?.tronWeb?.transactionBuilder.triggerSmartContract(tokenID, "balanceOf(address)", {}, parameter1, useAccount).then((res:any) => {
          // console.log(res)
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

export function useTrxAllowance(
  token:any,
  spender: any,
  chainId: any,
  account: any,
) {
  const setTrxAllowance = useCallback((): Promise<any> => {
    return new Promise(async(resolve, reject) => {
      const useAccount = account
      if (!token || !spender || !useAccount || ![ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) resolve('')
      else {
        const tokenID = fromHexAddress(token)
        const spenderID = fromHexAddress(spender)
        if (window.tronWeb && window.tronWeb.defaultAddress.base58 && useAccount && tokenID) {
          try {
            // console.log(tokenID)
            const instance:any = await window?.tronWeb?.contract(ABI_TO_ADDRESS, tokenID)
            const result  = await instance.approve(spenderID, MaxUint256.toString()).send()
            // const result  = await instance.approve(spenderID, 0).send()
            // console.log(result)
            // console.log(MaxUint256)
            const txObj:any = {hash: result}
            // addTransaction(txObj, {
            //   summary: selectCurrency?.symbol + ' approved, you can continue the cross chain transaction',
            //   approval: { tokenAddress: token.address, spender: spender }
            // })
            resolve(txObj)
          } catch (error) {
            console.log(error)
            reject(error)
          }
        } else {
          resolve('')
        }
      }
    })
  }, [token, spender, account, chainId])

  const getTrxAllowance = useCallback(() => {
    return new Promise(async(resolve) => {
      const useAccount = account
      if (!token || !spender || !useAccount || ![ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) resolve('')
      else {
        // const parameter1 = [{type:'address',value: useAccount}, {type:'address',value: spender}]
        const tokenID = formatTRXAddress(token)
        // console.log('tokenID', tokenID)
        // console.log('parameter1', parameter1)
        if (window.tronWeb && window.tronWeb.defaultAddress.base58 && useAccount && tokenID) {
          const instance:any = await window?.tronWeb?.contract(ABI_TO_ADDRESS, tokenID)
          const result  = await instance.allowance(useAccount, spender).call()
          // console.log(result.toString())
          resolve(result.toString())
        } else {
          resolve('')
        }
      }
    })
  }, [account, chainId, token, spender])

  return {
    setTrxAllowance,
    getTrxAllowance,
    // trxAllowance: tal?.[selectCurrency?.address]
  }
}

export function getTRXTxnsStatus (txid:string) {
  return new Promise(resolve => {
    const data:any = {}
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      // window?.tronWeb?.trx.getTransaction(txid).then((res:any) => {
      window?.tronWeb?.trx.getTransactionInfo(txid).then((res:any) => {
        console.log(res)
        if (res?.receipt?.result === 'SUCCESS') {
          data.msg = 'Success'
          data.info = res
        } else if (res?.receipt?.result && res?.receipt?.result !== 'SUCCESS') {
          data.msg = 'Failure'
          data.error = 'Txns is failure!'
        } else {
          data.msg = 'Null'
          data.error = 'Query is empty!'
        }
        resolve(data)
      })
    } else {
      data.msg = 'Null'
      data.error = 'Query is empty!'
      resolve(data)
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
  useToChainId:any,
): {
  inputError?: string
  balance?: any,
  execute?: undefined | (() => Promise<void>)
} {
  const {account} = useActiveReact()
  const { t } = useTranslation()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const addTransaction = useTransactionAdder()

  const nativeBalance = useBaseBalances(account)
  const tokenBalance = useTokensBalance(selectCurrency?.address, selectCurrency?.decimals, chainId)
  const balance = selectCurrency?.tokenType === 'NATIVE' ? nativeBalance : tokenBalance

  // const [balance, setBalance] = useState<any>()

  // const {getTrxBalance, getTrxTokenBalance} = useTrxBalance()

  const inputAmount = useMemo(() => tryParseAmount3(typedValue, selectCurrency?.decimals), [typedValue, selectCurrency])

  let sufficientBalance = false
  try {
    // sufficientBalance = true
    sufficientBalance = selectCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
  } catch (error) {
    console.log(error)
  }

  return useMemo(() => {
    if (!account || ![ChainId.TRX, ChainId.TRX_TEST].includes(chainId) || !routerToken || !useToChainId) return {}
    return {
      balance: balance,
      execute: async () => {
        // let contract = await window?.tronWeb?.contract()
        if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
          const TRXAccount = window?.tronWeb?.defaultAddress.base58
          const formatRouterToken = fromHexAddress(routerToken)
          const formatInputToken = fromHexAddress(inputToken)
          // console.log('formatRouterToken',formatRouterToken)
          // console.log('formatInputToken',formatInputToken)
          // const formatReceiveAddress = formatTRXAddress(receiveAddress)
          const formatReceiveAddress = receiveAddress
          if (TRXAccount.toLowerCase() === account.toLowerCase()) {
            let txResult:any = ''
            // const instance:any = await window?.tronWeb?.contract(isNaN(selectChain) ? ABI_TO_ADDRESS : ABI_TO_ADDRESS, formatRouterToken)
            const instance:any = await window?.tronWeb?.contract(ABI_TO_ADDRESS, formatRouterToken)
            try {
              if (destConfig.routerABI.indexOf('anySwapOutNative') !== -1) { // anySwapOutNative
                txResult = await instance.anySwapOutNative(...[formatInputToken, formatReceiveAddress, useToChainId], {value: inputAmount}).send()
              } else if (destConfig.routerABI.indexOf('anySwapOutUnderlying') !== -1) { // anySwapOutUnderlying
                const parameArr = [formatInputToken, formatReceiveAddress, inputAmount, useToChainId]
                console.log(parameArr)
                txResult = await instance.anySwapOutUnderlying(...parameArr).send()
              } else if (destConfig.routerABI.indexOf('anySwapOut') !== -1) { // anySwapOut
                const parameArr = [formatInputToken, formatReceiveAddress, inputAmount, useToChainId]
                console.log(parameArr)
                txResult = await instance.anySwapOut(...parameArr).send()
              }
              const txReceipt:any = {hash: txResult}
              console.log(txReceipt)
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
                  version: destConfig.type,
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
              onChangeViewErrorTip('Txns failure.', true)
            }
          }
        } else {
          onChangeViewErrorTip('Please install TronLink.', true)
        }
      },
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: selectCurrency?.symbol})
    }
  }, [receiveAddress, account, selectCurrency, inputAmount, chainId, routerToken, selectChain, destConfig, inputToken, balance, useToChainId])
}


export function useTrxSwapPoolCallback(
  routerToken:any,
  inputCurrency: any,
  inputToken: string | undefined,
  typedValue: string | undefined,
  swapType: string | undefined,
  selectChain: any,
  receiveAddress: any,
  destConfig: any,
  useToChainId: any,
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { account, chainId } = useActiveReact()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const { t } = useTranslation()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()
  // console.log(balance)
  // console.log(inputCurrency)
  const inputAmount = useMemo(() => tryParseAmount3(typedValue, inputCurrency?.decimals), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()

  const nativeBalance = useBaseBalances(account)
  const tokenBalance = useTokensBalance(inputCurrency?.address, inputCurrency?.decimals, chainId)
  const balance = inputCurrency?.tokenType === 'NATIVE' ? nativeBalance : tokenBalance
  
  return useMemo(() => {
    // console.log(routerToken)
    // console.log(bridgeContract)
    // console.log(chainId)
    // console.log(inputCurrency)
    // console.log(swapType)
    // console.log(balance)
    // console.log(inputAmount)
    
    if (!chainId || !inputCurrency || !swapType) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
    // console.log(sufficientBalance)
    return {
      wrapType: WrapType.WRAP,
      execute:
      (sufficientBalance || !userInterfaceBalanceValid) && inputAmount
        ? async () => {
            try {
              if (window.tronWeb && window.tronWeb.defaultAddress.base58 && inputToken) {
                // console.log(123)
                // console.log(inputToken)
                // const instance:any = await window?.tronWeb?.contract(ABI_TO_ADDRESS)
                const formatInputToken = fromHexAddress(inputToken)
                const formatRouterToken = fromHexAddress(routerToken)
                let txResult:any
                if (inputCurrency?.tokenType === 'NATIVE') {
                  if (chainId.toString() !== selectChain.toString() && swapType !== 'deposit') {
                    const instance:any = await window?.tronWeb?.contract(ABI_TO_ADDRESS, formatRouterToken)
                    const parameArr = [formatInputToken, receiveAddress, useToChainId]
                    txResult = await instance.anySwapOutNative(...parameArr, {value: inputAmount}).send()
                  } else {
                    const instance:any = await window?.tronWeb?.contract(ABI_TO_ADDRESS, formatInputToken)
                    txResult = swapType === 'deposit' ? await instance.depositNative(...[inputToken, account], {value: inputAmount}).send() : await instance.withdrawNative(inputToken,inputAmount,account).send()
                  }
                } else {
                  if (chainId.toString() !== selectChain.toString() && swapType !== 'deposit') {
                    const instance:any = await window?.tronWeb?.contract(ABI_TO_ADDRESS, formatRouterToken)
                    const parameArr = [formatInputToken, receiveAddress, inputAmount, useToChainId]
                    txResult = await instance.anySwapOut(...parameArr).send()
                  } else {
                    const instance:any = await window?.tronWeb?.contract(ABI_TO_ADDRESS, formatInputToken)
                    txResult = swapType === 'deposit' ? await instance.deposit(inputAmount).send() : await instance.withdraw(inputAmount).send()
                  }
                }
                const txReceipt:any = {hash: txResult}
                console.log(txReceipt)
                if (chainId.toString() !== selectChain.toString() && swapType !== 'deposit') {
                  addTransaction(txReceipt, {
                    summary: `Cross bridge ${typedValue} ${inputCurrency?.symbol}`,
                    value: typedValue,
                    toChainId: selectChain,
                    toAddress: receiveAddress.indexOf('0x') === 0 ? receiveAddress?.toLowerCase() : receiveAddress,
                    symbol: inputCurrency?.symbol,
                    version: destConfig.type,
                    routerToken: routerToken,
                    token: inputCurrency?.address,
                    logoUrl: inputCurrency?.logoUrl,
                    isLiquidity: destConfig?.isLiquidity,
                    fromInfo: {
                      symbol: inputCurrency?.symbol,
                      name: inputCurrency?.name,
                      decimals: inputCurrency?.decimals,
                      address: inputCurrency?.address,
                    },
                    toInfo: {
                      symbol: destConfig?.symbol,
                      name: destConfig?.name,
                      decimals: destConfig?.decimals,
                      address: destConfig?.address,
                    },
                  })
                  const data:any = {
                    hash: txReceipt.hash,
                    chainId: chainId,
                    selectChain: selectChain,
                    account: account,
                    value: inputAmount,
                    formatvalue: typedValue,
                    to: receiveAddress,
                    symbol: inputCurrency?.symbol,
                    version: destConfig.type,
                    pairid: inputCurrency?.symbol,
                    routerToken: routerToken
                  }
                  recordsTxns(data)
                  onChangeViewDtil(txReceipt?.hash, true)
                } else {
                  addTransaction(txReceipt, { summary: `${swapType === 'deposit' ? 'Deposit' : 'Withdraw'} ${typedValue} ${config.getBaseCoin(inputCurrency?.symbol, chainId)}` })
                }
              } else {
                console.log('Could not swapout')
              }
            } catch (error) {
              console.log('Could not swapout', error)
              onChangeViewErrorTip(error, true)
            }
          }
        : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [chainId, inputCurrency, inputAmount, balance, addTransaction, t, inputToken, account, routerToken, selectChain, destConfig, useToChainId, userInterfaceBalanceValid])
}


export function useTrxPoolDatas () {
  const getTrxPoolDatas = useCallback(async(calls, chainId) => {
    return new Promise(resolve => {
      const arr = []
      const labelArr:any = []
      // console.log(calls)
      if (window.tronWeb && [ChainId.TRX, ChainId.TRX_TEST].includes(chainId) ) {
        // console.log(calls)
        // const useAccount = window.tronWeb.defaultAddress.base58
        for (const item of calls) {
          const anytoken = item.anytoken ? fromHexAddress(item.anytoken) : ''
          const anytokenSource = item.anytoken
          // const anytoken = item.anytoken ? toHexAddress(item.anytoken) : ''
          // const anytoken = item.anytoken
          // const underlyingToken = item.token
          const underlyingToken = item.token ? fromHexAddress(item.token) : ''
          // console.log('anytoken', anytoken)
          // console.log('underlyingToken', underlyingToken)
          if (underlyingToken && anytoken) {
            // console.log(underlyingToken, anytoken)
            // arr.push(window?.tronWeb?.transactionBuilder.triggerSmartContract(underlyingToken, "balanceOf(address)", {}, {type:'address',value: anytoken}, useAccount))
            arr.push(window?.tronWeb?.contract(ABI_TO_ADDRESS, underlyingToken).balanceOf(anytoken).call())
            // arr.push(window?.tronWeb?.transactionBuilder.triggerSmartContract(underlyingToken, "balanceOf(address)", {}, {type:'address',value: anytoken}, useAccount))
            labelArr.push({
              key: anytokenSource,
              label: 'balanceOf',
              dec: item.dec
            })
            // arr.push(window?.tronWeb?.transactionBuilder.triggerSmartContract(underlyingToken, "totalSupply()", {}, {}, useAccount))
            arr.push(window?.tronWeb?.contract(ABI_TO_ADDRESS, underlyingToken).totalSupply().call())
            labelArr.push({
              key: anytokenSource,
              label: 'totalSupply',
              dec: item.dec
            })
          }
          // console.log(item)
          // console.log(chainId)
          if (anytoken && isAddress(item.account, chainId)) {
            // arr.push(window?.tronWeb?.transactionBuilder.triggerSmartContract(anytoken, "balanceOf(address)", {}, {type:'address',value: item.account}, useAccount))
            arr.push(window?.tronWeb?.contract(ABI_TO_ADDRESS, anytoken).balanceOf(item.account).call())
            labelArr.push({
              key: anytokenSource,
              label: 'balance',
              dec: item.dec
            })
          }
        }
      }
      // console.log(arr)
      Promise.all(arr).then(res => {
        // console.log(res)
        const list:any = {}
        for (let i = 0, len = arr.length; i < len; i++) {
          const k = labelArr[i].key
          const l = labelArr[i].label
          // const dec = labelArr[i].dec
          if (!list[k]) list[k] = {}
          // list[k][l] = res[i] ? BigAmount.format(dec, res[i].toString()).toExact() : ''
          list[k][l] = res[i].toString()
        }
        // console.log(list)
        resolve(list)
      })
    })
  }, [])

  return {
    getTrxPoolDatas,
  }
}