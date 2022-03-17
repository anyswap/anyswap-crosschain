// import { useEffect, useMemo, useRef } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useActiveWeb3React } from '../../hooks'
import { useActiveReact } from '../../hooks/useActiveReact'
import useInterval from '../../hooks/useInterval'
import { AppDispatch } from '../index'
import { tokenBalanceList } from './actions'
// import {useTokenBalances} from './hooks'

import { useBridgeTokenList } from '../lists/hooks'
// import { isAddress } from '../../utils'

import ERC20_INTERFACE from '../../constants/abis/erc20'

import {useRpcState} from '../rpc/hooks'

import {getContract} from '../../utils/tools/multicall'

import config from '../../config'
import { fromWei } from '../../utils/tools/tools'
// const startTime = Date.now()
const limit = 80

// function getAllBalance () {
//   return new Promise(resolve => {

//   })
// }

export default function Updater(): null {
  const { chainId, account } = useActiveReact()
  const { library } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  // const lists = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)
  const allTokens = useBridgeTokenList('mergeTokenList', chainId)
  const rpcItem = useRpcState()
  const tokenListRef = useRef<any>(0)
  
  // useEffect(() => {
  //   tokenListRef.current = {
  //     index: 0,
  //     list: []
  //   }
  // }, [chainId, account])
  // useEffect(() => {
  //   const list = Object.values(allTokens ?? {})
  //   const index = tokenListRef.current.index * limit
  //   const endIndes = index + limit
  //   if (index < list.length && !isNaN(chainId)) {
  //     // console.log(list.length)
  //     // console.log(index)
  //     // console.log(endIndes)
  //     tokenListRef.current.list = list.slice(index, endIndes)
  //   }
  // }, [allTokens, tokenListRef.current.index, chainId])
  // console.log(allTokensArray)
  // const balances = useTokenBalances(account ?? undefined, allTokensArray.slice(0,10))
  // const balances = useTokenBalances(account && isAddress(account) ? account : undefined, tokenListRef?.current?.list && !isNaN(chainId) ? tokenListRef?.current?.list : [])

  // 每 10 分钟获取所有列表，但仅在我们初始化库之后
  // useInterval(fetchAllListsCallback, library ? 1000 * 60 * 10 : null)

  const calls = useMemo(() => {
    const arr = []
    const list = Object.values(allTokens ?? {})
    // console.log(list)
    if (account) {
      // for (const obj of list) {
      for (let i = 0, len = list.length; i < len; i++) {
        const obj:any = list[i]
        const token:any = obj.address
        arr.push({
          dec: obj.decimals,
          target: token,
          callData: ERC20_INTERFACE.encodeFunctionData('balanceOf', [account]),
        })
      }
    }
    return arr
  }, [allTokens, account])
  const getBalance = useCallback((arr) => {
    return new Promise(resolve => {
      const rpc = rpcItem ? rpcItem.rpc : config.getCurChainInfo(chainId).nodeRpc
      const contract = getContract({rpc: rpc, abi: ''})
      // console.log(rpcItem)
      contract.options.address = config.getCurChainInfo(chainId).multicalToken
      contract.methods.aggregate(arr).call((err:any, res:any) => {
        // console.log(err)
        // console.log(res)
        if (!err) {
          const blList:any = {}
          for (let i = 0, len = arr.length; i < len; i++) {
            const token = arr[i].target.toLowerCase()
            const dec = arr[i].dec
            const results = res.returnData[i]
            blList[token] = {
              balance: fromWei(results, dec),
              blocknumber: res.blockNumber
            }
          }
          // if (blList['0x6f817a0ce8f7640add3bc0c1c2298635043c2423']) {
          //   console.log(blList['0x6f817a0ce8f7640add3bc0c1c2298635043c2423'])
          // }
          dispatch(tokenBalanceList({
            chainId,
            account,
            tokenList: blList
          }))
        }
        resolve(res)
      })
    })
  }, [rpcItem, chainId])

  const getAllBalance = useCallback(() => {
    const results = []
    for (let i = 0, len = calls.length; i < len; i += limit) {
      results.push(calls.slice(i, i + limit))
    }
    const arr = []
    for (const item of results) {
      arr.push(getBalance(item))
    }
    const st = Date.now()
    Promise.all(arr).then(res => {
      console.log(Date.now() - st)
      console.log(res)
    })
  }, [calls])

  useEffect(() => {
    if (
      library
      && chainId
      && account
      && calls.length > 0
      && !tokenListRef.current
    ) {
      tokenListRef.current = 1
      getAllBalance()
    }
  }, [library, calls, chainId, account, rpcItem])

  useInterval(getAllBalance, 1000 * 30)

  // useEffect(() => {
  //   // console.log(balances)
  //   // console.log(tokenListRef)
  //   if (chainId && account && Object.keys(balances).length > 0) {
  //     // console.log(Date.now()- startTime)
  //     tokenListRef.current.index += 1
  //     const blList:any = {}
  //     for (const k in balances) {
  //       blList[k] = {
  //         balance: balances[k]?.toSignificant(6)
  //       }
  //     }
  //     dispatch(tokenBalanceList({
  //       chainId,
  //       account,
  //       tokenList: blList
  //     }))
  //   }
  // }, [dispatch, balances, chainId, account])

  return null
}
