import { useMemo } from 'react';
import {useTrxSwapPoolCallback} from '../trx'
import {useAptSwapPoolCallback} from '../apt'
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
    }
    return { wrapType: WrapType.NOT_APPLICABLE }
  }, [
    wrapTypeTrx, onTrxSwar, inputErrorTrx,
    onAptSwar, inputErrorApt,
    inputCurrency, inputToken, typedValue, swapType,
    chainId
  ])
}