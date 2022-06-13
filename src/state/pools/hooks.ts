import { useMemo } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, AppState } from '../index'
import { useSelector } from 'react-redux'
import { AppState } from '../index'
// import { poolLiquidity } from './actions'

// import { JSBI } from 'anyswap-sdk'
// import axios from 'axios'

export function usePoolsState(): any {
  const poolLiquidity:any = useSelector<AppState, AppState['pools']>(state => state.pools.poolLiquidity)
  // console.log(poolLiquidity)
  if (!poolLiquidity) return {}

  return poolLiquidity
}

// export function usePoolListState(): any {
//   const poolList:any = useSelector<AppState, AppState['pools']>(state => state.pools.poolList)
//   // console.log(poolLiquidity)
//   if (!poolList) return {}

//   return poolList
// }


export function usePoolListState(chainId?:any): any {
  const lists:any = useSelector<AppState, AppState['pools']>(state => state.pools.poolList)
  // console.log(lists)
  const init = {}
  return useMemo(() => {
    if (!chainId) return init
    const current = lists[chainId]?.tokenList
    // console.log(current)
    if (!current) return init
    try {
      // return listsMergeToTokenMap(current)
      return current
    } catch (error) {
      console.error('Could not show token list due to error', error)
      return init
    }
  }, [lists, chainId])
}