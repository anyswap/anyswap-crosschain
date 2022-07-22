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
  updateTokenlistTime,
  tokenlistversion
} from '../state/lists/actions'
import {useTokenListVersionUrl} from '../state/lists/hooks'
import { poolList, updatePoollistTime } from '../state/pools/actions'
import { AppState } from '../state'

import {useActiveReact} from './useActiveReact'

import config from '../config'
// import {timeout, USE_VERSION, VERSION, bridgeApi} from '../config/constant'
import {
  // timeout,
  MAIN_COIN
} from '../config/constant'
import {getUrlData} from '../utils/tools/axios'
import {
  setTokenlist,
  getTokenlist,
  isSupportIndexedDB,
  setPoollist,
  getPoollist,
} from '../utils/indexedDB'

function getVersion () {
  return new Promise(resolve => {
    const url = `${config.bridgeApi}/token/version`
    getUrlData(url).then((version:any) => {
      resolve(version)
    })
  })
}

function getServerTokenlist (chainId:any) {
  return new Promise(resolve => {
    let list:any = {}
    if (chainId) {
      const url = `${config.bridgeApi}/v4/tokenlistv4/${chainId}`
      getUrlData(url).then((tokenList:any) => {
        // console.log(tokenList)
        if (tokenList.msg === 'Success' && tokenList.data) {
          list = tokenList.data
          // const tList = tokenList.data
          // for (const tokenKey in tList) {
          //   list[tokenKey] = {
          //     ...tList[tokenKey],
          //     key: tokenKey,
          //     sort: MAIN_COIN.includes(tList[tokenKey].symbol) ? 1 : 2
          //   }
          // }
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
      const url = `${config.bridgeApi}/v4/poollist/${chainId}`
      getUrlData(url).then((tokenList:any) => {
        // console.log(tokenList)
        if (tokenList.msg === 'Success' && tokenList.data) {
          const tList = tokenList.data
          for (const tokenKey in tList) {
            list[tokenKey] = {
              ...tList[tokenKey],
              key: tokenKey,
              sort: MAIN_COIN.includes(tList[tokenKey].symbol) ? 1 : 2
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

export function useFetchTokenListVersionCallback(): () => Promise<any> {
  const dispatch = useDispatch<AppDispatch>()

  const { chainId } = useActiveReact()
  const tokenlists = useSelector<AppState, AppState['lists']['mergeTokenList']>(state => state.lists.mergeTokenList)
  const poollists = useSelector<AppState, AppState['pools']['poolList']>(state => state.pools.poolList)
  return useCallback(
    async () => {
      if (!chainId) return
      
      return getVersion().then(async(res:any) => {
        let curTokenList:any = {}
        if (isSupportIndexedDB) {
          curTokenList = await getTokenlist(chainId)
        } else {
          curTokenList = tokenlists && tokenlists[chainId] ? tokenlists[chainId] : {}
        }
  
        let curPoolList:any = {}
        if (isSupportIndexedDB) {
          curPoolList = await getPoollist(chainId)
        } else {
          curPoolList = poollists && poollists[chainId] ? poollists[chainId] : {}
        }
        
        // console.log(res)
        if (res.msg === 'Success') {
          const serverVersion = res.data
          if (
            !serverVersion
            || !curTokenList?.version
            || curTokenList.version !== serverVersion
          ) {
            getServerTokenlist(chainId).then(res => {
              if (res) {
                if (isSupportIndexedDB) {
                  setTokenlist(chainId, res, serverVersion)
                } else {
                  dispatch(mergeTokenList({ chainId: chainId, tokenList:res, version: serverVersion }))
                }
                dispatch(updateTokenlistTime({}))
              }
            })
          }
          if (
            !curPoolList?.version || curPoolList.version !== serverVersion
          ) {
            getServerPoolTokenlist(chainId).then(res => {
              // console.log(res)
              if (res) {
                if (isSupportIndexedDB) {
                  setPoollist(chainId, res, serverVersion)
                } else {
                  dispatch(poolList({ chainId: chainId, tokenList:res, version: serverVersion }))
                }
                dispatch(updatePoollistTime({}))
              }
            })
          }
          dispatch(tokenlistversion({version: serverVersion}))
        }
      })
    },
    [dispatch, chainId]
  )
}



// export function useFetchMergeTokenListCallback(): () => Promise<any> {

//   const { chainId } = useActiveReact()
//   const dispatch = useDispatch<AppDispatch>()
//   const lists = useSelector<AppState, AppState['lists']['mergeTokenList']>(state => state.lists.mergeTokenList)
//   const serverVersion = useTokenListVersionUrl()
  
//   return useCallback(
//     async () => {
//       if (!chainId) return
//       let curList:any = {}
//       if (isSupportIndexedDB) {
//         curList = await getTokenlist(chainId)
//       } else {
//         curList = lists && lists[chainId] ? lists[chainId] : {}
//       }
      
//       if (
//         // curList?.tokenList
//         curList
//         && (
//           !curList?.version
//           || curList.version !== serverVersion
//         )
//       ) {
//         return getServerTokenlist(chainId).then(res => {
//           if (res) {
//             if (isSupportIndexedDB) {
//               setTokenlist(chainId, res, serverVersion)
//             } else {
//               dispatch(mergeTokenList({ chainId: chainId, tokenList:res, version: serverVersion }))
//             }
//             dispatch(updateTokenlistTime({}))
//           }
//         })
//       } else {
//         dispatch(updateTokenlistTime({}))
//       }
//     },
//     [dispatch, chainId, serverVersion]
//   )
// }



export function useFetchPoolTokenListCallback(): () => Promise<any> {
  const { chainId } = useActiveReact()
  const dispatch = useDispatch<AppDispatch>()
  const lists = useSelector<AppState, AppState['pools']['poolList']>(state => state.pools.poolList)
  const serverVersion = useTokenListVersionUrl()
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
      console.log(chainId)
      console.log(curList)
      if (curList?.tokenList && (!curList?.version || curList.version !== serverVersion)) {
        return getServerPoolTokenlist(chainId).then(res => {
          console.log(res)
          if (res) {
            if (isSupportIndexedDB) {
              setPoollist(chainId, res, serverVersion)
            } else {
              dispatch(poolList({ chainId: chainId, tokenList:res, version: serverVersion }))
            }
            dispatch(updatePoollistTime({}))
          }
        })
      } else {
        dispatch(updatePoollistTime({}))
      }
    },
    [dispatch, chainId, serverVersion]
  )
}
