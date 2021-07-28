import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from 'anyswap-sdk'
import { TokenList } from '@uniswap/token-lists'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {GetRouterListByChainID} from 'multichain-bridge'
import { getNetworkLibrary, NETWORK_CHAIN_ID } from '../connectors'
import { AppDispatch } from '../state'
import { fetchTokenList, getBridgeTokenList } from '../state/lists/actions'
import getTokenList from '../utils/getTokenList'
import resolveENSContentHash from '../utils/resolveENSContentHash'
import { useActiveWeb3React } from './index'

import config from '../config'

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

  console.log(chainId)
  return useCallback(
    async () => {
      console.log(chainId)
      dispatch(getBridgeTokenList({ chainId, tokenList: {} }))
      // if (!chainId) return ''
      console.log(chainId)
      return GetRouterListByChainID({srcChainID: chainId}).then((tokenList:any) => {
          console.log(tokenList)
          dispatch(getBridgeTokenList({ chainId, tokenList }))
          return tokenList
        })
    },
    [dispatch, chainId]
  )
}