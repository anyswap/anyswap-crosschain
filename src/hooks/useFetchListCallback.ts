import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from 'anyswap-sdk'
import { TokenList } from '@uniswap/token-lists'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {GetTokenListByChainID} from 'multichain-bridge'
import { getNetworkLibrary, NETWORK_CHAIN_ID } from '../connectors'
import { AppDispatch } from '../state'
import { fetchTokenList, routerTokenList, bridgeTokenList, mergeTokenList } from '../state/lists/actions'
import { AppState } from '../state'

import { useUserSelectChainId } from '../state/user/hooks'
import getTokenList from '../utils/getTokenList'
import resolveENSContentHash from '../utils/resolveENSContentHash'
import { useActiveWeb3React } from './index'
// import { isAddress } from '../utils'
import config from '../config'
import {timeout, USE_VERSION, VERSION, bridgeApi} from '../config/constant'
import {getUrlData} from '../utils/tools/axios'

import jsonTokenList from '../tokenlist.97.json'
import jsonServerInfo from '../serverinfo.97.json'


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
          console.log(jsonTokenList)
          if (true) {
            // @ts-ignore
            dispatch(fetchTokenList.fulfilled({ url: listUrl, jsonTokenList, requestId }))
            return jsonTokenList
          } else {
            dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
            return tokenList
          }
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

export function useFetchMergeTokenListCallback(): () => Promise<any> {
  const { chainId } = useActiveWeb3React()
  const [selectNetworkInfo] = useUserSelectChainId()
  const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['lists']['mergeTokenList']>(state => state.lists.mergeTokenList)
  const useChainId = useMemo(() => {
    if (selectNetworkInfo?.chainId) {
      return selectNetworkInfo?.chainId
    }
    return chainId
  }, [selectNetworkInfo, chainId])

  const curList = useChainId && lists && lists[useChainId] ? lists[useChainId] : {}

  // console.log(lists)
  return useCallback(
    async () => {
      if (!useChainId) return
      if ((Date.now() - curList?.timestamp) <= timeout && curList?.tokenList && Object.keys(curList?.tokenList).length > 0) {
        return
      } else {
        const url = `${config.bridgeApi}/merge/tokenlist/${useChainId}`
        return getUrlData(url)
          .then((tokenList:any) => {
            console.log('>>> useFetchMergeTokenListCallback', tokenList)
            let list:any = {}
            if (tokenList.msg === 'Success' && tokenList.data) {
              list = tokenList.data
            }
            if (true) {
              // @ts-ignore
              dispatch(mergeTokenList({ chainId: useChainId, tokenList: jsonTokenList }))
              return jsonTokenList
            } else {
              dispatch(mergeTokenList({ chainId: useChainId, tokenList:list }))
              return list
            }
          })
          .catch(error => {
            console.debug(`Failed to get list at url `, error)
            dispatch(mergeTokenList({ chainId: useChainId, tokenList: curList.tokenList }))
            return {}
          })
      }
    },
    [dispatch, useChainId]
  )
}

export function useFetchTokenListCallback(): () => Promise<any> {
  const { chainId } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['lists']['routerTokenList']>(state => state.lists.routerTokenList)
  const curList = chainId && lists && lists[chainId] ? lists[chainId] : {}
  // console.log(lists)
  console.log('>>> useFetchTokenListCallback')
  return useCallback(
    async () => {
      if (!chainId) return
      if ((Date.now() - curList?.timestamp) <= timeout && curList?.tokenList && Object.keys(curList?.tokenList).length > 0) {
        return
      } else {
        const UV:any = USE_VERSION
        const version:any = [VERSION.V5, VERSION.V6, VERSION.V7].includes(UV) ? 'all' : USE_VERSION
        const url = `${config.bridgeApi}/v3/serverinfoV4?chainId=${chainId}&version=${version}`
        return getUrlData(url)
          .then((tokenList:any) => {
            // console.log(tokenList)
            const list:any = {}
            if (tokenList.msg === 'Success' && tokenList.data) {
              const tList = (true) ? jsonServerInfo : tokenList.data
              if (version === 'all') {
                for (const version in tList) {
                  if (version.indexOf('ARB') !== -1) continue
                  for (const token in tList[version]) {
                    if (version.toLowerCase().indexOf('underlying') !== -1 && tList[version][token].symbol === 'DAI') continue
                    let sort = 0
                    if (version.toLowerCase().indexOf('stable') !== -1) {
                      sort = 0
                    } else if (version.toLowerCase().indexOf('native') !== -1) {
                      sort = 1
                    } else if (version.toLowerCase().indexOf('underlying') !== -1) {
                      sort = 2
                    }
                    list[token] = {
                      ...tList[version][token],
                      sort: sort
                    }
                  }
                }
              } else {
                for (const token in tList) {
                  // if (version.toLowerCase().indexOf('underlying') !== -1 && tList[token].symbol === 'DAI') continue
                  list[token] = {
                    ...tList[token],
                    sort: version.toLowerCase().indexOf('stable') !== -1 ? 0 : 1
                  }
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
      if (!chainId || !config.getCurConfigInfo().isOpenBridge) return
      if (
        lists
        && curList?.timestamp
        && (Date.now() - curList?.timestamp) <= timeout
        && curList?.tokenList
        && Object.keys(curList?.tokenList).length > 0
      ) {
        return
      } else {
        return GetTokenListByChainID({
          srcChainID: chainId,
          chainList: config.getCurConfigInfo().showChain,
          bridgeAPI: bridgeApi + '/v2/tokenlist'
        })
          .then((tokenList:any) => {
            // console.log(tokenList)
            dispatch(bridgeTokenList({ chainId, tokenList: tokenList.bridge }))
            return tokenList
          })
      }
    },
    [dispatch, chainId]
  )
}