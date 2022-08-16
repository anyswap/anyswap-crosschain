
import { useCallback, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { useActiveReact } from '../../hooks/useActiveReact'
import {
  // useFetchMergeTokenListCallback,
  useFetchTokenListVersionCallback
 } from '../../hooks/useFetchListCallback'
// import { useFetchListCallback, useFetchTokenListCallback } from '../../hooks/useFetchListCallback'
import useInterval from '../../hooks/useInterval'

import { AppDispatch } from '../index'

import config from '../../config'

export default function Updater(): null {
  const { chainId } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()

  const useChain = useMemo(() => {
    if (chainId) {
      return chainId
    } else if (config.getCurChainInfo(chainId).chainID) {
      return config.getCurChainInfo(chainId).chainID
    }
    return undefined
  }, [chainId])
  
  const fetchTokenListVersion = useFetchTokenListVersionCallback()

  const fetchTokenListsVersionCallback = useCallback(() => {
    if (useChain) {
      fetchTokenListVersion().catch(error => console.debug('interval list fetching error', error))
    }
  }, [fetchTokenListVersion, useChain])

  // 每 半 分钟获取所有列表，但仅在我们初始化库之后
  useInterval(fetchTokenListsVersionCallback, 1000 * 30, false)

  useEffect(() => {
    fetchTokenListsVersionCallback()
  }, [dispatch, fetchTokenListsVersionCallback, useChain])

  return null
}
