
import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import { getNetworkLibrary, NETWORK_CHAIN_ID } from '../connectors'
import { AppDispatch } from '../state'
import {
  // fetchTokenList,
  mergeTokenList,
  updateTokenlistTime,
} from '../state/lists/actions'
import { poolList, updatePoollistTime } from '../state/pools/actions'
import { nftlist, updateNftlistTime } from '../state/nft/actions'
import { AppState } from '../state'

import {useActiveReact} from './useActiveReact'

import config from '../config'
// import {spportChainArr} from '../config/chainConfig'
// import {timeout, USE_VERSION, VERSION, bridgeApi} from '../config/constant'
import {
  MAIN_COIN_SORT,
  // USE_VERSION,
  // controlConfig
  // VERSION
} from '../config/constant'
import {getUrlData} from '../utils/tools/axios'
import {
  setTokenlist,
  getTokenlist,
  setPoollist,
  getPoollist,
  setNftlist,
  getNftlist
} from '../utils/indexedDB'

// console.log(controlConfig[USE_VERSION])

function getVersion () {
  return new Promise(resolve => {
    const url = `${config.multiAridgeApi}/token/version`
    getUrlData(url).then((version:any) => {
      resolve(version)
    })
  })
}

function getServerTokenlist (chainId:any) {
  return new Promise(resolve => {
    let list:any = {}
    if (chainId) {
      const url = `${config.multiAridgeApi}/v4/tokenlistv4/${chainId}`
      getUrlData(url).then((tokenList:any) => {
        // console.log(tokenList)
        if (tokenList.msg === 'Success' && tokenList.data) {
          list = tokenList.data
          resolve(list)
        } else {
          resolve('')
        }
      })
    } else {
      resolve('')
    }
  })
}

function getServerPoolTokenlist (chainId:any) {
  return new Promise(resolve => {
    const list:any = {}
    if (chainId) {
      const url = `${config.multiAridgeApi}/v4/poollist/${chainId}`
      getUrlData(url).then((tokenList:any) => {
        // console.log(tokenList)
        if (tokenList.msg === 'Success' && tokenList.data) {
          const tList = tokenList.data
          for (const tokenKey in tList) {
            // if (controlConfig[USE_VERSION].hiddenCoin.includes(tokenKey)) continue
            list[tokenKey] = {
              ...tList[tokenKey],
              key: tokenKey,
              sort: MAIN_COIN_SORT?.[tList[tokenKey].symbol]?.sort ?? 1000
            }
          }
          resolve(list)
        } else {
          resolve('')
        }
      })
    } else {
      resolve('')
    }
  })
}

function getServerNftTokenlist (chainId:any) {
  return new Promise(resolve => {
    let list:any = {}
    if (chainId) {
      const url = `${config.multiAridgeApi}/v4/nft/${chainId}`
      getUrlData(url).then((tokenList:any) => {
        // console.log(tokenList)
        if (tokenList.msg === 'Success' && tokenList.data) {
          list = tokenList.data
          resolve(list)
        } else {
          resolve('')
        }
      })
    } else {
      resolve('')
    }
  })
}

export function useFetchTokenListVersionCallback(): () => Promise<any> {
  const dispatch = useDispatch<AppDispatch>()

  const { chainId } = useActiveReact()
  const tokenlists = useSelector<AppState, AppState['lists']['mergeTokenList']>(state => state.lists.mergeTokenList)
  const poollists = useSelector<AppState, AppState['pools']['poolList']>(state => state.pools.poolList)
  const nftlists = useSelector<AppState, AppState['nft']['nftlist']>(state => state.nft.nftlist)

  const useChain = useMemo(() => {
    if (chainId) {
      return chainId
    } else if (config.getCurChainInfo(chainId).chainID) {
      return config.getCurChainInfo(chainId).chainID
    }
    return undefined
  }, [chainId])
  
  return useCallback(
    async () => {
      // console.log(useChain)
      if (!useChain) return
      // console.log(useChain)
      
      return getVersion().then(async(res:any) => {
        // let curTokenList:any = {}

        if (res.msg === 'Success') {
          const serverVersion = res.data

          
          const curDbTokenList:any = await getTokenlist(useChain)
          const curLSTokenList:any = tokenlists && tokenlists[useChain] ? tokenlists[useChain] : {}
          const localTokenVersion = curDbTokenList?.version ?? curLSTokenList?.version
          // console.log(serverVersion)
          // console.log(localTokenVersion)
          // console.log(localTokenVersion !== serverVersion)
          if (
            !serverVersion
            || !localTokenVersion
            || localTokenVersion !== serverVersion
          ) {
            getServerTokenlist(useChain).then(res => {
              if (res) {
                setTokenlist(useChain, res, serverVersion)
                dispatch(mergeTokenList({ chainId: useChain, tokenList:res, version: serverVersion }))
                dispatch(updateTokenlistTime({}))
              }
            })
          }

          const curDbPoolList:any = await getPoollist(useChain)
          const curLSPoolList:any = poollists && poollists[useChain] ? poollists[useChain] : {}
          const localPoolVersion = curDbPoolList?.version ?? curLSPoolList?.version
          if (
            !serverVersion
            || !localPoolVersion
            || localPoolVersion !== serverVersion
          ) {
            getServerPoolTokenlist(useChain).then(res => {
              // console.log(res)
              if (res) {
                setPoollist(useChain, res, serverVersion)
                dispatch(poolList({ chainId: useChain, tokenList:res, version: serverVersion }))
                dispatch(updatePoollistTime({}))
              }
            })
          }

          const curDbNftList:any = await getNftlist(useChain)
          const curLSNftList:any = nftlists && nftlists[useChain] ? nftlists[useChain] : {}
          const localNftVersion = curDbNftList?.version ?? curLSNftList?.version
          // console.log(curLSNftList)
          // console.log(curDbNftList)
          if (
            // USE_VERSION === VERSION.V7_TEST
            // && 
            (
              !serverVersion
              || !localNftVersion
              || localNftVersion !== serverVersion
            )
          ) {
            getServerNftTokenlist(useChain).then(res => {
              console.log(res)
              if (res) {
                setNftlist(useChain, res, serverVersion)
                dispatch(nftlist({ chainId: useChain, tokenList:res, version: serverVersion }))
                dispatch(updateNftlistTime({}))
              }
            })
          }
        }
      })
    },
    [dispatch, useChain]
  )
}
