import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from 'anyswap-sdk'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getNetworkLibrary, NETWORK_CHAIN_ID } from '../connectors'
import { AppDispatch } from '../state'
import { fetchTokenList, routerTokenList } from '../state/lists/actions'
import { AppState } from '../state'
import getTokenList from '../utils/getTokenList'
import resolveENSContentHash from '../utils/resolveENSContentHash'
import { useActiveWeb3React } from './index'
// import { isAddress } from '../utils'
import config from '../config'
import {timeout} from '../config/constant'
// import {getAllToken} from '../utils/bridge/getServerInfo'
import {getUrlData} from '../utils/tools/axios'

export function useFetchListCallback(): (listUrl: string) => Promise<TokenList> {
  const { chainId, library } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()

  const ensResolver = useCallback(
    (ensName: string) => {
      if (!library || chainId !== ChainId.MAINNET) {
        if (NETWORK_CHAIN_ID === ChainId.MAINNET) {
          const networkLibrary = getNetworkLibrary()
          if (networkLibrary) {
            return resolveENSContentHash(ensName, networkLibrary)
          }
        }
        throw new Error('Could not construct mainnet ENS resolver')
      }
      return resolveENSContentHash(ensName, library)
    },
    [chainId, library]
  )

  return useCallback(
    async (listUrl: string) => {
      const requestId = nanoid()
      dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
      return getTokenList(listUrl, ensResolver)
        .then(tokenList => {
          console.log(tokenList)
          dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
          return tokenList
        })
        .catch(error => {
          // console.log(error)
          console.debug(`Failed to get list at url ${listUrl}`, error)
          // dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }))
          // throw error
          dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList: config.getCurChainInfo(chainId).tokenList, requestId }))
          return config.getCurChainInfo(chainId).tokenList
        })
    },
    [dispatch, ensResolver]
  )
}

export function useFetchTokenListCallback(): () => Promise<any> {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['lists']['routerTokenList']>(state => state.lists.routerTokenList)
  const curList = chainId && lists && lists[chainId] ? lists[chainId] : {}
  // console.log(lists)
  return useCallback(
    async () => {
      // const requestId = nanoid()
      // dispatch(routerTokenList({ requestId, url: listUrl }))
      if (!chainId) return
      if ((Date.now() - curList?.timestamp) <= timeout && curList?.tokenList && Object.keys(curList?.tokenList).length > 0) {
        // dispatch(routerTokenList({ chainId, tokenList:curList.tokenList }))
        return
      } else {
        const url = `${config.bridgeApi}/v3/serverinfo?chainId=${chainId}&version=all`
        return getUrlData(url)
          .then((tokenList:any) => {
            // console.log(tokenList)
            const list:any = {}
            if (tokenList.msg === 'Success' && tokenList.data) {
              const tList = tokenList.data
              for (const version in tList) {
                for (const token in tList[version]) {
                  list[token] = tList[version][token]
                }
              }
            }
            dispatch(routerTokenList({ chainId, tokenList:list }))
            return list
          })
          .catch(error => {
            // console.log(error)
            console.debug(`Failed to get list at url `, error)
            // dispatch(fetchTokenList.rejected({ url: listUrl, requestId, errorMessage: error.message }))
            // throw error
            dispatch(routerTokenList({ chainId, tokenList: curList.tokenList }))
            return {}
          })
      }
    },
    [dispatch, chainId]
  )
}