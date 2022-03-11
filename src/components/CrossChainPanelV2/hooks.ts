import { useMemo, useCallback, useState, useEffect } from "react";
import {isAddress} from 'multichain-bridge'
import {formatDecimal, thousandBit} from '../../utils/tools/tools'
import {getNodeBalance} from '../../utils/bridge/getBalanceV2'
import config from '../../config'

export function outputValue (inputBridgeValue: any, destConfig:any, selectCurrency:any) {
  return useMemo(() => {
    if (inputBridgeValue && destConfig && selectCurrency) {
      const minFee = destConfig.BaseFeePercent ? (destConfig.MinimumSwapFee / (100 + destConfig.BaseFeePercent)) * 100 : destConfig.MinimumSwapFee
      const baseFee = destConfig.BaseFeePercent ? minFee : 0
      let fee = Number(inputBridgeValue) * Number(destConfig.SwapFeeRatePerMillion) / 100
      let value = Number(inputBridgeValue) - fee
      if (fee < Number(minFee)) {
        fee = Number(minFee)
        value = Number(inputBridgeValue) - fee
      } else if (fee > destConfig.MaximumSwapFee) {
        fee = Number(destConfig.MaximumSwapFee)
        value = Number(inputBridgeValue) - fee
      } else {
        fee = fee + baseFee
        value = Number(inputBridgeValue) - fee
      }
      if (value && Number(value) && Number(value) > 0) {
        const dec = Math.min(6, selectCurrency.decimals)
        return {
          fee: fee,
          outputBridgeValue: thousandBit(formatDecimal(value, dec), 'no')
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
          ...(allTokensList[token].tokenInfo ? allTokensList[token].tokenInfo : allTokensList[token]),
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

export function getFTMSelectPool (
  selectCurrency: any,
  isUnderlying: any,
  isDestUnderlying: any,
  chainId: any,
  selectChain: any,
  destConfig: any,
) {
  const [curChain, setCurChain] = useState<any>({
    chain: chainId,
    ts: '',
    bl: ''
  })
  const [destChain, setDestChain] = useState<any>({
    chain: config.getCurChainInfo(chainId).bridgeInitChain,
    ts: '',
    bl: ''
  })
  const getFTMSelectPool = useCallback(async() => {

    if (
      selectCurrency
      && chainId
      && (isUnderlying || isDestUnderlying)
      && (selectCurrency?.address === 'FTM' || destConfig?.address === 'FTM')
    ) {
      // console.log(selectCurrency)
      const curChain = isUnderlying ? chainId : selectChain
      const destChain = isUnderlying ? selectChain : chainId
      const tokenA = isUnderlying ? selectCurrency : destConfig
      const dec = selectCurrency?.decimals
      
      const CC:any = await getNodeBalance(
        tokenA?.underlying1 ? tokenA?.underlying1?.address : tokenA?.underlying?.address,
        tokenA?.address,
        curChain,
        dec,
      )
      let DC:any = ''
      // console.log(!isNaN(selectChain))
      DC = await getNodeBalance(
        destConfig?.DepositAddress,
        selectCurrency.symbol,
        destChain,
        dec,
      )
      // console.log(curChain)
      // console.log(CC)
      // console.log(destChain)
      // console.log(DC)
      if (CC) {
        if (isUnderlying) {
          setCurChain({
            chain: chainId,
            ts: CC,
          })
        } else {
          setDestChain({
            chain: selectChain,
            ts: CC,
          })
        }
      }
      // console.log(DC)
      if (DC) {
        if (isUnderlying) {
          setDestChain({
            chain: selectChain,
            ts: DC,
          })
        } else {
          setCurChain({
            chain: chainId,
            ts: DC,
          })
        }
      }
    }
  }, [selectCurrency, chainId, selectChain, isDestUnderlying, isUnderlying, destConfig])
  useEffect(() => {
    getFTMSelectPool()
  }, [selectCurrency, chainId, selectChain, isDestUnderlying, isUnderlying, destConfig])
  return {
    curChain,
    destChain
  }
}