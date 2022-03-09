// import { useEffect, useMemo, useRef } from 'react'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
// import { useActiveWeb3React } from '../../hooks'
import { useActiveReact } from '../../hooks/useActiveReact'
// import useInterval from '../../hooks/useInterval'
import { AppDispatch } from '../index'
import { tokenBalanceList } from './actions'
import {useTokenBalances} from './hooks'

import { useBridgeTokenList } from '../lists/hooks'

// import config from '../../config'
const startTime = Date.now()
const limit = 100
export default function Updater(): null {
  const { chainId, account } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()
  // const lists = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)
  const allTokens = useBridgeTokenList('mergeTokenList', chainId)
  const tokenListRef = useRef<any>({
    index: 0,
    list: []
  })
  // const allTokensArray:any = useMemo(() => {
  //   const list = Object.values(allTokens ?? {})
  //   console.log(allTokens)
  //   console.log(list)
  //   return list
  // }, [allTokens])
  useEffect(() => {
    tokenListRef.current = {
      index: 0,
      list: []
    }
  }, [chainId, account])
  useEffect(() => {
    const list = Object.values(allTokens ?? {})
    const index = tokenListRef.current.index * limit
    const endIndes = index + limit
    if (index < list.length) {
      // console.log(list.length)
      // console.log(index)
      // console.log(endIndes)
      tokenListRef.current.list = list.slice(index, endIndes)
    }
  }, [allTokens, tokenListRef.current.index])
  // console.log(allTokensArray)
  // const balances = useTokenBalances(account ?? undefined, allTokensArray.slice(0,10))
  const balances = useTokenBalances(account ?? undefined, tokenListRef?.current?.list ?? [])

  // 每 10 分钟获取所有列表，但仅在我们初始化库之后
  // useInterval(fetchAllListsCallback, library ? 1000 * 60 * 10 : null)

  useEffect(() => {
    console.log(balances)
    console.log(tokenListRef)
    if (chainId && account && Object.keys(balances).length > 0) {
      console.log(Date.now()- startTime)
      tokenListRef.current.index += 1
      const blList:any = {}
      for (const k in balances) {
        blList[k] = {
          balance: balances[k]?.toSignificant(6)
        }
      }
      dispatch(tokenBalanceList({
        chainId,
        account,
        tokenList: blList
      }))
    }
  }, [dispatch, balances, chainId, account])

  return null
}
