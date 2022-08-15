import { useCallback, useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
// import config from '../../config'
import { isAddress } from 'ethers/lib/utils'
import {userSelectCurrency} from './actions'

import {getTokenlist, isSupportIndexedDB} from '../../utils/indexedDB'



export type TokenAddressMap = Readonly<{ [chainId in any]: Readonly<{ [tokenAddress: string]: any }> }>

export function listsToTokenMap(list:any): TokenAddressMap {

  // console.log(list)
  const map:any = {}
  for (const t in list) {
    if(!isAddress(t) || !list[t].name || !list[t].symbol) continue
    // console.log(list[t])
    map[t] = list[t]
  }
  return map
}


export function useBridgeTokenList(key?: string | undefined, chainId?:any): any {
  const lists:any = useSelector<AppState, AppState['lists']>(state => state.lists)
  // console.log(lists)
  const init = {}
  return useMemo(() => {
    if (!key || !chainId) return init
    const current = lists[key]?.[chainId]?.tokenList
    // console.log(current)
    if (!current) return init
    try {
      return listsToTokenMap(current)
      // return current
    } catch (error) {
      console.error('Could not show token list due to error', error)
      return init
    }
  }, [lists, key, chainId])
}

export function useAllMergeBridgeTokenList(key?: string | undefined, chainId?:any): any {
  const lists:any = useSelector<AppState, AppState['lists']>(state => state.lists)
  const updateTokenlistTime:any = useSelector<AppState, AppState['lists']>(state => state.lists.updateTokenlistTime)
  // console.log(chainId)
  const [tokenlist, setTokenlist] = useState<any>({})
  const getCurTokenlist = useCallback(() => {
    // console.log(updateTokenlistTime)
    if (isSupportIndexedDB) {
      getTokenlist(chainId).then((res:any) => {
        console.log(res)
        if (res?.tokenList) {
          setTokenlist(res.tokenList)
        } else {
          let current = key ? lists[key]?.[chainId]?.tokenList : ''
          if (!current) current = {}
          setTokenlist(current)
        }
      })
    } else {
      let current = key ? lists[key]?.[chainId]?.tokenList : ''
      if (!current) current = {}
      setTokenlist(current)
    }
  }, [chainId, updateTokenlistTime])

  useEffect(() => {
    getCurTokenlist()
  }, [getCurTokenlist, chainId, updateTokenlistTime])

  return tokenlist
}

export function useInitUserSelectCurrency(chainId?: any) {
  const userInit = useSelector<AppState, AppState['lists']['userSelectCurrency']>(state => state.lists.userSelectCurrency)
  const dispatch = useDispatch<AppDispatch>()
  // console.log(userInit)
  // console.log(chainId)
  // console.log(userInit && chainId && userInit[chainId] ? userInit[chainId] : {})
  const setInitUserSelect = useCallback(({useChainId, token, toChainId}: {useChainId?: any, token?:any, toChainId?:any}) => {
    const id = useChainId ? useChainId : chainId
    if (id && toChainId && id?.toString() !== toChainId?.toString()){
      dispatch(userSelectCurrency({chainId: id, token, toChainId}))
    }
  }, [dispatch])

  return {
    userInit: userInit && chainId && userInit[chainId] ? userInit[chainId] : {},
    setInitUserSelect
  }
}
