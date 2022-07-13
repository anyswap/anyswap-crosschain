import { useCallback, useEffect } from 'react'
// import useInterval from '../../hooks/useInterval'
import { useActiveReact } from '../../hooks/useActiveReact'
// import { useDispatch } from 'react-redux'
import { useDispatch } from 'react-redux'
// import axios from 'axios'
// import config from '../../config'
// import {poolLiquidity} from './actions'
import {useTokenListVersionUrl} from '../lists/hooks'
import { useFetchPoolTokenListCallback } from '../../hooks/useFetchListCallback'


export default function Updater(): null {
  const { chainId } = useActiveReact()
  const dispatch = useDispatch()
  const version = useTokenListVersionUrl()
  const fetchTokenList = useFetchPoolTokenListCallback()

  const fetchAllTokenListsCallback = useCallback(() => {
    if (chainId) {
      fetchTokenList().catch(error => console.debug('interval list fetching error', error))
    }
  }, [fetchTokenList, chainId])

  // useInterval(fetchAllTokenListsCallback, 1000 * 60 * 30)

  useEffect(() => {
    fetchAllTokenListsCallback()
  }, [dispatch, fetchAllTokenListsCallback, chainId, version])

  // const getPools = useCallback(() => {
  //   axios.get(`${config.bridgeApi}/data/router/v2/pools`).then(res => {
  //     const {status, data} = res
  //     if (status === 200) {
  //       dispatch(poolLiquidity({poolLiquidity: data}))
  //     }
  //   })
  // }, [dispatch])

  // useInterval(getPools, 1000 * 30)
  return null
}
