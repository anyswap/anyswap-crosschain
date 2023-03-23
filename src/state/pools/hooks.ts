import { useCallback, useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { AppDispatch, AppState } from '../index'
import { useSelector } from 'react-redux'
import { AppState } from '../index'
// import { poolLiquidity } from './actions'
import {getPoollist, isSupportIndexedDB} from '../../utils/indexedDB'


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