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
  console.log('>>> call prepareServerList', chainId, pairs)
  const serverList: any = {
    STABLEV3: {},
    UNDERLYINGV2: {},
    NATIVE: {}
  }
  pairs.forEach((pairData: any) => {
    let mainToken: any = null
    const pairTokens: any = {}
    console.log('>>> pair data', pairData)
    const tokenID = pairData.tokenID
    pairData.multichainTokens.forEach((tokenData: any) => {
      console.log('>>>> tokenData', tokenData, tokenData.chainId, chainId)
      if (tokenData.chainId == chainId) {
        mainToken = tokenData
      }
    })
    console.log('>>> mainToken', mainToken)
    if (mainToken !== null) {
    
      pairData.multichainTokens.forEach((tokenData: any) => {
        if (tokenData.chainId !== chainId) {
          if (!pairTokens[tokenData.chainId]) pairTokens[tokenData.chainId] = {}
          pairTokens[tokenData.chainId][tokenData.anyswapToken.Underlying] = {
            name: tokenID,
            symbol: tokenID,
            decimals: tokenData.anyswapToken.Decimals,
            address: tokenData.anyswapToken.Underlying,
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
      console.log('>>>>> TTT', serverList)
    }
  })
  console.log('>>>> serverList', serverList)
  return serverList
} catch (err) { console.log('>>>> ERROR', err) }
}

const prepareServerList2 = (chainId: any) => {
  //const { apiAddress } = useAppState()
  const serverList: any = {
    STABLEV3: {},
    UNDERLYINGV2: {},
    NATIVE: {}
  }
  console.log('>>>> prepareServerList', config)
  // @ts-ignore
  window.evmcc_pairs.forEach((pairData) => {
    let mainToken: any = null
    const pairTokens: any = {}
    console.log('>>> pair data', pairData)
    pairData.forEach((tokenData: any) => {
      if (tokenData.chainId === chainId) {
        mainToken = tokenData
      }
    })
    if (mainToken !== null) {
      pairData.forEach((tokenData: any) => {
        if (tokenData.chainId !== chainId) {
          if (!pairTokens[tokenData.chainId]) pairTokens[tokenData.chainId] = {}
          pairTokens[tokenData.chainId][tokenData.address] = {
            name: tokenData.name,
            symbol: tokenData.symbol,
            decimals: tokenData.decimals,
            address: tokenData.address,
            underlying: tokenData.underlying,
            type: "STABLEV3",
            tokenid: tokenData.symbol,
            swapfeeon: 1,
            MaximumSwap: 20000000,
            MinimumSwap: 12,
            BigValueThreshold: 5000000,
            SwapFeeRatePerMillion: 0.1,
            MaximumSwapFee: 0.9,
            MinimumSwapFee: 0.9,
            routerToken: mainToken.routerToken,
          }
        }
      })

      serverList.STABLEV3[mainToken.address] = {
        address: mainToken.address,
        name: mainToken.name,
        symbol: mainToken.symbol,
        decimals: mainToken.decimals,
        underlying: mainToken.underlying,
        destChains: pairTokens,
        price: 1,
        logoUrl: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
        chainId,
      }
      console.log('>>>>>', mainToken, pairTokens, serverList)
    }
  })
  return serverList
}

const prepareTokenList = (chainId: any, pairs: any) => {
console.log('>>> prepareTokenList call', chainId, pairs)
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
          pairTokens[tokenData.chainId][tokenData.anyswapToken.ContractAddress] = {
            name: tokenID,
            symbol: tokenID,
            decimals: tokenData.anyswapToken.Decimals,
            address: tokenData.anyswapToken.ContractAddress,
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
      tokenList[mainToken.anyswapToken.ContractAddress] = {
        address: mainToken.anyswapToken.ContractAddress,
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
      console.log('>>>>>', mainToken, pairTokens, tokenList)
    }
  })

  return tokenList
} catch (err) { console.log('>>>> ERROR 2', err) }
}
const prepareTokenList2 = (chainId: any) => {
  //const { apiAddress } = useAppState()
  const tokenList: any = {}
  //console.log('>>> prepareTokenList', config, apiAddress)
  // @ts-ignore
  window.evmcc_pairs.forEach((pairData) => {
    let mainToken: any = null
    const pairTokens: any = {}
    //console.log('>>> pair data', pairData)
    pairData.forEach((tokenData: any) => {
      if (tokenData.chainId === chainId) {
        mainToken = tokenData
      }
    })
    if (mainToken !== null) {
      pairData.forEach((tokenData: any) => {
        if (tokenData.chainId !== chainId) {
          if (!pairTokens[tokenData.chainId]) pairTokens[tokenData.chainId] = {}
          pairTokens[tokenData.chainId][tokenData.address] = {
            name: tokenData.name,
            symbol: tokenData.symbol,
            decimals: tokenData.decimals,
            address: tokenData.address,
            underlying: tokenData.underlying,
            type: "STABLEV3",
            tokenid: tokenData.symbol,
            swapfeeon: 1,
            MaximumSwap: 20000000,
            MinimumSwap: 12,
            BigValueThreshold: 5000000,
            SwapFeeRatePerMillion: 0.1,
            MaximumSwapFee: 0.9,
            MinimumSwapFee: 0.9,
            routerToken: mainToken.routerToken,
          }
        }
      })

      tokenList[mainToken.address] = {
        address: mainToken.address,
        name: mainToken.name,
        symbol: mainToken.symbol,
        decimals: mainToken.decimals,
        underlying: mainToken.underlying,
        destChains: pairTokens,
        price: 1,
        logoUrl: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
        chainId,
      }
      //console.log('>>>>>', mainToken, pairTokens, tokenList)
    }
  })
  return tokenList
}

export function useFetchListCallback(): (listUrl: string) => Promise<TokenList> {
//console.log('>>>> useFetchListCallback')
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
      console.log('>>>> TTTTTTTTTTT')
      const chainTokenList = prepareTokenList2(chainId)
      //console.log('>>> listUrl', listUrl)
      return getTokenList(listUrl, ensResolver)
        .then(tokenList => {
          //console.log(tokenList)
          //console.log(jsonTokenList, chainTokenList)
          if (true) {
            // @ts-ignore
            dispatch(fetchTokenList.fulfilled({ url: listUrl, chainTokenList, requestId }))
            return chainTokenList
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
  //console.log('>>> useFetchMergeTokenListCallback')
  const { chainId } = useActiveWeb3React()
  const [selectNetworkInfo] = useUserSelectChainId()
  //const { apiAddress } = useAppState()
  const apiAddress = 'http://localhost:11556'
  //console.log('>>>>>> apiAddress', apiAddress)
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
  return useCallback(async () => {
    //console.log('>>>> this')
    if (!useChainId || !apiAddress) {
      //console.log('>>>> return 1', useChainId, apiAddress)
      return
    }
    if (
      Date.now() - curList?.timestamp <= timeout &&
      curList?.tokenList &&
      Object.keys(curList?.tokenList).length > 0
    ) {
      //console.log(">>> useFetchMergeTokenListCallback return call", curList) 
      //return
    }

    //const url = `http://${apiAddress}/merge/tokenlist/${useChainId}`
    const url = `${apiAddress}/config`
console.log('>>>> call getUrlData', url)

    return getUrlData(url)
      .then((tokenList: any) => {
        console.log('>>> useFetchMergeTokenListCallback', tokenList)
        const resultTokenList = prepareTokenList(chainId, tokenList.data)
        const chainTokenList = prepareTokenList2(chainId)
        console.log('prepared token list', chainId, resultTokenList, chainTokenList)
        
        //console.log('>>> useFetchMergeTokenListCallback', tokenList, chainTokenList, jsonTokenList)
        if (true) {
          dispatch(mergeTokenList({ chainId: useChainId, tokenList: chainTokenList /*resultTokenList*/ }))
          return resultTokenList
        }
        //console.log('>>> resultTokenList', resultTokenList)
        
        let list: any = {}
        if (tokenList.msg === 'Success' && tokenList.data) {
          list = tokenList.data
        }
        if (true) {
          // @ts-ignore
          dispatch(mergeTokenList({ chainId: useChainId, tokenList: chainTokenList }))
          return chainTokenList
        } else {
          dispatch(mergeTokenList({ chainId: useChainId, tokenList: list }))
          return list
        }
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
  //const { apiAddress } = useAppState()
  const apiAddress = 'http://localhost:11556'
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
    //const url = `http://${apiAddress}/v3/serverinfoV4?chainId=${chainId}&version=${version}`
    const url = `${apiAddress}/config`
    // console.group('%c useFetchTokenListCallback', 'color: brown')
    // console.log('curList: ', curList)
    // console.groupEnd()

    return getUrlData(url)
      .then((tokenList: any) => {
        //console.log('>>>> useFetchTokenListCallback tokenList', tokenList)
        const list: any = {}
        const parsedServerList = prepareServerList(chainId, tokenList.data)
        //console.log('>>> parsedServerList', parsedServerList)
        // if (tokenList.msg === 'Success' && tokenList.data) {
        if (true) {
          const chainServerList = prepareServerList2(chainId)
          const tList = parsedServerList // true ? chainServerList : tokenList.data
          console.log('>>> TWO', chainServerList, parsedServerList)
          console.log('>>>> chainServerList', chainServerList, jsonServerInfo)

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
              // if (version.toLowerCase().indexOf('underlying') !== -1 && tList[token].symbol === 'DAI') continue
              list[token] = {
                ...tList[token],
                sort: version.toLowerCase().indexOf('stable') !== -1 ? 0 : 1
              }
            }
          }
        }
        console.log('list: ', list)

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

export function useFetchTokenList1Callback(): () => Promise<any> {
  //console.log('>>>> call useFetchTokenList1Callback')
  const { chainId } = useActiveWeb3React()
  //const { apiAddress } = useAppState()
  const apiAddress = 'http://localhost:11556'
  const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['lists']['bridgeTokenList']>(state => state.lists.bridgeTokenList)
  const curList = chainId && lists && lists[chainId] ? lists[chainId] : {}

  return useCallback(async () => {
    if (!chainId || !apiAddress || !config.getCurConfigInfo().isOpenBridge) {
      console.log('>>>> call useFetchTokenList1Callback return 1', chainId, apiAddress, config.getCurConfigInfo().isOpenBridge)
      return
    }
    if (
      lists &&
      curList?.timestamp &&
      Date.now() - curList?.timestamp <= timeout &&
      curList?.tokenList &&
      Object.keys(curList?.tokenList).length > 0
    ) {
      console.log('>>>> call useFetchTokenList1Callback return 2')
      return
    }

    return GetTokenListByChainID({
      srcChainID: chainId,
      chainList: config.getCurConfigInfo().showChain,
      bridgeAPI: `http://${apiAddress}/v2/tokenlist`
    })
      .then((tokenList: any) => {
        console.log('>>>> call useFetchTokenList1Callback', tokenList)
        dispatch(bridgeTokenList({ chainId, tokenList: tokenList.bridge }))
        return tokenList
      })
      .catch(error => {
        console.error(error)
      })
  }, [dispatch, chainId, apiAddress])
}