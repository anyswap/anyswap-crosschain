import { useMemo } from 'react';
import {useTrxSwapPoolCallback} from '../trx'
import {useAptSwapPoolCallback} from '../apt'
import {useReefSwapPoolCallback} from '../reef'
import {useActiveReact} from '../../hooks/useActiveReact'
import { ChainId } from '../../config/chainConfig/chainId';

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
  NOCONNECT
}

export function useSwapPoolCallback(
  routerToken: any,
  inputCurrency: any,
  inputToken: string | undefined,
  typedValue: string | undefined,
  swapType: string | undefined,
  selectChain: any,
  receiveAddress: any,
  destConfig: any,
  selectCurrency: any,
  useToChainId: any,
): { execute?: undefined | (() => Promise<void>); inputError?: string } {
// ): any {
  const {chainId} = useActiveReact()
  const {wrapType: wrapTypeTrx, execute: onTrxSwar, inputError: inputErrorTrx} = useTrxSwapPoolCallback(routerToken, inputCurrency, inputToken, typedValue, swapType, selectChain, receiveAddress, destConfig, useToChainId)
  const {execute: onAptSwar, inputError: inputErrorApt} = useAptSwapPoolCallback(routerToken, inputCurrency, inputToken, typedValue, swapType, selectChain, receiveAddress, destConfig, selectCurrency, useToChainId)
  const {execute: onReefSwar, inputError: inputErrorReef} = useReefSwapPoolCallback(routerToken, inputCurrency, inputToken, typedValue, swapType, selectChain, receiveAddress, destConfig, useToChainId)
  
  return useMemo(() => {
    // console.log(chainId)
    // console.log(inputCurrency)
    // console.log(swapType)
    if ([ChainId.TRX, ChainId.TRX_TEST].includes(chainId)) {
      // console.log(1111)
      return {
        wrapType: wrapTypeTrx,
        execute: onTrxSwar,
        inputError: inputErrorTrx
      }
    } else if ([ChainId.APT, ChainId.APT_TEST].includes(chainId)) {
      return {
        wrapType: WrapType.WRAP,
        execute: onAptSwar,
        inputError: inputErrorApt
      }
    } else if ([ChainId.REEF, ChainId.REEF_TEST].includes(chainId)) {
      return {
        wrapType: WrapType.WRAP,
        execute: onReefSwar,
        inputError: inputErrorReef
      }
    }
    return { wrapType: WrapType.NOT_APPLICABLE }
  }, [
    wrapTypeTrx, onTrxSwar, inputErrorTrx,
    onAptSwar, inputErrorApt,
    onReefSwar, inputErrorReef,
    inputCurrency, inputToken, typedValue, swapType,
    chainId
  ])
}