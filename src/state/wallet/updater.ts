// import { useEffect, useMemo, useRef } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { formatUnits } from '@ethersproject/units'
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
// import { fromWei } from '../../utils/tools/tools'
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
    if (account && !isNaN(chainId)) {
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
  }, [allTokens, account, chainId])
  const getBalance = useCallback((arr) => {
    return new Promise(resolve => {
      const rpc = rpcItem && rpcItem.rpc ? rpcItem.rpc : config.getCurChainInfo(chainId).nodeRpc
      const provider = rpcItem && rpcItem.origin === 'wallet' && library ? library?.provider : ''
      const contract = getContract({rpc: rpc, abi: '', provider: provider})
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
            const bl = ERC20_INTERFACE.decodeFunctionResult('balanceOf', results)[0].toString()
            blList[token] = {
              // balance: fromWei(results, dec),
              balance: formatUnits(bl, dec),
              balancestr: bl,
              dec: dec,
              blocknumber: res.blockNumber
            }
          }
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

  const getETHBalance = useCallback(() => {
    return new Promise(resolve => {
      const rpc = rpcItem && rpcItem.rpc ? rpcItem.rpc : config.getCurChainInfo(chainId).nodeRpc
      const provider = rpcItem && rpcItem.origin === 'wallet' && library ? library?.provider : ''
      const contract = getContract({rpc: rpc, abi: '', provider: provider})
      // console.log(rpcItem)
      contract.options.address = config.getCurChainInfo(chainId).multicalToken
      contract.methods.getEthBalance(account).call((err:any, res:any) => {
        // console.log(err)
        // console.log(res)
        if (!err) {
          const blList:any = {}
          const dec = 18
          blList['NATIVE'] = {
            balance: formatUnits(res, dec),
            balancestr: res,
            dec: dec,
            blocknumber: ''
          }
          dispatch(tokenBalanceList({
            chainId,
            account,
            tokenList: blList
          }))
        }
        resolve(res)
      })
    })
  }, [rpcItem, chainId, account])

  const getAllBalance = useCallback(() => {
    const results = []
    for (let i = 0, len = calls.length; i < len; i += limit) {
      results.push(calls.slice(i, i + limit))
    }
    const arr = [getETHBalance()]
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
      && !isNaN(chainId)
      && account
      && calls.length > 0
      && !tokenListRef.current
    ) {
      tokenListRef.current = 1
      getAllBalance()
    }
  }, [library, calls, chainId, account, rpcItem])

  useEffect(() => {
    if (account) tokenListRef.current = 0
  }, [account])

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
