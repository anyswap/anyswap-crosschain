import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from 'anyswap-sdk'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {GetTokenListByChainID} from 'multichain-bridge'
import { getNetworkLibrary, NETWORK_CHAIN_ID } from '../connectors'
import { AppDispatch } from '../state'
import { fetchTokenList, routerTokenList, bridgeTokenList } from '../state/lists/actions'
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
      if (!chainId) return
      if ((Date.now() - curList?.timestamp) <= timeout && curList?.tokenList && Object.keys(curList?.tokenList).length > 0) {
        return
      } else {
        const url = `${config.bridgeApi}/v3/serverinfoV2?chainId=${chainId}&version=all`
        return getUrlData(url)
          .then((tokenList:any) => {
            // console.log(tokenList)
            const list:any = {}
            if (tokenList.msg === 'Success' && tokenList.data) {
              const tList = tokenList.data
              // const sortObj = {
              //   stable: {},
              //   underlying: {}
              // }
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
            console.debug(`Failed to get list at url `, error)
            dispatch(routerTokenList({ chainId, tokenList: curList.tokenList }))
            return {}
          })
      }
    },
    [dispatch, chainId]
  )
}

export function useFetchTokenList1Callback(): () => Promise<any> {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['lists']['bridgeTokenList']>(state => state.lists.bridgeTokenList)
  const curList = chainId && lists && lists[chainId] ? lists[chainId] : {}
  return useCallback(
    async () => {
      if (!chainId) return
      if (
        lists
        && curList?.timestamp
        && (Date.now() - curList?.timestamp) <= timeout
        && curList?.tokenList
        && Object.keys(curList?.tokenList).length > 0
      ) {
        return
      } else {
        return GetTokenListByChainID({srcChainID: chainId, chainList: config.getCurConfigInfo().showChain})
          .then((tokenList:any) => {
            console.log(tokenList)
            dispatch(bridgeTokenList({ chainId, tokenList: tokenList.bridge }))
            return tokenList
          })
      }
    },
    [dispatch, chainId]
  )
}