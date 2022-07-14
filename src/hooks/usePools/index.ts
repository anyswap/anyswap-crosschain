import {useEvmPools, useEvmPool, useEvmPoolDatas} from './evm'
// import { useUserSelectChainId } from '../../state/user/hooks'
import { useCallback, useEffect, useState } from 'react'
import useInterval from '../useInterval'
import { ChainId } from '../../config/chainConfig/chainId'
import {useNearPoolDatas} from '../near'

export function usePoolDatas () {
  const {getNearPoolDatas} = useNearPoolDatas()
  const {getEvmPoolsDatas} = useEvmPoolDatas()

  const getPoolsData = useCallback((chainId, list, account) => {
    return new Promise(resolve => {
      // console.log(chainId)
      // console.log(list)
      if ([ChainId.NEAR, ChainId.NEAR_TEST].indexOf(chainId)) {
        const arr = []
        for (const item of list) {
          arr.push({
            token: item.underlying,
            account: account,
            anytoken: item.token,
            dec: item.dec
          })
        }
        // console.log(arr)
        getNearPoolDatas(arr, chainId).then(res => {
          resolve(res)
        })
      } else {
        getEvmPoolsDatas(chainId, list, account).then(res => {
          resolve(res)
        })
      }
    })
  }, [getNearPoolDatas, getEvmPoolsDatas])

  return {
    getPoolsData
  }
}

export function usePools ({
  account,
  tokenList,
  chainId
}:any) {
  // const {selectNetworkInfo} = useUserSelectChainId()
  const [poolData, setPoolData] = useState<any>()
  const {getEvmPoolsData} = useEvmPools({
    account,
    tokenList,
    chainId
  })
  const {getNearPoolDatas} = useNearPoolDatas()

  const fetchPoolCallback = useCallback(() => {
    let fetchCallback:any
    if (!isNaN(chainId)) {
      fetchCallback = getEvmPoolsData
    } else if ([ChainId.NEAR, ChainId.NEAR_TEST].indexOf(chainId)) {
      const arr = []
      for (const item of tokenList) {
        arr.push({
          token: item.underlying,
          account: account,
          anytoken: item.anytoken
        })
      }
      // console.log(arr)
      getNearPoolDatas(arr, chainId).then(res => {
        // console.log(res)
        setPoolData(res)
      })
    }
    if (fetchCallback) {
      fetchCallback().then((res:any) => {
        setPoolData(res)
      })
    }
  }, [chainId, getEvmPoolsData])

  useEffect(() => {
    fetchPoolCallback()
  }, [chainId, getEvmPoolsData])
  useInterval(fetchPoolCallback, 1000 * 10)
  return {poolData}
}

export function usePool (
  chainId:any,
  account:any,
  anytoken:any,
  underlying: any,
) {
  // const {selectNetworkInfo} = useUserSelectChainId()
  const [poolData, setPoolData] = useState<any>()
  const {getEvmPoolsData} = useEvmPool(chainId, account, anytoken, underlying)

  const fetchPoolCallback = useCallback(() => {
    let fetchCallback:any
    if (!isNaN(chainId)) {
      fetchCallback = getEvmPoolsData
    }
    if (fetchCallback) {
      fetchCallback().then((res:any) => {
        setPoolData(res)
      })
    }
  }, [chainId, account, anytoken, getEvmPoolsData])

  useEffect(() => {
    fetchPoolCallback()
  // }, [chainId, fetchPoolCallback])
  }, [chainId, account, anytoken])

  useInterval(fetchPoolCallback, 1000 * 10)
  return {poolData}
}