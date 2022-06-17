// import { nanoid } from '@reduxjs/toolkit'
// import { ChainId } from 'anyswap-sdk'
// import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { getNetworkLibrary, NETWORK_CHAIN_ID } from '../connectors'
import { AppDispatch } from '../state'
import {
  // fetchTokenList,
  mergeTokenList,
  updateTokenlistTime
} from '../state/lists/actions'
import { poolList } from '../state/pools/actions'
import { AppState } from '../state'

import {useActiveReact} from './useActiveReact'

// import getTokenList from '../utils/getTokenList'
// import resolveENSContentHash from '../utils/resolveENSContentHash'
import { useActiveWeb3React } from './index'
// import { isAddress } from '../utils'
import config from '../config'
// import {timeout, USE_VERSION, VERSION, bridgeApi} from '../config/constant'
import {timeout, MAIN_COIN} from '../config/constant'
import {getUrlData} from '../utils/tools/axios'
import {
  setTokenlist,
  getTokenlist,
  isSupportIndexedDB,
  setPoollist,
  getPoollist,
} from '../utils/indexedDB'

// export function useFetchListCallback(): (listUrl: string) => Promise<TokenList> {
//   const { chainId, library } = useActiveWeb3React()
//   const dispatch = useDispatch<AppDispatch>()

//   const ensResolver = useCallback(
//     (ensName: string) => {
//       if (!library || chainId !== ChainId.MAINNET) {
//         if (NETWORK_CHAIN_ID === ChainId.MAINNET) {
//           const networkLibrary = getNetworkLibrary()
//           if (networkLibrary) {
//             return resolveENSContentHash(ensName, networkLibrary)
//           }
//         }
//         throw new Error('Could not construct mainnet ENS resolver')
//       }
//       return resolveENSContentHash(ensName, library)
//     },
//     [chainId, library]
//   )

//   return useCallback(
//     async (listUrl: string) => {
//       const requestId = nanoid()
//       dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
//       return getTokenList(listUrl, ensResolver)
//         .then(tokenList => {
//           console.log(tokenList)
//           dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
//           return tokenList
//         })
//         .catch(error => {
//           // console.log(error)
//           console.debug(`Failed to get list at url ${listUrl}`, error)
//           // dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }))
//           // throw error
//           dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList: config.getCurChainInfo(chainId).tokenList, requestId }))
//           return config.getCurChainInfo(chainId).tokenList
//         })
//     },
//     [dispatch, ensResolver]
//   )
// }

export function useFetchMergeTokenListCallback(): () => Promise<any> {

  const { chainId } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['lists']['mergeTokenList']>(state => state.lists.mergeTokenList)

  
  return useCallback(
    async () => {
      if (!chainId) return
      let curList:any = {}
      if (isSupportIndexedDB) {
        curList = await getTokenlist(chainId)
      } else {
        curList = lists && lists[chainId] ? lists[chainId] : {}
      }
      // console.log(lists)
      // console.log(curList)
      // console.log(chainId)
      if ((Date.now() - curList?.timestamp) <= timeout && curList?.tokenList && Object.keys(curList?.tokenList).length > 0) {
        return
      } else {
        // const url = `${config.bridgeApi}/merge/tokenlist/${chainId}`
        // const url = `${config.bridgeApi}/v4/tokenlistv3/${chainId}`
        // const url = `${config.bridgeApi}/cfx/v4/tokenlistv3/${chainId}`
        const url = `${config.bridgeApi}/v4/tokenlistv4/${chainId}`
        return getUrlData(url)
          .then((tokenList:any) => {
            console.log(tokenList)
            let list:any = {}
            if (tokenList.msg === 'Success' && tokenList.data) {
              list = tokenList.data
            }
            if (isSupportIndexedDB) {
              setTokenlist(chainId, list)
            } else {
              dispatch(mergeTokenList({ chainId: chainId, tokenList:list }))
            }
            dispatch(updateTokenlistTime({}))
            return list
          })
          .catch(error => {
            console.debug(`Failed to get list at url `, error)
            dispatch(mergeTokenList({ chainId: chainId, tokenList: curList.tokenList }))
            return {}
          })
      }
    },
    [dispatch, chainId]
  )
}

export function useFetchPoolTokenListCallback(): () => Promise<any> {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['pools']['poolList']>(state => state.pools.poolList)
  // const curList = chainId && lists && lists[chainId] ? lists[chainId] : {}
  // console.log(lists)
  return useCallback(
    async () => {
      if (!chainId) return
      let curList:any = {}
      if (isSupportIndexedDB) {
        curList = await getPoollist(chainId)
      } else {
        curList = lists && lists[chainId] ? lists[chainId] : {}
      }
      if ((Date.now() - curList?.timestamp) <= timeout && curList?.tokenList && Object.keys(curList?.tokenList).length > 0) {
        return
      } else {
        const url = `${config.bridgeApi}/v4/poollist/${chainId}`
        return getUrlData(url)
          .then((tokenList:any) => {
            // console.log(tokenList)
            const list:any = {}
            if (tokenList.msg === 'Success' && tokenList.data) {
              const tList = tokenList.data
              for (const tokenKey in tList) {
                list[tokenKey] = {
                  ...tList[tokenKey],
                  key: tokenKey,
                  sort: MAIN_COIN.includes(tList[tokenKey].symbol) ? 1 : 2
                }
              }
            }
            if (isSupportIndexedDB) {
              setPoollist(chainId, list)
            } else {
              dispatch(poolList({ chainId, tokenList:list }))
            }
            return list
          })
          .catch(error => {
            console.debug(`Failed to get list at url `, error)
            dispatch(poolList({ chainId, tokenList: curList.tokenList }))
            return {}
          })
      }
    },
    [dispatch, chainId]
  )
}
