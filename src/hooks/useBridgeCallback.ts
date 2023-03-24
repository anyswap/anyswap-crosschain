
import { useMemo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { tryParseAmount, tryParseAmount1, tryParseAmount3 } from '../state/swap/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCurrencyBalance, useETHBalances, useIsGnosisSafeWallet } from '../state/wallet/hooks'
import {useTxnsDtilOpen, useTxnsErrorTipOpen} from '../state/application/hooks'
// import { useAddPopup } from '../state/application/hooks'
import { useActiveWeb3React } from './index'
import {useActiveReact} from './useActiveReact'
import {
  useBridgeContract,
  useSwapUnderlyingContract,
  useSwapBTCContract,
  useSwapETHContract,
  usePermissonlessContract,
  useAnycallContract
} from './useContract'
import { isAddress } from '../utils/isAddress'
import { useConnectedWallet, useWallet, ConnectType } from '@terra-money/wallet-provider'
// const { useConnectedWallet, useWallet, ConnectType } = require('@terra-money/wallet-provider')
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

import {useTerraSend} from '../nonevm/terra'

import {recordsTxns} from '../utils/bridge/register'
import config from '../config'
// import {VALID_BALANCE} from '../config/constant'
import { ChainId } from '../config/chainConfig/chainId'

import useTerraBalance from './useTerraBalance'
import { BigAmount } from '../utils/formatBignumber'

import {
  // useDarkModeManager,
  // useExpertModeManager,
  // useInterfaceModeManager,
  useInterfaceBalanceValidManager
  // useUserTransactionTTL,
  // useUserSlippageTolerance
} from '../state/user/hooks'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
  NOCONNECT
}

function useVersion (chainId:any, toChainID:any, version:any) {
  // console.log(version)
  if (
    version?.indexOf('STABLE') === 0
    || version?.indexOf('UNDERLYING') === 0
    || version?.indexOf('NATIVE') === 0
  ) {
    if (
      [ChainId.AURORA].includes(chainId?.toString())
      || (toChainID && isNaN(toChainID))
    ) {
      return 'v2'
    }
    return ''
  }
  // if (
  //   [ChainId.AURORA].includes(chainId?.toString())
  //   || (toChainID && isNaN(toChainID))
  // ) {
  //   console.log(version)
  //   return 'v2'
  // }
  return 'v2'
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }

export function usePermissonlessCallback(
  routerToken: string | undefined,
  inputCurrency: any | undefined,
  inputToken: string | undefined,
  toAddress:  string | undefined,
  typedValue: string | undefined,
  toChainID: any,
  version: string | undefined,
  selectCurrency: any,
  isLiquidity: any,
  destConfig: any,
  usePoolType?: any,
): { fee?: any; wrapType: WrapType; execute?: undefined | (() => Promise<any>); inputError?: string } {
  const { account, evmChainId } = useActiveReact()
  const bridgeContract = usePermissonlessContract(isAddress(routerToken, evmChainId))
  const anycallContract = useAnycallContract(destConfig?.anycall)
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const {isGnosisSafeWallet} = useIsGnosisSafeWallet()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()
  const { t } = useTranslation()
  // console.log(inputCurrency)
  const useAccount:any = isAddress(account, evmChainId)
  const ethbalance = useETHBalances(useAccount ? [useAccount] : [])?.[account ?? '']
  const anybalance = useCurrencyBalance(useAccount ?? undefined, inputCurrency)
  let balance = selectCurrency?.tokenType === "NATIVE" ? ethbalance : anybalance
  if (usePoolType && usePoolType === 'withdraw') {
    balance = anybalance
  }
  // console.log(balance?.raw.toString(16))
  // 我们总是可以解析输入货币的金额，因为包装是1:1

  const [fee, setFee] = useState<any>()
  const [appid, setAppid] = useState<any>()

  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()

  const getAppId = useCallback(() => {
    if (routerToken && anycallContract) {
      anycallContract.appIdentifier(routerToken).then((res:any) => {
        console.log(res)
        setAppid(res)
      }).catch((error:any) => {
        console.log(error)
        setAppid('')
      })
    }
  }, [anycallContract, routerToken])

  useEffect(() => {
    getAppId()
  }, [anycallContract, routerToken])

  const getFee = useCallback(() => {
    if (anycallContract && destConfig?.type === 'PERMISSONLESS') {
      anycallContract.calcSrcFees(appid ? appid : '', destConfig?.chainId, 196).then((res:any) => {
        console.log(res.toString())
        if (res) {
          setFee(res.toString())
        }
      }).catch((error:any) => {
        console.log(error)
        setFee('')
      })
    }
  }, [anycallContract, destConfig, appid])

  useEffect(() => {
    getFee()
  }, [anycallContract, destConfig, appid])

  

  return useMemo(() => {
    // console.log(routerToken)
    // console.log(inputToken)
    // console.log(selectCurrency)
    // console.log(bridgeContract)
    if (!bridgeContract || !evmChainId || !inputCurrency || !toAddress || !toChainID) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    // console.log(sufficientBalance)
    // console.log(inputAmount?.toExact())
    // console.log(balance?.toExact())
    return {
      fee,
      wrapType: WrapType.WRAP,
      execute:
        (sufficientBalance || !userInterfaceBalanceValid) && inputAmount
          ? async () => {
              const results:any = {}
              try {
                // console.log(toAddress)
                // console.log(routerToken)
                // console.log(inputToken)
                // console.log(toChainID)
                // console.log(bridgeContract)
                // console.log(destConfig?.chainId)
                // console.log(inputAmount.raw.toString(16))
                const txReceipt = await bridgeContract.swapout(
                  ...[inputToken,
                  `0x${inputAmount.raw.toString(16)}`,
                  toAddress,
                  destConfig?.chainId,
                  2],
                  {value: fee}
                )
                addTransaction(txReceipt, {
                  summary: `Cross bridge ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, evmChainId)}`,
                  value: inputAmount.toSignificant(6),
                  toChainId: toChainID,
                  toAddress: toAddress.indexOf('0x') === 0 ? toAddress?.toLowerCase() : toAddress,
                  symbol: inputCurrency?.symbol,
                  version: version,
                  routerToken: routerToken,
                  token: inputCurrency?.address,
                  logoUrl: inputCurrency?.logoUrl,
                  isLiquidity: isLiquidity,
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
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account && !isGnosisSafeWallet) {
                  const data = {
                    hash: txReceipt.hash.indexOf('0x') === 0 ? txReceipt.hash?.toLowerCase() : txReceipt.hash,
                    chainId: evmChainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.raw.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress.indexOf('0x') === 0 ? toAddress?.toLowerCase() : toAddress,
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version
                  }
                  recordsTxns(data)
                  results.hash = txReceipt?.hash
                  onChangeViewDtil(txReceipt?.hash, true)
                }
              } catch (error) {
                console.error('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
              return results
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, evmChainId, inputAmount, addTransaction, inputToken, toAddress, toChainID, version, isLiquidity, destConfig, isGnosisSafeWallet, fee, userInterfaceBalanceValid])
}



/**
 * 跨链any token
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
export function useBridgeCallback(
  routerToken: string | undefined,
  inputCurrency: any | undefined,
  inputToken: string | undefined,
  toAddress:  string | undefined,
  typedValue: string | undefined,
  toChainID: any,
  version: string | undefined,
  selectCurrency: any,
  isLiquidity: any,
  destConfig: any,
  usePoolType?: any,
): { wrapType: WrapType; execute?: undefined | (() => Promise<any>); inputError?: string } {
  const { account, evmChainId } = useActiveReact()
  const bridgeContract = useBridgeContract(isAddress(routerToken, evmChainId), useVersion(evmChainId, toChainID, destConfig?.type))
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const {isGnosisSafeWallet} = useIsGnosisSafeWallet()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()
  const { t } = useTranslation()
  // console.log(inputCurrency)
  const useAccount:any = isAddress(account, evmChainId)
  const ethbalance = useETHBalances(useAccount ? [useAccount] : [])?.[account ?? '']
  const anybalance = useCurrencyBalance(useAccount ?? undefined, inputCurrency)
  let balance = selectCurrency?.tokenType === "NATIVE" ? ethbalance : anybalance
  if (usePoolType && usePoolType === 'withdraw') {
    balance = anybalance
  }
  // console.log(balance?.raw.toString(16))
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(routerToken)
    // console.log(inputToken)
    // console.log(selectCurrency)
    // console.log(bridgeContract)
    if (!bridgeContract || !evmChainId || !inputCurrency || !toAddress || !toChainID) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    // console.log(sufficientBalance)
    // console.log(inputAmount?.toExact())
    // console.log(balance?.toExact())
    return {
      wrapType: WrapType.WRAP,
      execute:
        (sufficientBalance || !userInterfaceBalanceValid) && inputAmount
          ? async () => {
              const results:any = {}
              try {
                // console.log(toAddress)
                // console.log(routerToken)
                // console.log(inputToken)
                // console.log(toChainID)
                // console.log(bridgeContract)
                // console.log(destConfig?.chainId)
                // console.log(inputAmount.raw.toString(16))
                const txReceipt = await bridgeContract.anySwapOut(
                  inputToken,
                  toAddress,
                  `0x${inputAmount.raw.toString(16)}`,
                  destConfig?.chainId
                )
                addTransaction(txReceipt, {
                  summary: `Cross bridge ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, evmChainId)}`,
                  value: inputAmount.toSignificant(6),
                  toChainId: toChainID,
                  toAddress: toAddress.indexOf('0x') === 0 ? toAddress?.toLowerCase() : toAddress,
                  symbol: inputCurrency?.symbol,
                  version: version,
                  routerToken: routerToken,
                  token: inputCurrency?.address,
                  logoUrl: inputCurrency?.logoUrl,
                  isLiquidity: isLiquidity,
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
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account && !isGnosisSafeWallet) {
                  const data = {
                    hash: txReceipt.hash.indexOf('0x') === 0 ? txReceipt.hash?.toLowerCase() : txReceipt.hash,
                    chainId: evmChainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.raw.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress.indexOf('0x') === 0 ? toAddress?.toLowerCase() : toAddress,
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version
                  }
                  recordsTxns(data)
                  results.hash = txReceipt?.hash
                  onChangeViewDtil(txReceipt?.hash, true)
                }
              } catch (error) {
                console.error('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
              return results
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, evmChainId, inputAmount, addTransaction, inputToken, toAddress, toChainID, version, isLiquidity, destConfig, isGnosisSafeWallet, userInterfaceBalanceValid])
}


/**
 * 跨链underlying
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useBridgeUnderlyingCallback(
  routerToken: string | undefined,
  inputCurrency: any | undefined,
  inputToken: string | undefined,
  toAddress:  string | undefined,
  typedValue: string | undefined,
  toChainID: any,
  version: string | undefined,
  selectCurrency: any,
  isLiquidity: any,
  destConfig: any,
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<any>); inputError?: string } {
  const { account, evmChainId } = useActiveReact()
  const bridgeContract = useBridgeContract(isAddress(routerToken, evmChainId), useVersion(evmChainId, toChainID, destConfig?.type))
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const {isGnosisSafeWallet} = useIsGnosisSafeWallet()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()
  const { t } = useTranslation()
  const useAccount:any = isAddress(account, evmChainId)
  const ethbalance = useETHBalances(useAccount ? [useAccount] : [])?.[account ?? '']
  const anybalance = useCurrencyBalance(useAccount ?? undefined, inputCurrency)
  const balance = selectCurrency?.tokenType === "NATIVE" ? ethbalance : anybalance
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(inputCurrency)
    if (!bridgeContract || !evmChainId || !inputCurrency || !toAddress || !toChainID) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    return {
      wrapType: WrapType.WRAP,
      execute:
      (sufficientBalance || !userInterfaceBalanceValid) && inputAmount
          ? async () => {
              const results:any = {}
              try {
                // console.log(inputAmount.raw.toString(16))
                // console.log(inputAmount.raw.toString())
                // console.log(inputAmount?.toSignificant(6))
                
                const txReceipt = await bridgeContract.anySwapOutUnderlying(
                  inputToken,
                  toAddress,
                  `0x${inputAmount.raw.toString(16)}`,
                  destConfig?.chainId
                )
                console.log(txReceipt)
                addTransaction(txReceipt, {
                  summary: `Cross bridge ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, evmChainId)}`,
                  value: inputAmount.toSignificant(6),
                  toChainId: toChainID,
                  toAddress: toAddress.indexOf('0x') === 0 ? toAddress?.toLowerCase() : toAddress,
                  symbol: inputCurrency?.symbol,
                  version: version,
                  routerToken: routerToken,
                  token: inputCurrency?.address,
                  logoUrl: inputCurrency?.logoUrl,
                  isLiquidity: isLiquidity,
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
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account && !isGnosisSafeWallet) {
                  const data = {
                    hash: txReceipt.hash.indexOf('0x') === 0 ? txReceipt.hash?.toLowerCase() : txReceipt.hash,
                    chainId: evmChainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.raw.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress.indexOf('0x') === 0 ? toAddress?.toLowerCase() : toAddress,
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version
                  }
                  recordsTxns(data)
                  results.hash = txReceipt?.hash
                  onChangeViewDtil(txReceipt?.hash, true)
                }
              } catch (error) {
                console.log('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
              return results
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, evmChainId, inputCurrency, inputAmount, balance, addTransaction, t, inputToken, toAddress, toChainID, version, isLiquidity, destConfig, isGnosisSafeWallet,userInterfaceBalanceValid])
}



/**
 * 跨链native
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
export function useBridgeNativeCallback(
  routerToken: string | undefined,
  inputCurrency: any | undefined,
  inputToken: string | undefined,
  toAddress:  string | undefined,
  typedValue: string | undefined,
  toChainID: any,
  version: string | undefined,
  isLiquidity: any,
  destConfig: any,
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { account, evmChainId } = useActiveReact()
  const bridgeContract = useBridgeContract(isAddress(routerToken, evmChainId), useVersion(evmChainId, toChainID, destConfig?.type))
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const {isGnosisSafeWallet} = useIsGnosisSafeWallet()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()
  const { t } = useTranslation()
  const useAccount:any = isAddress(account, evmChainId)
  const balance = useETHBalances(useAccount ? [useAccount] : [])?.[account ?? '']
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(inputCurrency)
    // console.log(balance?.toSignificant(6))
    if (!bridgeContract || !evmChainId || !inputCurrency || !toAddress || !toChainID) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    return {
      wrapType: WrapType.WRAP,
      execute:
      (sufficientBalance || !userInterfaceBalanceValid) && inputAmount
          ? async () => {
              try {
                // console.log(bridgeContract.anySwapOutNative)
                // console.log(inputAmount.raw.toString(16))
                const txReceipt = await bridgeContract.anySwapOutNative(
                  ...[inputToken,
                  toAddress,
                  destConfig.chainId],
                  {value: `0x${inputAmount.raw.toString(16)}`}
                )
                addTransaction(txReceipt, {
                  summary: `Cross bridge ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, evmChainId)}`,
                  value: inputAmount.toSignificant(6),
                  toChainId: toChainID,
                  toAddress: toAddress.indexOf('0x') === 0 ? toAddress?.toLowerCase() : toAddress,
                  symbol: inputCurrency?.symbol,
                  version: version,
                  routerToken: routerToken,
                  token: inputCurrency?.address,
                  logoUrl: inputCurrency?.logoUrl,
                  isLiquidity: isLiquidity,
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
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account && !isGnosisSafeWallet) {
                  const data = {
                    hash: txReceipt.hash.indexOf('0x') === 0 ? txReceipt.hash?.toLowerCase() : txReceipt.hash,
                    chainId: evmChainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.raw.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress.indexOf('0x') === 0 ? toAddress?.toLowerCase() : toAddress,
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version
                  }
                  recordsTxns(data)
                  onChangeViewDtil(txReceipt?.hash, true)
                }
              } catch (error) {
                console.error('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, evmChainId, inputCurrency, inputAmount, balance, addTransaction, t, inputToken, toAddress, toChainID, version, routerToken, isLiquidity, destConfig, isGnosisSafeWallet, userInterfaceBalanceValid])
}

/**
 * any token 充值与提现underlying
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useSwapUnderlyingCallback(
  inputCurrency: any | undefined,
  inputToken: string | undefined,
  typedValue: string | undefined,
  swapType: string | undefined,
  selectCurrency: any
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { account, evmChainId } = useActiveReact()
  const bridgeContract = useSwapUnderlyingContract(isAddress(inputToken, evmChainId))
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()
  const { t } = useTranslation()
  const useAccount:any = isAddress(account, evmChainId)
  const ethbalance = useETHBalances(useAccount ? [useAccount] : [])?.[account ?? '']
  const anybalance = useCurrencyBalance(useAccount ?? undefined, inputCurrency)
  const balance = selectCurrency?.tokenType === "NATIVE" ? ethbalance : anybalance
  // console.log(balance?.raw.toString())
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(inputCurrency)
    if (!bridgeContract || !evmChainId || !inputCurrency || !swapType) return NOT_APPLICABLE
    // console.log(inputAmount?.raw.toString())

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    // console.log(sufficientBalance)
    return {
      wrapType: WrapType.WRAP,
      execute:
      (sufficientBalance || !userInterfaceBalanceValid) && inputAmount
          ? async () => {
              try {
                // console.log(inputAmount.raw.toString(16))
                const txReceipt = swapType === 'deposit' ? await bridgeContract.deposit(
                  `0x${inputAmount.raw.toString(16)}`
                ) : await bridgeContract.withdraw(
                  `0x${inputAmount.raw.toString(16)}`
                )
                addTransaction(txReceipt, { summary: `${swapType === 'deposit' ? 'Deposit' : 'Withdraw'} ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, evmChainId)}` })
              } catch (error) {
                console.log('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, evmChainId, inputCurrency, inputAmount, balance, addTransaction, t, swapType, inputToken, userInterfaceBalanceValid])
}


/**
 * any token 充值与提现native
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useSwapNativeCallback(
  routerToken: string | undefined,
  inputCurrency: any | undefined,
  inputToken: string | undefined,
  typedValue: string | undefined,
  swapType: string | undefined,
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { account, evmChainId } = useActiveReact()
  const bridgeContract = useBridgeContract(isAddress(routerToken, evmChainId))
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()
  const { t } = useTranslation()
  const useAccount:any = isAddress(account, evmChainId)
  const ethbalance = useETHBalances(useAccount ? [useAccount] : [])?.[account ?? '']
  const anybalance = useCurrencyBalance(useAccount ?? undefined, inputCurrency)
  const balance = swapType === 'deposit' ? ethbalance : anybalance
  // console.log(balance)
  // console.log(anybalance)
  // console.log(inputCurrency)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(routerToken)
    // console.log(bridgeContract)
    // console.log(chainId)
    // console.log(inputCurrency)
    // console.log(inputToken)
    if (!bridgeContract || !evmChainId || !inputCurrency || !swapType) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    // console.log(sufficientBalance && inputAmount)
    return {
      wrapType: WrapType.WRAP,
      execute:
      (sufficientBalance || !userInterfaceBalanceValid) && inputAmount
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
                addTransaction(txReceipt, { summary: `${swapType === 'deposit' ? 'Deposit' : 'Withdraw'} ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, evmChainId)}` })
              } catch (error) {
                console.log('Could not swapout', error)
                onChangeViewErrorTip(error, true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, evmChainId, inputCurrency, inputAmount, balance, addTransaction, t, inputToken, account, userInterfaceBalanceValid])
}


/**
 * 跨链交易 native swap to native
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useBridgeSwapNativeCallback(
  routerToken: string | undefined,
  inputCurrency: any | undefined,
  toAddress:  string | null | undefined,
  typedValue: string | undefined,
  toChainID: any,
  deadline: number | undefined,
  outputAmount: string | undefined,
  routerPath: any,
  isUnderlying: any,
  version: any,
  isLiquidity: any,
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { account, evmChainId } = useActiveReact()
  const bridgeContract = useBridgeContract(isAddress(routerToken, evmChainId))
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const {isGnosisSafeWallet} = useIsGnosisSafeWallet()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()
  const { t } = useTranslation()
  const useAccount:any = isAddress(account, evmChainId)
  const balance = useCurrencyBalance(useAccount ?? undefined, inputCurrency)
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(inputCurrency)
    if (!bridgeContract || !evmChainId || !inputCurrency || !toAddress || !toChainID || !deadline || !outputAmount || !routerPath || routerPath.length <= 0) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    return {
      wrapType: WrapType.WRAP,
      execute:
      (sufficientBalance || !userInterfaceBalanceValid) && inputAmount
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
                  summary: `Cross bridge txns ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, evmChainId)}`,
                  value: inputAmount.toSignificant(6),
                  toChainId: toChainID,
                  toAddress: toAddress.indexOf('0x') === 0 ? toAddress?.toLowerCase() : toAddress,
                  symbol: inputCurrency?.symbol,
                  version: version,
                  routerToken: routerToken,
                  token: inputCurrency?.address,
                  logoUrl: inputCurrency?.logoUrl,
                  isLiquidity: isLiquidity
                })
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account && !isGnosisSafeWallet) {
                  const data = {
                    hash: txReceipt.hash.indexOf('0x') === 0 ? txReceipt.hash?.toLowerCase() : txReceipt.hash,
                    chainId: evmChainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.raw.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress.indexOf('0x') === 0 ? toAddress?.toLowerCase() : toAddress,
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version
                  }
                  recordsTxns(data)
                  onChangeViewDtil(txReceipt?.hash, true)
                }
              } catch (error) {
                console.log('Could not swapout', error)
                onChangeViewErrorTip(error,true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, evmChainId, inputCurrency, inputAmount, balance, addTransaction, t, outputAmount, routerPath, toAddress, deadline, toChainID, isGnosisSafeWallet, userInterfaceBalanceValid])
}

/**
 * 跨链交易native swap to underlying
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useBridgeSwapUnderlyingCallback(
  routerToken: string | undefined,
  inputCurrency: any | undefined,
  toAddress:  string | null | undefined,
  typedValue: string | undefined,
  toChainID: any,
  deadline: number | undefined,
  outputAmount: string | undefined,
  routerPath: any,
  isUnderlying: any,
  version: any,
  isLiquidity: any,
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { account, evmChainId } = useActiveReact()
  const bridgeContract = useBridgeContract(isAddress(routerToken, evmChainId))
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const {isGnosisSafeWallet} = useIsGnosisSafeWallet()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()
  const { t } = useTranslation()
  const useAccount:any = isAddress(account, evmChainId)
  const balance = useCurrencyBalance(useAccount ?? undefined, inputCurrency)
  // console.log(balance)
  // console.log(inputCurrency)
  // 我们总是可以解析输入货币的金额，因为包装是1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  return useMemo(() => {
    // console.log(inputCurrency)
    if (!bridgeContract || !evmChainId || !inputCurrency || !toAddress || !toChainID || !deadline || !outputAmount || !routerPath || routerPath.length <= 0) return NOT_APPLICABLE
    // console.log(typedValue)

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)
    // console.log(sufficientBalance)
    // console.log(inputAmount)
    return {
      wrapType: WrapType.WRAP,
      execute:
      (sufficientBalance || !userInterfaceBalanceValid) && inputAmount
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
                  summary: `Cross bridge txns ${inputAmount.toSignificant(6)} ${config.getBaseCoin(inputCurrency?.symbol, evmChainId)}`,
                  value: inputAmount.toSignificant(6),
                  toChainId: toChainID,
                  toAddress: toAddress.indexOf('0x') === 0 ? toAddress?.toLowerCase() : toAddress,
                  symbol: inputCurrency?.symbol,
                  version: version,
                  routerToken: routerToken,
                  token: inputCurrency?.address,
                  logoUrl: inputCurrency?.logoUrl,
                  isLiquidity: isLiquidity
                })
                // registerSwap(txReceipt.hash, chainId)
                if (txReceipt?.hash && account && !isGnosisSafeWallet) {
                  const data = {
                    hash: txReceipt.hash.indexOf('0x') === 0 ? txReceipt.hash?.toLowerCase() : txReceipt.hash,
                    chainId: evmChainId,
                    selectChain: toChainID,
                    account: account?.toLowerCase(),
                    value: inputAmount.raw.toString(),
                    formatvalue: inputAmount?.toSignificant(6),
                    to: toAddress.indexOf('0x') === 0 ? toAddress?.toLowerCase() : toAddress,
                    symbol: inputCurrency?.symbol,
                    routerToken: routerToken,
                    version: version
                  }
                  recordsTxns(data)
                  onChangeViewDtil(txReceipt?.hash, true)
                }
              } catch (error) {
                console.log('Could not swapout', error)
                onChangeViewErrorTip(error,true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: inputCurrency?.symbol})
    }
  }, [bridgeContract, evmChainId, inputCurrency, inputAmount, balance, addTransaction, t, outputAmount, routerPath, toAddress, deadline, toChainID, isGnosisSafeWallet, userInterfaceBalanceValid])
}


/**
 * 跨链桥
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useCrossBridgeCallback(
  inputCurrency: any | undefined,
  toAddress:  string | undefined,
  typedValue: string | undefined,
  toChainID: any,
  txnsType: string | undefined,
  inputToken: string | undefined,
  pairid: string | undefined,
  isLiquidity: any,
  receiveAddress: string | undefined,
  selectCurrency: any,
  destConfig: any,
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const { chainId, account, library } = useActiveWeb3React()
  const { t } = useTranslation()
  const {isGnosisSafeWallet} = useIsGnosisSafeWallet()
  const [userInterfaceBalanceValid] = useInterfaceBalanceValidManager()
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
      (sufficientBalance || !userInterfaceBalanceValid) && inputAmount
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
                    isLiquidity: isLiquidity,
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
                  let srcChainID = chainId
                  let destChainID = toChainID
                  if (toChainID === ChainId.TERRA || txnsType === 'swapout') {
                    srcChainID = toChainID
                    destChainID = chainId
                  }
                  if (!isGnosisSafeWallet) {
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
                }
              } catch (error) {
                console.log('Could not swapout', error)
                onChangeViewErrorTip(error,true)
              }
            }
          : undefined,
      inputError: sufficientBalance ? undefined : t('Insufficient', {symbol: symbol})
    }
  }, [chainId, inputCurrency, inputAmount, balance, addTransaction, t, txnsType, toAddress, inputToken, toChainID, pairid, library, receiveAddress, isLiquidity, destConfig, isGnosisSafeWallet, userInterfaceBalanceValid])
}

/**
 * 跨链桥
 * 给定选定的输入和输出货币，返回一个wrap回调
 * @param inputCurrency 选定的输入货币
 * @param typedValue 用户输入值
 */
 export function useTerraCrossBridgeCallback(
  inputCurrency: any | undefined,
  toAddress:  string,
  typedValue: string | undefined,
  toChainID: any,
  inputToken: string | undefined,
  pairid: string | undefined,
  terraRecipient: string | undefined,
  Unit: any,
  srcChainid: string | undefined,
  isLiquidity: any,
  destConfig: any
// ): { execute?: undefined | (() => Promise<void>); inputError?: string } {
): { 
  wrapType: WrapType;
  onConnect?: undefined | (() => Promise<void>);
  balance?: any,
  execute?: undefined | (() => Promise<void>);
  inputError?: string 
} {
  const { chainId, account } = useActiveReact()
  const { t } = useTranslation()
  const {onChangeViewDtil} = useTxnsDtilOpen()
  const {onChangeViewErrorTip} = useTxnsErrorTipOpen()
  const connectedWallet = useConnectedWallet()
  const addTransaction = useTransactionAdder()
  const { post, connect } = useWallet()
  const {isGnosisSafeWallet} = useIsGnosisSafeWallet()
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
      && [ChainId.TERRA].includes(chainId)
    ) {
      // console.log(connectedWallet)
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
        // console.log(fee.amount.toData())
        // console.log(tax.amount.toString())
        const txFee =
          tax?.amount.greaterThan(0) && fee
            ? new Fee(fee.gas_limit, fee.amount.add(tax))
            : fee
        setFee(txFee)
      })
    }
  }, [connectedWallet, toAddress, useNnit, inputAmount, chainId])

  const fetchBalance = useCallback(() => {
    if (terraToken && connectedWallet
      && [ChainId.TERRA].includes(chainId)) {
      // console.log(terraToken)
      getTerraBalances({terraWhiteList: [{
        token: terraToken
      }]}).then((res:any) => {
        // console.log(res)
        // const bl:any = res[terraToken] && inputCurrency ? new Fraction(JSBI.BigInt(res[terraToken]), JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(inputCurrency?.decimals))) : undefined
        const bl:any = res[terraToken] && inputCurrency ? BigAmount.format(inputCurrency?.decimals, res[terraToken]) : undefined
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
  }, [terraToken, connectedWallet, chainId])
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
    ) {
      return
    }
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
    // console.log(fee.amount.toData())
    // console.log(gasFee)
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
      sufficientBalance = inputCurrency && typedValue && balance && (Number(balance?.toExact()) >= Number(typedValue))
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
                    isLiquidity: isLiquidity,
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
                  if (txData.hash && account && terraRecipient && !isGnosisSafeWallet) {
                    const data:any = {
                      hash: txData.hash.indexOf('0x') === 0 ? txData.hash?.toLowerCase() : txData.hash,
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
                    onChangeViewDtil(txData?.hash, true)
                  }
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
  }, [chainId, inputCurrency, inputAmount, t, toAddress, inputToken, toChainID, terraRecipient, connectedWallet, pairid, srcChainid, balance, sendTx, destConfig, isGnosisSafeWallet])
}