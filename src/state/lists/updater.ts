// import { getVersionUpgrade, minVersionBump, VersionUpgrade } from '@uniswap/token-lists'
import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useActiveReact } from '../../hooks/useActiveReact'
import {
  // useFetchMergeTokenListCallback,
  useFetchTokenListVersionCallback
 } from '../../hooks/useFetchListCallback'
// import { useFetchListCallback, useFetchTokenListCallback } from '../../hooks/useFetchListCallback'
import useInterval from '../../hooks/useInterval'

import { AppDispatch } from '../index'

export default function Updater(): null {
  const { chainId } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()
  
  const fetchTokenListVersion = useFetchTokenListVersionCallback()

  const fetchTokenListsVersionCallback = useCallback(() => {
    if (chainId) {
      fetchTokenListVersion().catch(error => console.debug('interval list fetching error', error))
    }
  }, [fetchTokenListVersion, chainId])

  // 每 半 分钟获取所有列表，但仅在我们初始化库之后
  useInterval(fetchTokenListsVersionCallback, 1000 * 30, false)

  useEffect(() => {
    fetchTokenListsVersionCallback()
  }, [dispatch, fetchTokenListsVersionCallback, chainId])

  return null
}
