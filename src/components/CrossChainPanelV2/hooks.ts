import { useMemo } from "react";
import {isAddress} from 'multichain-bridge'
import {formatDecimal, thousandBit} from '../../utils/tools/tools'
import config from '../../config'

export function outputValue (inputBridgeValue: any, destConfig:any, selectCurrency:any) {
  return useMemo(() => {
    if (inputBridgeValue && destConfig && selectCurrency) {
      const baseFee = destConfig.BaseFeePercent ? (destConfig.MinimumSwapFee / (100 + destConfig.BaseFeePercent)) * 100 : 0
      let fee = Number(inputBridgeValue) * Number(destConfig.SwapFeeRatePerMillion) / 100
      let value = Number(inputBridgeValue) - fee
      if (fee < Number(destConfig.MinimumSwapFee)) {
        fee = Number(destConfig.MinimumSwapFee)
        value = Number(inputBridgeValue) - fee
      } else if (fee > destConfig.MaximumSwapFee) {
        fee = Number(destConfig.MaximumSwapFee)
        value = Number(inputBridgeValue) - fee
      } else {
        fee = fee + baseFee
        value = Number(inputBridgeValue) - fee
      }
      if (value && Number(value) && Number(value) > 0) {
        return {
          fee: fee,
          outputBridgeValue: thousandBit(formatDecimal(value, Math.min(6, selectCurrency.decimals)), 'no')
        }
      }
      return {
        fee: '',
        outputBridgeValue: ''
      }
    } else {
      return {
        fee: '',
        outputBridgeValue: ''
      }
    }
  }, [inputBridgeValue, destConfig, selectCurrency])
}

export function useInitSelectCurrency (
  allTokensList:any,
  useChainId: any,
  initToken?: any
) {
  return useMemo(() => {
    const t = initToken ? [initToken] : [config.getCurChainInfo(useChainId)?.bridgeInitToken?.toLowerCase(), config.getCurChainInfo(useChainId)?.crossBridgeInitToken?.toLowerCase()]

    const list:any = {}

    let initCurrency:any
    
    if (Object.keys(allTokensList).length > 0) {
      let useToken = ''
      let noMatchInitToken = ''
      for (const token in allTokensList) {
        if (!isAddress(token) && token !== config.getCurChainInfo(useChainId).symbol) continue
        list[token] = {
          ...allTokensList[token],
        }
        if (!noMatchInitToken) noMatchInitToken = token
        if ( !useToken ) {
          if (
            t.includes(token)
            || t.includes(list[token]?.symbol?.toLowerCase())
            || t.includes(list[token]?.underlying?.symbol?.toLowerCase())
          ) {
            useToken = token
          }
        }
      }
      if (useToken) {
        initCurrency = list[useToken]
      } else if (noMatchInitToken) {
        initCurrency = list[noMatchInitToken]
      }
    }
    return {
      initCurrency
    }
  }, [allTokensList, useChainId, initToken])
}

export function useDestChainid (
  selectCurrency:any,
  selectChain:any,
  useChainId:any,
) {
  return useMemo(() => {
    let initChainId:any = '',
        initChainList:any = []
    if (selectCurrency) {
      const arr = []
      for (const c in selectCurrency?.destChains) {
        if (c?.toString() === useChainId?.toString()) continue
        arr.push(c)
      }
      // console.log(arr)
      let useChain:any = selectChain ? selectChain : config.getCurChainInfo(selectChain).bridgeInitChain
      if (arr.length > 0) {
        if (
          !useChain
          || (useChain && !arr.includes(useChain))
        ) {
          for (const c of arr) {
            if (config.getCurConfigInfo()?.hiddenChain?.includes(c)) continue
            useChain = c
            break
          }
        }
      }
      // console.log('useChain', useChain)
      // setSelectChain(useChain)
      initChainId = useChain
      initChainList = arr
      // setSelectChainList(arr)
    }
    return {
      initChainId,
      initChainList
    }
  }, [selectCurrency])
}

export function useDestCurrency (
  selectCurrency:any,
  selectChain:any,
) {
  return useMemo(() => {
    let initDestCurrency = '',
        initDestCurrencyList = ''
    if (selectCurrency && selectChain) {
      const dl:any = selectCurrency?.destChains[selectChain]
      const formatDl:any = {}
      for (const t in dl) {
        formatDl[t] = {
          ...dl[t],
          logoUrl: selectCurrency?.logoUrl
        }
      }
      // console.log(formatDl)
      const destTokenList = Object.keys(formatDl)
      let destToken = ''
      if (destTokenList.length === 1) {
        destToken = destTokenList[0]
      } else if (destTokenList.length > 1) {
        const typeArr = ['swapin', 'swapout']
        let bridgeToken = '',
            routerToken = '',
            isRouterUnderlying = false
        for (const t of destTokenList) {
          if (typeArr.includes(formatDl[t].type)) {
            bridgeToken = t
          }
          if (!typeArr.includes(formatDl[t].type)) {
            routerToken = t
            if (formatDl[t].underlying) {
              isRouterUnderlying = true
            }
          }
        }
        if (isRouterUnderlying) {
          destToken = routerToken
        } else {
          destToken = bridgeToken
        }
      }
      // setSelectDestCurrency(formatDl[destToken])
      // setSelectDestCurrencyList(formatDl)
      initDestCurrency = formatDl[destToken]
      initDestCurrencyList = formatDl
    }
    return {
      initDestCurrency,
      initDestCurrencyList
    }
  }, [selectCurrency, selectChain])
}