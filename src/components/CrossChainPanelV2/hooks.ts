import { useMemo, useCallback, useState, useEffect } from "react";
import {formatDecimal, thousandBit} from '../../utils/tools/tools'
import {getNodeBalance} from '../../utils/bridge/getBalanceV2'
import config from '../../config'
import {
  // MAIN_COIN_SORT,
  
  USE_VERSION,
  controlConfig
} from '../../config/constant'

import {spportChainArr} from '../../config/chainConfig'

import { useInitUserSelectCurrency } from '../../state/lists/hooks'
import {useStarChain} from '../../state/user/hooks'

export function calcReceiveValueAndFee (inputBridgeValue: any, destConfig:any, decimals:any) {
  if (inputBridgeValue && destConfig) {
    const minFee = destConfig.BaseFeePercent ? (destConfig.MinimumSwapFee / (100 + destConfig.BaseFeePercent)) * 100 : destConfig.MinimumSwapFee
    const baseFee = destConfig.BaseFeePercent ? minFee * destConfig.BaseFeePercent / 100 : 0

    // const baseFeeSrc = destConfig?.BaseFee ?? 0
    const baseFeeSrc = 0

    let fee = Number(inputBridgeValue) * Number(destConfig.SwapFeeRatePerMillion) / 100
    let value:any = Number(inputBridgeValue) - fee
    // console.log(minFee)
    // console.log(baseFee)
    if (fee < Number(minFee)) {
      fee = Number(minFee)
    } else if (fee > destConfig.MaximumSwapFee) {
      fee = Number(destConfig.MaximumSwapFee)
    } else {
      fee = fee
    }
    value = Number(inputBridgeValue) - fee - baseFee - baseFeeSrc
    // console.log(value)
    if (value && Number(value) && Number(value) > 0) {
      const dec = Math.min(6, decimals)
      value = value.toFixed(Math.min(7, decimals))
      return {
        fee: fee + baseFeeSrc,
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
}

export function outputValue (inputBridgeValue: any, destConfig:any, selectCurrency:any) {
  return useMemo(() => {
    return calcReceiveValueAndFee(inputBridgeValue, destConfig, selectCurrency?.decimals)
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
    // if (!useChainId) return {
    //   initCurrency: undefined,
    //   underlyingList: {}
    // }
    let t = []
    if (initToken) {
      t = [initToken]
    } else if (userInit?.tokenKey) {
      t = [userInit?.tokenKey?.toLowerCase()]
    } else if (userInit?.token) {
      t = [userInit?.token?.toLowerCase()]
    } else if (config.getCurChainInfo(useChainId)?.bridgeInitToken || config.getCurChainInfo(useChainId)?.crossBridgeInitToken) {
      if (config.getCurChainInfo(useChainId)?.bridgeInitToken) {
        t.push(config.getCurChainInfo(useChainId)?.bridgeInitToken?.toLowerCase())
      } else if (config.getCurChainInfo(useChainId)?.crossBridgeInitToken) {
        t.push(config.getCurChainInfo(useChainId)?.crossBridgeInitToken?.toLowerCase())
      }
      // t = [config.getCurChainInfo(useChainId)?.bridgeInitToken?.toLowerCase(), config.getCurChainInfo(useChainId)?.crossBridgeInitToken?.toLowerCase()]
    } else {
      t = [config.getCurChainInfo(useChainId)?.symbol?.toLowerCase()]
    }
    // console.log(t)
    const list:any = {}
    const underlyingList:any = {}

    let initCurrency:any
    // console.log(allTokensList)
    let useToken = ''
    if (Object.keys(allTokensList).length > 0) {
      let noMatchInitToken = ''
      for (const tokenKey in allTokensList) {
        const item = allTokensList[tokenKey]
        const token = item.address
        list[tokenKey] = {
          ...(item.tokenInfo ? item.tokenInfo : item),
          key: tokenKey,
        }
        if(!list[tokenKey].name || !list[tokenKey].symbol || controlConfig[USE_VERSION].hiddenCoin.includes(token)) continue
        if (!noMatchInitToken) noMatchInitToken = tokenKey
        if ( !useToken ) {
          if (
            t.includes(token?.toLowerCase())
            || t.includes(list[tokenKey]?.symbol?.toLowerCase())
            || t.includes(tokenKey?.toLowerCase())
          ) {
            useToken = tokenKey
          }
        }
        if (onlyUnderlying) {
          for (const destChainId in list[tokenKey].destChains) {
            const destChainIdList = list[tokenKey].destChains[destChainId]
            let isUnderlying = false
            for (const tokenKey in destChainIdList) {
              const destChainIdItem = destChainIdList[tokenKey]
              if (destChainIdItem.isFromLiquidity) {
                isUnderlying = true
                break
              }
            }
            if (isUnderlying) {
              underlyingList[tokenKey] = {
                ...list[tokenKey]
              }
            }
          }
        }
      }
      if (useToken && list[useToken].chainId === useChainId?.toString()) {
        initCurrency = list[useToken]
      } else if (noMatchInitToken && list[noMatchInitToken].chainId === useChainId?.toString()) {
        initCurrency = list[noMatchInitToken]
      }
    }
    // console.log(useChainId)
    // console.log(useToken)
    // console.log(initCurrency)
    // console.log(list[useToken])
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
  // initToChainId:any,
) {
  const {userInit} = useInitUserSelectCurrency(useChainId)
  const [initChainId, setInitChainId] = useState<any>('')
  const [initChainList, setInitChainList] = useState<any>([])
  const {starChainList} = useStarChain()
  // const starChainLen = useMemo(() => {
  //   if (starChainList) return Object.keys(starChainList).length
  //   return 0
  // }, [starChainList])
  useEffect(() => {
    // let initChainId1:any = '',
    //     initChainList1:any = []
    if (selectCurrency) {
      const arr = []
      for (const c in selectCurrency?.destChains) {
        // if (c?.toString() === useChainId?.toString() || !config.chainInfo[c]) continue
        if (c?.toString() === useChainId?.toString() || !spportChainArr.includes(c)) continue
        // if (c?.toString() === useChainId?.toString()) continue
        arr.push(c)
      }
      // console.log(arr)
      // console.log(userInit)
      let useChain:any = ''
      if (selectChain && arr.includes(selectChain.toString())) {
        // console.log(2)
        useChain = selectChain
      } else if (userInit?.toChainId) {
        // console.log(1)
        useChain = userInit?.toChainId
      } else if (Object.keys(starChainList).length > 0) {
        // console.log(3)
        for (const c of arr) {
          if (starChainList[c]) {
            useChain = c
            break
          }
        }
      } else {
        // console.log(4)
        useChain = config.getCurChainInfo(selectChain).bridgeInitChain
      }
      // console.log(useChain)
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
      // console.log(useChain)
      // console.log(arr)
      setInitChainId(useChain)
      setInitChainList(arr)
    } else {
      setInitChainId('')
      setInitChainList([])
    }
  }, [selectCurrency])
  return {
    initChainId,
    initChainList
  }
}

export function useDestCurrency (
  selectCurrency:any,
  selectDestCurrencyList:any,
) {
  const [initDestCurrency, setInitDestCurrency] = useState<any>('')
  const [initDestCurrencyList, setInitDestCurrencyList] = useState<any>({})
  useEffect(() => {
    if (selectDestCurrencyList) {
      const dl:any = selectDestCurrencyList
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
      // let destTokenKey = ''
      let destTokenMinKey = ''
      // const typeArr = ['swapin', 'swapout']
      for (const tokenKey of destTokenList) {
        if (!destTokenMinKey) destTokenMinKey = tokenKey
        if (formatDl[destTokenMinKey].sortId > formatDl[tokenKey].sortId) {
          destTokenMinKey = tokenKey
        }
      }
      try {
        setInitDestCurrency(formatDl[destTokenMinKey])
        setInitDestCurrencyList(formatDl)
      } catch (error) {
        
      }
    }
  }, [selectDestCurrencyList])
  return {
    initDestCurrency,
    initDestCurrencyList
  }
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
        chainId?.toString() === '1' ? destConfig.fromanytoken?.address : destConfig.anytoken?.address,
        chainId?.toString() === '1' ? selectCurrency?.address : destConfig.address,
        curChain,
        dec,
      )
      let DC:any = ''
      // console.log(CC)
      // console.log(CC)
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