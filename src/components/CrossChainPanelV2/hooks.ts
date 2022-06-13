import { useMemo, useCallback, useState, useEffect } from "react";
// import {isAddress} from 'multichain-bridge'
import {formatDecimal, thousandBit} from '../../utils/tools/tools'
import {getNodeBalance} from '../../utils/bridge/getBalanceV2'
import config from '../../config'

import { useInitUserSelectCurrency } from '../../state/lists/hooks'

export function outputValue (inputBridgeValue: any, destConfig:any, selectCurrency:any) {
  return useMemo(() => {
    if (inputBridgeValue && destConfig && selectCurrency) {
      const minFee = destConfig.BaseFeePercent ? (destConfig.MinimumSwapFee / (100 + destConfig.BaseFeePercent)) * 100 : destConfig.MinimumSwapFee
      const baseFee = destConfig.BaseFeePercent ? minFee * destConfig.BaseFeePercent / 100 : 0
      let fee = Number(inputBridgeValue) * Number(destConfig.SwapFeeRatePerMillion) / 100
      let value = Number(inputBridgeValue) - fee
      // console.log(minFee)
      // console.log(baseFee)
      if (fee < Number(minFee)) {
        fee = Number(minFee)
      } else if (fee > destConfig.MaximumSwapFee) {
        fee = Number(destConfig.MaximumSwapFee)
      } else {
        fee = fee
      }
      value = Number(inputBridgeValue) - fee - baseFee
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
  initToken?: any,
  onlyUnderlying?: any
) {
  const {userInit} = useInitUserSelectCurrency(useChainId)
  return useMemo(() => {
    // console.log(allTokensList)
    // console.log(useChainId)
    // console.log(userInit)
    // console.log(initToken)
    let t = []
    if (initToken) {
      t = [initToken]
    } else if (userInit?.token) {
      t = [userInit?.token?.toLowerCase()]
    } else {
      t = [config.getCurChainInfo(useChainId)?.bridgeInitToken?.toLowerCase(), config.getCurChainInfo(useChainId)?.crossBridgeInitToken?.toLowerCase()]
    }
    // console.log(t)
    const list:any = {}
    const underlyingList:any = {}

    let initCurrency:any
    // console.log(allTokensList)
    if (Object.keys(allTokensList).length > 0) {
      let useToken = ''
      let noMatchInitToken = ''
      for (const tokenKey in allTokensList) {
        const item = allTokensList[tokenKey]
        const token = item.address
        // if (!isAddress(token) && token !== config.getCurChainInfo(useChainId).symbol) continue
        list[token] = {
          ...(item.tokenInfo ? item.tokenInfo : item),
          key: tokenKey,
        }
        if(!list[token].name || !list[token].symbol) continue
        if (!noMatchInitToken) noMatchInitToken = token
        if ( !useToken ) {
          if (
            t.includes(token?.toLowerCase())
            || t.includes(list[token]?.symbol?.toLowerCase())
          ) {
            useToken = token
          }
        }
        if (onlyUnderlying) {
          for (const destChainId in list[token].destChains) {
            const destChainIdList = list[token].destChains[destChainId]
            let isUnderlying = false
            for (const tokenKey in destChainIdList) {
              const destChainIdItem = destChainIdList[tokenKey]
              if (destChainIdItem.isFromLiquidity) {
                isUnderlying = true
                break
              }
            }
            if (isUnderlying) {
              underlyingList[token] = {
                ...list[token]
              }
            }
          }
        }
      }
      // console.log(useToken)
      // console.log(list)
      if (useToken) {
        initCurrency = list[useToken]
      } else if (noMatchInitToken) {
        initCurrency = list[noMatchInitToken]
      }
    }
    return {
      initCurrency,
      underlyingList
    }
  }, [allTokensList, useChainId, initToken, onlyUnderlying])
}

export function useDestChainid (
  selectCurrency:any,
  selectChain:any,
  useChainId:any,
) {
  const {userInit} = useInitUserSelectCurrency(useChainId)
  return useMemo(() => {
    let initChainId:any = '',
        initChainList:any = []
    if (selectCurrency) {
      const arr = []
      for (const c in selectCurrency?.destChains) {
        if (c?.toString() === useChainId?.toString() || !config.chainInfo[c]) continue
        // if (c?.toString() === useChainId?.toString()) continue
        arr.push(c)
      }
      // console.log(arr)
      let useChain:any = ''
      if (userInit?.toChainId) {
        useChain = userInit?.toChainId
        // console.log('useChain1', userInit)
        // console.log('useChain1', useChain)
        // console.log('useChain1', useChainId)
      } else if (selectChain) {
        useChain = selectChain
        // console.log('useChain2', useChain)
      } else {
        useChain = config.getCurChainInfo(selectChain).bridgeInitChain
        // console.log('useChain3', useChain)
      }
      if (arr.length > 0) {
        if (
          !useChain
          || (useChain && !arr.includes(useChain.toString()))
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
      // console.log('useChain4', useChain)
      // console.log(arr)
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
          key: t,
          logoUrl: selectCurrency?.logoUrl
        }
      }
      // console.log(formatDl)
      const destTokenList = Object.keys(formatDl)
      let destTokenKey = ''
      const typeArr = ['swapin', 'swapout']
      for (const tokenKey of destTokenList) {
        if (!destTokenKey) destTokenKey = tokenKey
        // console.log(destTokenKey)
        if (
          Number(formatDl[destTokenKey].MinimumSwapFee) > Number(formatDl[tokenKey].MinimumSwapFee)
          || (
            Number(formatDl[destTokenKey].MinimumSwapFee) === Number(formatDl[tokenKey].MinimumSwapFee)
            && typeArr.includes(formatDl[tokenKey].type)
          )
        ) {
          // console.log(destTokenKey)
          destTokenKey = tokenKey
        }
      }
      
      initDestCurrency = formatDl[destTokenKey]
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
      && (destConfig.isLiquidity || destConfig.isFromLiquidity)
      && (destConfig?.address === 'FTM' || destConfig.fromanytoken?.address === 'FTM')
    ) {
      // console.log(selectCurrency)
      const curChain = destConfig.isFromLiquidity ? chainId : selectChain
      const destChain = destConfig.isFromLiquidity ? selectChain : chainId
      // const tokenA = destConfig.isFromLiquidity ? selectCurrency : destConfig
      const dec = selectCurrency?.decimals
      
      const CC:any = await getNodeBalance(
        chainId?.toString() === '1' ? destConfig.fromanytoken?.address : destConfig?.address,
        chainId?.toString() === '1' ? selectCurrency?.address : destConfig?.address,
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
        if (chainId?.toString() === '1') {
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
        if (chainId?.toString() === '1') {
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
  }, [selectCurrency, chainId, selectChain, destConfig])
  useEffect(() => {
    getFTMSelectPool()
  }, [selectCurrency, chainId, selectChain, destConfig])
  return {
    curChain,
    destChain
  }
}