import { useCallback, useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, AppState } from '../index'
import { useSelector } from 'react-redux'
import { AppState } from '../index'
// import { poolLiquidity } from './actions'
import {getPoollist, isSupportIndexedDB} from '../../utils/indexedDB'

// import { JSBI } from 'anyswap-sdk'
// import axios from 'axios'

// export function usePoolsState(): any {
//   const poolLiquidity:any = useSelector<AppState, AppState['pools']>(state => state.pools.poolLiquidity)
//   // console.log(poolLiquidity)
//   if (!poolLiquidity) return {}

//   return poolLiquidity
// }

// export function usePoolListState(): any {
//   const poolList:any = useSelector<AppState, AppState['pools']>(state => state.pools.poolList)
//   // console.log(poolLiquidity)
//   if (!poolList) return {}

//   return poolList
// }


export function usePoolListState(chainId?:any): any {
  const lists:any = useSelector<AppState, AppState['pools']>(state => state.pools.poolList)
  // console.log(lists)
  const updatePoollistTime:any = useSelector<AppState, AppState['pools']>(state => state.pools.updatePoollistTime)
  // console.log(updateTokenlistTime)
  const [tokenlist, setTokenlist] = useState<any>({})
  const getCurTokenlist = useCallback(() => {
    // console.log(chainId)
    if (isSupportIndexedDB) {
      getPoollist(chainId).then((res:any) => {
        // console.log(res)
        if (res?.tokenList) {
          setTokenlist(res.tokenList)
        } else {
          let current = lists[chainId]?.tokenList
          if (!current) current = {}
          setTokenlist(current)
        }
      })
    } else {
      let current = lists[chainId]?.tokenList
      if (!current) current = {}
      setTokenlist(current)
    }
  }, [chainId, updatePoollistTime])

  useEffect(() => {
    getCurTokenlist()
  }, [getCurTokenlist, chainId, updatePoollistTime])

  return tokenlist
}