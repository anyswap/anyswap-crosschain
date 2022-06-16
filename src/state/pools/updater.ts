import { useCallback, useEffect } from 'react'
import useInterval from '../../hooks/useInterval'
import { useActiveWeb3React } from '../../hooks'
// import { useDispatch } from 'react-redux'
import { useDispatch } from 'react-redux'
// import axios from 'axios'
// import config from '../../config'
// import {poolLiquidity} from './actions'

import { useFetchPoolTokenListCallback } from '../../hooks/useFetchListCallback'


export default function Updater(): null {
  const { library, chainId } = useActiveWeb3React()
  const dispatch = useDispatch()
  const fetchTokenList = useFetchPoolTokenListCallback()

  const fetchAllTokenListsCallback = useCallback(() => {
    if (chainId) {
      fetchTokenList().catch(error => console.debug('interval list fetching error', error))
    }
  }, [fetchTokenList, chainId])

  useInterval(fetchAllTokenListsCallback, library ? 1000 * 60 * 30 : null, false)

  useEffect(() => {
    fetchAllTokenListsCallback()
  }, [dispatch, fetchAllTokenListsCallback, chainId])

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
