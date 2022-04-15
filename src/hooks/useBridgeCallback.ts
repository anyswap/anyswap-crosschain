
import { Currency, JSBI, Fraction } from 'anyswap-sdk'
import { useMemo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { tryParseAmount, tryParseAmount1, tryParseAmount3 } from '../state/swap/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCurrencyBalance, useETHBalances } from '../state/wallet/hooks'
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../state/application/hooks'
// import { useAddPopup } from '../state/application/hooks'
import { useActiveWeb3React } from './index'
import { useBridgeContract, useSwapUnderlyingContract, useSwapBTCContract, useSwapETHContract } from './useContract'
// import {useSwapBTCABI, useSwapETHABI} from './useContract'
// import {signSwapoutData, signSwapinData} from 'multichain-bridge'
// import {signSwapoutData, signSwapinData} from './useBuildData'
import { isAddress } from '../utils'
import { useConnectedWallet, useWallet, ConnectType } from '@terra-money/wallet-provider'
// import { MsgSend } from '@terra-money/terra.js';
import {
  MsgSend,
  Coins,
  MsgExecuteContract,
  Fee,
  // LCDClient,
  // MsgTransfer,
  // Coin,
  // CreateTxOptions,
  // MnemonicKey
} from '@terra-money/terra.js'

import {useTerraSend} from './terra'

import {recordsTxns} from '../utils/bridge/register'
import config from '../config'
import { ChainId } from '../config/chainConfig/chainId'

import useTerraBalance from './useTerraBalance'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
  NOCONNECT
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * 跨链any token
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
export function useBridgeCallback(
  routerToken: string | undefined,
  inputCurrency: Currency | undefined,
  inputToken: string | undefined,
  toAddress:  string | undefined,
  typedValue: string | undefined,
  toChainID: string | undefined,
  version: string | undefined,
  selectCurrency: any
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<any>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const bridgeContract = useBridgeContract(routerToken)
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const { t } = useTranslation()
  // const balance = useCurrencyBalance(account ?? undefined, selectCurrency?.tokenType === "NATIVE" ? selectCurrency?.tokenType : inputCurrency)
  const ethbalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const anybalance = useCurrencyBalance(account ?? undefined, inputCurrency)
  const balance = selectCurrency?.tokenType === "NATIVE" ? ethbalance : anybalance
  // console.log(balance?.raw.toString(16))
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(routerToken)
    // console.log(inputToken)
    // console.log(selectCurrency)
    // console.log(bridgeContract)
    if (!bridgeContract || !chainId || !inputCurrency || !toAddress || !toChainID) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    // console.log(sufficientBalance)
    // console.log(inputAmount?.toExact())
    // console.log(balance?.toExact())
    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              const results:any = {}
              try {
                // console.log(bridgeContract)
                // console.log(inputAmount.raw.toString(16))
                const txReceipt = await bridgeContract.anySwapOut(
                  inputToken,
                  toAddress,
                  `0x${inputAmount.raw.toString(16)}`,
                  toChainID
                )
                addTransaction(txReceipt, {
                  summary: `Cross bridge ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, chainId)}`,
                  value: inputAmount.toSignificant(6),
                  toChainId: toChainID,
                  toAddress: toAddress?.toLowerCase(),
                  symbol: inputCurrency?.symbol,
                  version: version,
                  routerToken: routerToken,
                  token: inputCurrency?.address,
                  logoUrl: inputCurrency?.logoUrl,
                  underlying: inputCurrency?.underlying
                })
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account) {
                  const data = {
                    hash: txReceipt.hash?.toLowerCase(),
                    chainId: chainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.raw.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress?.toLowerCase(),
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version
                  }
                  recordsTxns(data)
                }
                results.hash = txReceipt?.hash
                onChangeViewDtil(txReceipt?.hash, true)
              } catch (error) {
                console.error('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
              return results
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, chainId, inputAmount, addTransaction, inputToken, toAddress, toChainID, version])
}


/**
 * 跨链underlying
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useBridgeUnderlyingCallback(
  routerToken: string | undefined,
  inputCurrency: Currency | undefined,
  inputToken: string | undefined,
  toAddress:  string | undefined,
  typedValue: string | undefined,
  toChainID: string | undefined,
  version: string | undefined,
  selectCurrency: any
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<any>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const bridgeContract = useBridgeContract(routerToken)
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const { t } = useTranslation()
  // const balance = useCurrencyBalance(account ?? undefined, selectCurrency?.tokenType === "NATIVE" ? selectCurrency?.tokenType : inputCurrency)
  const ethbalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const anybalance = useCurrencyBalance(account ?? undefined, inputCurrency)
  const balance = selectCurrency?.tokenType === "NATIVE" ? ethbalance : anybalance
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(inputCurrency)
    if (!bridgeContract || !chainId || !inputCurrency || !toAddress || !toChainID) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              const results:any = {}
              try {
                // console.log(bridgeContract)
                // console.log(inputAmount.raw.toString(16))
                // console.log(inputAmount.raw.toString())
                // console.log(inputAmount?.toSignificant(6))
                
                const txReceipt = await bridgeContract.anySwapOutUnderlying(
                  inputToken,
                  toAddress,
                  `0x${inputAmount.raw.toString(16)}`,
                  toChainID
                )
                console.log(txReceipt)
                addTransaction(txReceipt, {
                  summary: `Cross bridge ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, chainId)}`,
                  value: inputAmount.toSignificant(6),
                  toChainId: toChainID,
                  toAddress: toAddress?.toLowerCase(),
                  symbol: inputCurrency?.symbol,
                  version: version,
                  routerToken: routerToken,
                  token: inputCurrency?.address,
                  logoUrl: inputCurrency?.logoUrl,
                  underlying: inputCurrency?.underlying
                })
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account) {
                  const data = {
                    hash: txReceipt.hash?.toLowerCase(),
                    chainId: chainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.raw.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress?.toLowerCase(),
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version
                  }
                  recordsTxns(data)
                }
                results.hash = txReceipt?.hash
                onChangeViewDtil(txReceipt?.hash, true)
              } catch (error) {
                console.log('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
              return results
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, chainId, inputCurrency, inputAmount, balance, addTransaction, t, inputToken, toAddress, toChainID, version])
}



/**
 * 跨链native
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
export function useBridgeNativeCallback(
  routerToken: string | undefined,
  inputCurrency: Currency | undefined,
  inputToken: string | undefined,
  toAddress:  string | undefined,
  typedValue: string | undefined,
  toChainID: string | undefined,
  version: string | undefined,
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const bridgeContract = useBridgeContract(routerToken)
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const { t } = useTranslation()
  const balance = useETHBalances(account ? [account] : [])?.[account ?? '']
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(inputCurrency)
    // console.log(balance?.toSignificant(6))
    if (!bridgeContract || !chainId || !inputCurrency || !toAddress || !toChainID) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                // console.log(bridgeContract.anySwapOutNative)
                // console.log(inputAmount.raw.toString(16))
                const txReceipt = await bridgeContract.anySwapOutNative(
                  ...[inputToken,
                  toAddress,
                  toChainID],
                  {value: `0x${inputAmount.raw.toString(16)}`}
                )
                addTransaction(txReceipt, {
                  summary: `Cross bridge ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, chainId)}`,
                  value: inputAmount.toSignificant(6),
                  toChainId: toChainID,
                  toAddress: toAddress?.toLowerCase(),
                  symbol: inputCurrency?.symbol,
                  version: version,
                  routerToken: routerToken,
                  token: inputCurrency?.address,
                  logoUrl: inputCurrency?.logoUrl,
                  underlying: inputCurrency?.underlying
                })
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account) {
                  const data = {
                    hash: txReceipt.hash?.toLowerCase(),
                    chainId: chainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.raw.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress?.toLowerCase(),
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version
                  }
                  recordsTxns(data)
                }
                onChangeViewDtil(txReceipt?.hash, true)
              } catch (error) {
                console.error('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, chainId, inputCurrency, inputAmount, balance, addTransaction, t, inputToken, toAddress, toChainID, version, routerToken])
}

/**
 * any token 充值与提现underlying
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useSwapUnderlyingCallback(
  inputCurrency: Currency | undefined,
  inputToken: string | undefined,
  typedValue: string | undefined,
  swapType: string | undefined,
  selectCurrency: any
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const bridgeContract = useSwapUnderlyingContract(inputToken)
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const { t } = useTranslation()
  // const balance = useCurrencyBalance(account ?? undefined, selectCurrency?.tokenType === "NATIVE" ? selectCurrency?.tokenType : inputCurrency)
  const ethbalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const anybalance = useCurrencyBalance(account ?? undefined, inputCurrency)
  const balance = selectCurrency?.tokenType === "NATIVE" ? ethbalance : anybalance
  // console.log(balance?.raw.toString())
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(inputCurrency)
    if (!bridgeContract || !chainId || !inputCurrency || !swapType) return NOT_APPLICABLE
    // console.log(inputAmount?.raw.toString())

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    // console.log(sufficientBalance)
    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                // console.log(inputAmount.raw.toString(16))
                const txReceipt = swapType === 'deposit' ? await bridgeContract.deposit(
                  `0x${inputAmount.raw.toString(16)}`
                ) : await bridgeContract.withdraw(
                  `0x${inputAmount.raw.toString(16)}`
                )
                addTransaction(txReceipt, { summary: `${swapType === 'deposit' ? 'Deposit' : 'Withdraw'} ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, chainId)}` })
              } catch (error) {
                console.log('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, chainId, inputCurrency, inputAmount, balance, addTransaction, t, swapType, inputToken])
}


/**
 * any token 充值与提现native
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useSwapNativeCallback(
  routerToken: string | undefined,
  inputCurrency: Currency | undefined,
  inputToken: string | undefined,
  typedValue: string | undefined,
  swapType: string | undefined,
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const bridgeContract = useBridgeContract(routerToken)
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const { t } = useTranslation()
  const ethbalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const anybalance = useCurrencyBalance(account ?? undefined, inputCurrency)
  const balance = swapType === 'deposit' ? ethbalance : anybalance
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(routerToken)
    // console.log(bridgeContract)
    // console.log(chainId)
    // console.log(inputCurrency)
    // console.log(swapType)
    if (!bridgeContract || !chainId || !inputCurrency || !swapType) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    // console.log(sufficientBalance && inputAmount)
    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                // console.log(`0x${inputAmount.raw.toString(16)}`)
                const v = {value: `0x${inputAmount.raw.toString(16)}`}
                // console.log(v)
                // console.log([inputToken, account])
                const txReceipt = swapType === 'deposit' ? await bridgeContract.depositNative(
                  ...[inputToken, account],
                  v
                ) : await bridgeContract.withdrawNative(
                  inputToken,
                  `0x${inputAmount.raw.toString(16)}`,
                  account
                )
                addTransaction(txReceipt, { summary: `${swapType === 'deposit' ? 'Deposit' : 'Withdraw'} ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, chainId)}` })
              } catch (error) {
                console.log('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, chainId, inputCurrency, inputAmount, balance, addTransaction, t, inputToken, account])
}


/**
 * 跨链交易 native swap to native
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useBridgeSwapNativeCallback(
  routerToken: string | undefined,
  inputCurrency: Currency | undefined,
  toAddress:  string | null | undefined,
  typedValue: string | undefined,
  toChainID: string | undefined,
  deadline: number | undefined,
  outputAmount: string | undefined,
  routerPath: any,
  isUnderlying: any,
  version: any
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const bridgeContract = useBridgeContract(routerToken)
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const { t } = useTranslation()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(inputCurrency)
    if (!bridgeContract || !chainId || !inputCurrency || !toAddress || !toChainID || !deadline || !outputAmount || !routerPath || routerPath.length <= 0) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                // console.log(`0x${inputAmount.raw.toString(16)}`)
                // console.log(inputAmount.raw.toString())
                // console.log(outputAmount)
                // console.log(routerPath)
                // console.log(toAddress)
                // console.log(parseInt((Date.now()/1000 + deadline).toString()))
                // console.log(toChainID)
                const txType = isUnderlying ? 'anySwapOutExactTokensForNativeUnderlying' : 'anySwapOutExactTokensForNative'
                // console.log(txType)
                // const txReceipt = await bridgeContract.anySwapOutExactTokensForNative(
                const txReceipt = await bridgeContract[txType](
                  `0x${inputAmount.raw.toString(16)}`,
                  outputAmount,
                  routerPath,
                  toAddress,
                  parseInt((Date.now()/1000 + deadline).toString()),
                  toChainID
                )
                addTransaction(txReceipt, {
                  summary: `Cross bridge txns ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, chainId)}`,
                  value: inputAmount.toSignificant(6),
                  toChainId: toChainID,
                  toAddress: toAddress?.toLowerCase(),
                  symbol: inputCurrency?.symbol,
                  version: version,
                  routerToken: routerToken,
                  token: inputCurrency?.address,
                  logoUrl: inputCurrency?.logoUrl,
                  underlying: inputCurrency?.underlying
                })
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account) {
                  const data = {
                    hash: txReceipt.hash?.toLowerCase(),
                    chainId: chainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.raw.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress?.toLowerCase(),
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version
                  }
                  recordsTxns(data)
                }
                onChangeViewDtil(txReceipt?.hash, true)
              } catch (error) {
                console.log('Could not swapout', error)
                onChangeViewErrorTip(error,true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, chainId, inputCurrency, inputAmount, balance, addTransaction, t, outputAmount, routerPath, toAddress, deadline, toChainID])
}

/**
 * 跨链交易native swap to underlying
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useBridgeSwapUnderlyingCallback(
  routerToken: string | undefined,
  inputCurrency: Currency | undefined,
  toAddress:  string | null | undefined,
  typedValue: string | undefined,
  toChainID: string | undefined,
  deadline: number | undefined,
  outputAmount: string | undefined,
  routerPath: any,
  isUnderlying: any,
  version: any,
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { chainId, account } = useActiveWeb3React()
  const bridgeContract = useBridgeContract(routerToken)
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const { t } = useTranslation()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(inputCurrency)
    if (!bridgeContract || !chainId || !inputCurrency || !toAddress || !toChainID || !deadline || !outputAmount || !routerPath || routerPath.length <= 0) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    // console.log(sufficientBalance)
    // console.log(inputAmount)
    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                console.log(`${inputAmount.raw.toString()}`)
                // console.log(outputAmount)
                // console.log(routerPath)
                // console.log(toAddress)
                // console.log(parseInt((Date.now()/1000 + deadline).toString()))
                // console.log(toChainID)
                // const txReceipt = await bridgeContract.anySwapOutExactTokensForNativeUnderlying(
                const txType = isUnderlying ? 'anySwapOutExactTokensForTokensUnderlying' : 'anySwapOutExactTokensForTokens'
                const txReceipt = await bridgeContract[txType](
                  `0x${inputAmount.raw.toString(16)}`,
                  outputAmount,
                  routerPath,
                  toAddress,
                  parseInt((Date.now()/1000 + deadline).toString()),
                  toChainID
                )
                addTransaction(txReceipt, {
                  summary: `Cross bridge txns ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, chainId)}`,
                  value: inputAmount.toSignificant(6),
                  toChainId: toChainID,
                  toAddress: toAddress?.toLowerCase(),
                  symbol: inputCurrency?.symbol,
                  version: version,
                  routerToken: routerToken,
                  token: inputCurrency?.address,
                  logoUrl: inputCurrency?.logoUrl,
                  underlying: inputCurrency?.underlying
                })
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account) {
                  const data = {
                    hash: txReceipt.hash?.toLowerCase(),
                    chainId: chainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.raw.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress?.toLowerCase(),
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version
                  }
                  recordsTxns(data)
                }
                onChangeViewDtil(txReceipt?.hash, true)
              } catch (error) {
                console.log('Could not swapout', error)
                onChangeViewErrorTip(error,true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, chainId, inputCurrency, inputAmount, balance, addTransaction, t, outputAmount, routerPath, toAddress, deadline, toChainID])
}


/**
 * 跨链桥
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useCrossBridgeCallback(
  inputCurrency: Currency | undefined,
  toAddress:  string | undefined,
  typedValue: string | undefined,
  toChainID: any,
  txnsType: string | undefined,
  inputToken: string | undefined,
  pairid: string | undefined,
  receiveAddress?: string | undefined,
  selectCurrency?: any,
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const { chainId, account, library } = useActiveWeb3React()
  const { t } = useTranslation()
  // const balance = inputCurrency ? useCurrencyBalance(account ?? undefined, inputCurrency) : useETHBalances(account ? [account] : [])?.[account ?? '']
  const tokenBalance = useCurrencyBalance(account ?? undefined, inputCurrency)
  const ethBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const balance = inputCurrency && selectCurrency?.tokenType !== 'NATIVE' ? tokenBalance : ethBalance
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => inputCurrency ? tryParseAmount(typedValue, inputCurrency) : tryParseAmount1(typedValue, 18), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  const contractBTC = useSwapBTCContract(isAddress(inputToken) ? inputToken : undefined)
  const contractETH = useSwapETHContract(isAddress(inputToken) ? inputToken : undefined)
  return useMemo(() => {
    // console.log(inputToken)
    if (
      !chainId
      || !toAddress
      || !toChainID
      || !library
      || !receiveAddress
    ) return NOT_APPLICABLE
    // console.log(typedValue)
    // console.log(toChainID)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    // console.log(inputAmount?.raw?.toString())
    // console.log(sufficientBalance)
    const symbol = inputCurrency?.symbol ?? selectCurrency?.symbol
    return {
      wrapType: WrapType.WRAP,
      execute:
        sufficientBalance && inputAmount
          ? async () => {
              try {
                console.log(txnsType)
                let txReceipt:any
                if (txnsType === 'swapin') {
                  if (isAddress(inputToken) && selectCurrency?.tokenType !== 'NATIVE') {
                    if (contractETH) {
                      txReceipt = await contractETH.transfer(toAddress, `0x${inputAmount.raw.toString(16)}`)
                    } else {
                      return
                    }
                  } else {
                    const data:any = {
                      from: account,
                      to: toAddress,
                      value: `0x${inputAmount.raw.toString(16)}`,
                    }
                    const hash = await library.send('eth_sendTransaction', [data])
                    txReceipt = hash && hash.toString().indexOf('0x') === 0 ? {hash} : ''
                  }
                } else {
                  console.log(toChainID)
                  if (toChainID && isNaN(toChainID)) {
                    if (contractBTC) {
                      txReceipt = await contractBTC.Swapout(`0x${inputAmount.raw.toString(16)}`, toAddress)
                    } else {
                      return
                    }
                  } else {
                    if (contractETH) {
                      txReceipt = await contractETH.Swapout(`0x${inputAmount.raw.toString(16)}`, toAddress)
                    } else {
                      return
                    }
                  }
                }
                console.log(txReceipt)
                const txData:any = {hash: txReceipt?.hash}
                if (txData.hash && account) {
                  // addTransaction(txData, { summary: `Cross bridge ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, chainId)}` })
                  addTransaction(txData, {
                    summary: `Cross bridge ${inputAmount.toSignificant(6)} ${config.getBaseCoin(symbol, chainId)}`,
                    value: inputAmount.toSignificant(6),
                    toChainId: toChainID,
                    toAddress: receiveAddress?.toLowerCase(),
                    symbol: symbol,
                    version: txnsType,
                    routerToken: '',
                    token: inputCurrency?.address,
                    logoUrl: inputCurrency?.logoUrl,
                    underlying: inputCurrency?.underlying
                  })
                  let srcChainID = chainId
                  let destChainID = toChainID
                  if (toChainID === ChainId.TERRA && txnsType === 'swapout') {
                    srcChainID = toChainID
                    destChainID = chainId
                  }
                  const rdata = {
                    hash: txData.hash,
                    chainId: srcChainID,
                    selectChain: destChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.raw.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: receiveAddress,
                    symbol: '',
                    version: txnsType,
                    pairid: pairid
                  }
                  recordsTxns(rdata)
                  onChangeViewDtil(txData?.hash, true)
                }
              } catch (error) {
                console.log('Could not swapout', error)
                onChangeViewErrorTip(error,true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: symbol})
    }
  }, [chainId, inputCurrency, inputAmount, balance, addTransaction, t, txnsType, toAddress, inputToken, toChainID, pairid, library, receiveAddress])
}

/**
 * 跨链桥
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useTerraCrossBridgeCallback(
  inputCurrency: Currency | undefined,
  toAddress:  string,
  typedValue: string | undefined,
  toChainID: any,
  inputToken: string | undefined,
  pairid: string | undefined,
  terraRecipient: string | undefined,
  Unit: any,
  srcChainid: string | undefined,
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { 
  wrapType: WrapType;
  onConnect?: undefined | (() => Promise<void>);
  balance?: any,
  execute?: undefined | (() => Promise<void>);
  inputError?: string 
} {
  const { chainId, account } = useActiveWeb3React()
  const { t } = useTranslation()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const connectedWallet = useConnectedWallet()
  const addTransaction = useTransactionAdder()
  const { post, connect } = useWallet()
  // const addPopup = useAddPopup()
  const {getTerraBalances} = useTerraBalance()

  const {getTerraFeeList} = useTerraSend()

  const useNnit = Unit ? Unit : 'uluna'
  // const useNnit = Unit ? Unit : 'uusd'
  const terraToken = inputCurrency?.address?.indexOf('terra') === 0 ? inputCurrency?.address : useNnit
  // const terraToken = inputCurrency?.address?.indexOf('terra') === 0 ? 'terra1jsaghv4tsltlk4ka6u3pg0msccdz0xsz0vkhcg' : Unit
  // console.log(inputCurrency)
  // console.log(connectedWallet)
  const [balance, setBalance] = useState<any>()
  const [fee, setFee] = useState<any>()

  
  // console.log(balance)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => inputCurrency ? tryParseAmount3(typedValue, inputCurrency?.decimals) : undefined, [inputCurrency, typedValue])
  // console.log(inputCurrency)
  // console.log(inputAmount?.toSignificant(6))
  // console.log(tryParseAmount3(typedValue, inputCurrency?.decimals)?.toSignificant(6))

  useEffect(() => {
    // console.log(connectedWallet)
    if (
      connectedWallet?.walletAddress
      && toAddress
      && useNnit
      && inputAmount
    ) {
      // console.log(inputAmount)
      getTerraFeeList(
        connectedWallet?.walletAddress,
        toAddress,
        useNnit,
        inputAmount
      ).then((res) => {
        console.log(res)
        let fee:any = ''
        let tax:any = ''
        let lunaFee:any = ''
        res.map((item:any) => {
          if (item.denom === useNnit) {
            fee = item.fee
            tax = item.tax
          }
          if (item.denom === 'uluna') {
            lunaFee = item.fee
          }
        })
        if (!fee) {
          fee = lunaFee
        }
        const txFee =
          tax?.amount.greaterThan(0) && fee
            ? new Fee(fee.gas, fee.amount.add(tax))
            : fee
        // console.log(fee)
        // console.log(txFee)
        // setFee(fee.gas * 100)
        setFee(txFee)
      })
    }
  }, [connectedWallet, toAddress, useNnit, inputAmount])

  const fetchBalance = useCallback(() => {
    if (terraToken && connectedWallet) {
      // console.log(terraToken)
      getTerraBalances({terraWhiteList: [{
        token: terraToken
      }]}).then((res:any) => {
        // console.log(res)
        const bl:any = res[terraToken] && inputCurrency ? new Fraction(JSBI.BigInt(res[terraToken]), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(inputCurrency?.decimals))) : undefined
        // console.log(bl)
        // console.log(bl?.toSignificant(inputCurrency?.decimals))
        // if (bl?.toSignificant(inputCurrency?.decimals) === '0') {
        //   setBalance(new Fraction(JSBI.BigInt(100000000000), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(6))))
        // } else {
        //   setBalance(bl)
        // }
        setBalance(bl)
      })
    } else {
      setBalance('')
    }
  }, [terraToken, connectedWallet])
  useEffect(() => {
    fetchBalance()
  }, [useNnit, fetchBalance])


  const sendTx = useCallback(() => {
    // console.log(connectedWallet)
    if (
      !connectedWallet
      || !inputAmount
      || ConnectType.CHROME_EXTENSION !== connectedWallet.connectType
      || !terraRecipient
      || !terraToken
      || !fee
    ) return
    const send:any = terraToken.indexOf('terra') === 0 ? 
      new MsgExecuteContract(
        connectedWallet?.walletAddress,
        terraToken,
        { transfer: { amount: inputAmount, recipient: toAddress } },
        new Coins([])
      )
     :
     new MsgSend(
      connectedWallet?.walletAddress,
      toAddress,
      { [terraToken]: 	inputAmount }
      )
    
    const gasFee:any = fee
    
    return post({
      msgs: [send],
      fee: gasFee,
      memo: terraRecipient,
    })
  }, [connectedWallet, inputAmount, toAddress, terraRecipient, terraToken, fee])

  return useMemo(() => {
    // console.log(balance && balance?.toSignificant(inputCurrency?.decimals))
    if (!chainId || !toAddress || !toChainID || !inputAmount || !inputCurrency) {
      if (balance) {
        return {
          ...NOT_APPLICABLE,
          balance
        }
      }
      return NOT_APPLICABLE
    }
    // console.log(typedValue)
    let sufficientBalance = false
    try {
      sufficientBalance = inputCurrency && typedValue && balance && (Number(balance?.toSignificant(inputCurrency?.decimals)) > Number(typedValue))
    } catch (error) {
      console.log(error)
    }
    // sufficientBalance = true
    // const sufficientBalance = true
    // console.log(sufficientBalance)
    return {
      wrapType: !connectedWallet ? WrapType.NOCONNECT : WrapType.WRAP,
      onConnect: async () => {
        connect(ConnectType.CHROME_EXTENSION)
      },
      balance,
      execute:
        inputAmount
          ? async () => {
              try {
                // console.log(12)
                const txReceipt:any = await sendTx()
                console.log(txReceipt)
                if (txReceipt) {
                  const hash = txReceipt?.result?.txhash
                  const txData:any = {hash: hash}
                  addTransaction(txData, {
                    summary: `Cross bridge ${typedValue} ${config.getBaseCoin(inputCurrency?.symbol, chainId)}`,
                    value: typedValue,
                    toChainId: toChainID,
                    toAddress: terraRecipient?.toLowerCase(),
                    symbol: inputCurrency?.symbol,
                    version: 'swapin',
                    routerToken: '',
                    token: inputCurrency?.address,
                    logoUrl: inputCurrency?.logoUrl,
                    underlying: inputCurrency?.underlying
                  })
                  if (txData.hash && account && terraRecipient) {
                    const data:any = {
                      hash: txData.hash?.toLowerCase(),
                      chainId: srcChainid,
                      selectChain: toChainID,
                      account: connectedWallet?.walletAddress,
                      value: inputAmount,
                      formatvalue: typedValue,
                      to: terraRecipient,
                      symbol: inputCurrency?.symbol,
                      version: 'swapin',
                      pairid: pairid,
                    }
                    recordsTxns(data)
                  }
                  onChangeViewDtil(txData?.hash, true)
                }
              } catch (error) {
                // const err:any = error
                // if (err) {
                //   // console.log(err)
                //   alert(err.toString())
                // }
                console.log('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
            }
          : undefined,
        inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [chainId, inputCurrency, inputAmount, t, toAddress, inputToken, toChainID, terraRecipient, connectedWallet, pairid, srcChainid, balance, sendTx])
}