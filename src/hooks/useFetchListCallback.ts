import { nanoid } from '@reduxjs/toolkit'
import { ChainId } from 'anyswap-sdk'
import { TokenList } from '@uniswap/token-lists'
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {GetTokenListByChainID} from 'multichain-bridge'
import { getNetworkLibrary, NETWORK_CHAIN_ID } from '../connectors'
import { AppDispatch } from '../state'
import { fetchTokenList, routerTokenList, bridgeTokenList, mergeTokenList } from '../state/lists/actions'
// @ts-ignore
import { useAppState } from '../state/application/hooks'
import { AppState } from '../state'
import { useUserSelectChainId } from '../state/user/hooks'
import getTokenList from '../utils/getTokenList'
import resolveENSContentHash from '../utils/resolveENSContentHash'
import { useActiveWeb3React } from './index'
// import { isAddress } from '../utils'
import config from '../config'
import { timeout, USE_VERSION, VERSION } from '../config/constant'
import { getUrlData } from '../utils/tools/axios'
// @ts-ignore
import jsonTokenList from '../tokenlist.80001.json'
// @ts-ignore
import jsonServerInfo from '../serverinfo.80001.json'

const prepareServerList = (chainId: any, pairs: any) => {
  try {
    const serverList: any = {
      STABLEV3: {},
      UNDERLYINGV2: {},
      NATIVE: {}
    }
    pairs.forEach((pairData: any) => {
      let mainToken: any = null
      const pairTokens: any = {}
      const tokenID = pairData.tokenID

      pairData.multichainTokens.forEach((tokenData: any) => {
        if (tokenData.chainId == chainId) {
          mainToken = tokenData
        }
      })

      if (mainToken !== null) {
        pairData.multichainTokens.forEach((tokenData: any) => {
          if (tokenData.chainId !== chainId) {
            //if (!pairTokens[tokenData.chainId]) pairTokens[tokenData.chainId] = {}
            pairTokens[tokenData.chainId]/*[tokenData.anyswapToken.Underlying]*/ = {
              name: tokenID,
              symbol: tokenID,
              decimals: tokenData.anyswapToken.Decimals,
              address: tokenData.anyswapToken.Underlying,
              source: "SERVERLIST",
              underlying: {
                address: tokenData.anyswapToken.ContractAddress,
                decimals: tokenData.anyswapToken.Decimals,
                name: tokenID,
                symbol: tokenID,
              },
              type: "STABLEV3",
              tokenid: tokenID,
              swapfeeon: 1,
              MaximumSwap: 20000000,
              MinimumSwap: 12,
              BigValueThreshold: 5000000,
              SwapFeeRatePerMillion: 0.1,
              MaximumSwapFee: 0.9,
              MinimumSwapFee: 0.9,
              routerToken: mainToken.router.RouterContract,
            }
          }
        })

        serverList.STABLEV3[mainToken.anyswapToken.Underlying] = {
          address: mainToken.anyswapToken.Underlying,
          name: tokenID,
          symbol: tokenID,
          decimals: mainToken.anyswapToken.Decimals,
          underlying: {
            address: mainToken.anyswapToken.ContractAddress,
            decimals: mainToken.anyswapToken.Decimals,
            name: tokenID,
            symbol: tokenID,
          },
          destChains: pairTokens,
          price: 1,
          logoUrl: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
          chainId,
        }
      }
    })
    return serverList
  } catch (err) { console.log('>>>> prepareServerList ERROR', err) }
}


const prepareTokenList = (chainId: any, pairs: any) => {
  try {
    const tokenList: any = {}
    pairs.forEach((pairData: any) => {
      let mainToken: any = null
      const pairTokens: any = {}
      // @ts-ignore
      const tokenID = pairData.tokenID
      pairData.multichainTokens.forEach((tokenData: any) => {
        if (tokenData.chainId == chainId) {
          mainToken = tokenData
        }
      })
      if (mainToken !== null) {
        pairData.multichainTokens.forEach((tokenData: any) => {
          if (tokenData.chainId !== chainId) {
            if (!pairTokens[tokenData.chainId]) pairTokens[tokenData.chainId] = {}
            pairTokens[tokenData.chainId][tokenData.anyswapToken.Underlying] = {
              name: tokenID,
              symbol: tokenID,
              decimals: tokenData.anyswapToken.Decimals,
              address: tokenData.anyswapToken.Underlying,
              source: "TOKENLIST",
              underlying: {
                address: tokenData.anyswapToken.ContractAddress,
                decimals: tokenData.anyswapToken.Decimals,
                name: tokenID,
                symbol: tokenID,
              },
              type: "STABLEV3",
              tokenid: tokenID,
              swapfeeon: 1,
              MaximumSwap: 20000000,
              MinimumSwap: 12,
              BigValueThreshold: 5000000,
              SwapFeeRatePerMillion: 0.1,
              MaximumSwapFee: 0.9,
              MinimumSwapFee: 0.9,
              routerToken: mainToken.router.RouterContract,
            }
          }
        })
        tokenList[mainToken.anyswapToken.Underlying] = {
          address: mainToken.anyswapToken.Underlying,
          name: tokenID,
          symbol: tokenID,
          decimals: mainToken.anyswapToken.Decimals,
          underlying: {
            address: mainToken.anyswapToken.ContractAddress,
            decimals: mainToken.anyswapToken.Decimals,
            name: tokenID,
            symbol: tokenID,
          },
          destChains: pairTokens,
          price: 1,
          logoUrl: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
          chainId,
        }
      }
    })

    return tokenList
  } catch (err) { console.log('>>>> ERROR 2', err) }
}

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

export function useFetchMergeTokenListCallback(): () => Promise<any> {
  const { chainId } = useActiveWeb3React()
  const [selectNetworkInfo] = useUserSelectChainId()
  const { apiAddress } = useAppState()
  const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['lists']['mergeTokenList']>(state => state.lists.mergeTokenList)
  const useChainId = useMemo(() => {
    if (selectNetworkInfo?.chainId) {
      return selectNetworkInfo?.chainId
    }
    return chainId
  }, [selectNetworkInfo, chainId])

  const curList = useChainId && lists && lists[useChainId] ? lists[useChainId] : {}

  return useCallback(async () => {
    if (!useChainId || !apiAddress) {
      return
    }
    if (
      Date.now() - curList?.timestamp <= timeout &&
      curList?.tokenList &&
      Object.keys(curList?.tokenList).length > 0
    ) {
      console.log(">>> useFetchMergeTokenListCallback return call", curList) 
      //return
    }

    const url = `http://${apiAddress}/config`

    return getUrlData(url)
      .then((tokenList: any) => {
        const resultTokenList = prepareTokenList(chainId, tokenList.data)
        
        dispatch(mergeTokenList({ chainId: useChainId, tokenList: resultTokenList }))
        return resultTokenList
      })
      .catch(error => {
        console.debug(`Failed to get list at url `, error)
        dispatch(mergeTokenList({ chainId: useChainId, tokenList: curList.tokenList }))
        return {}
      })
  }, [dispatch, useChainId, apiAddress])
}

export function useFetchTokenListCallback(): () => Promise<any> {
  const { chainId } = useActiveWeb3React()
  const { apiAddress } = useAppState()
  const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['lists']['routerTokenList']>(state => state.lists.routerTokenList)
  const curList = chainId && lists && lists[chainId] ? lists[chainId] : {}

  return useCallback(async () => {
    if (!chainId || !apiAddress) return
    if (
      Date.now() - curList?.timestamp <= timeout &&
      curList?.tokenList &&
      Object.keys(curList?.tokenList).length > 0
    ) {
      console.log('>>> use cached')
      //return
    }

    const UV: any = USE_VERSION
    const version: any = [VERSION.V5, VERSION.V6, VERSION.V7].includes(UV) ? 'all' : USE_VERSION
    const url = `http://${apiAddress}/config`
    console.log('>>>> URL', url)

    return getUrlData(url)
      .then((tokenList: any) => {
        const list: any = {}
        const parsedServerList = prepareServerList(chainId, tokenList.data)

        const tList = parsedServerList // true ? chainServerList : tokenList.data
          

        if (version === 'all') {
          for (const version in tList) {
            if (version.indexOf('ARB') !== -1) continue

            for (const token in tList[version]) {
              if (version.toLowerCase().indexOf('underlying') !== -1 && tList[version][token].symbol === 'DAI')
                continue
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
            list[token] = {
              ...tList[token],
              sort: version.toLowerCase().indexOf('stable') !== -1 ? 0 : 1
            }
          }
        }

        dispatch(routerTokenList({ chainId, tokenList: list }))
        return list
      })
      .catch(error => {
        console.debug(`Failed to get list at url `, error)
        dispatch(routerTokenList({ chainId, tokenList: curList.tokenList }))
        return {}
      })
  }, [dispatch, chainId, apiAddress])
}

// deprecated - not used isOpenBridge = false
export function useFetchTokenList1Callback(): () => Promise<any> {
  const { chainId } = useActiveWeb3React()
  const { apiAddress } = useAppState()
  const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['lists']['bridgeTokenList']>(state => state.lists.bridgeTokenList)
  const curList = chainId && lists && lists[chainId] ? lists[chainId] : {}

  return useCallback(async () => {
    if (!chainId || !apiAddress || !config.getCurConfigInfo().isOpenBridge) {
      return
    }
    if (
      lists &&
      curList?.timestamp &&
      Date.now() - curList?.timestamp <= timeout &&
      curList?.tokenList &&
      Object.keys(curList?.tokenList).length > 0
    ) {
      return
    }
    return GetTokenListByChainID({
      srcChainID: chainId,
      chainList: config.getCurConfigInfo().showChain,
      bridgeAPI: `http://${apiAddress}/v2/tokenlist`
    })
      .then((tokenList: any) => {
        dispatch(bridgeTokenList({ chainId, tokenList: tokenList.bridge }))
        return tokenList
      })
      .catch(error => {
        console.error(error)
      })
  }, [dispatch, chainId, apiAddress])
}