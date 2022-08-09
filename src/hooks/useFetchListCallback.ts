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
} from '../state/lists/actions'
import { poolList, updatePoollistTime } from '../state/pools/actions'
import { nftlist, updateNftlistTime } from '../state/nft/actions'
import { AppState } from '../state'

import {useActiveReact} from './useActiveReact'

import config from '../config'
// import {timeout, USE_VERSION, VERSION, bridgeApi} from '../config/constant'
import {
  MAIN_COIN_SORT
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
      const url = `${config.bridgeApi}/v4/nft/${chainId}`
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
  return useCallback(
    async () => {
      if (!chainId) return
      
      return getVersion().then(async(res:any) => {
        // let curTokenList:any = {}

        if (res.msg === 'Success') {
          const serverVersion = res.data

          
          const curDbTokenList:any = await getTokenlist(chainId)
          const curLSTokenList:any = tokenlists && tokenlists[chainId] ? tokenlists[chainId] : {}
          const localTokenVersion = curDbTokenList?.version ?? curLSTokenList?.version
          if (
            !serverVersion
            || !localTokenVersion
            || localTokenVersion !== serverVersion
          ) {
            getServerTokenlist(chainId).then(res => {
              if (res) {
                setTokenlist(chainId, res, serverVersion)
                dispatch(mergeTokenList({ chainId: chainId, tokenList:res, version: serverVersion }))
                dispatch(updateTokenlistTime({}))
              }
            })
          }

          const curDbPoolList:any = await getPoollist(chainId)
          const curLSPoolList:any = poollists && poollists[chainId] ? poollists[chainId] : {}
          const localPoolVersion = curDbPoolList?.version ?? curLSPoolList?.version
          if (
            !serverVersion
            || !localPoolVersion
            || localPoolVersion !== serverVersion
          ) {
            getServerPoolTokenlist(chainId).then(res => {
              // console.log(res)
              if (res) {
                setPoollist(chainId, res, serverVersion)
                dispatch(poolList({ chainId: chainId, tokenList:res, version: serverVersion }))
                dispatch(updatePoollistTime({}))
              }
            })
          }

          const curDbNftList:any = await getNftlist(chainId)
          const curLSNftList:any = nftlists && nftlists[chainId] ? nftlists[chainId] : {}
          const localNftVersion = curDbNftList?.version ?? curLSNftList?.version
          console.log(curLSNftList)
          console.log(curDbNftList)
          if (
            !serverVersion
            || !localNftVersion
            || localNftVersion !== serverVersion
          ) {
            getServerNftTokenlist(chainId).then(res => {
              console.log(res)
              if (res) {
                setNftlist(chainId, res, serverVersion)
                dispatch(nftlist({ chainId: chainId, tokenList:res, version: serverVersion }))
                dispatch(updateNftlistTime({}))
              }
            })
          }
        }
      })
    },
    [dispatch, chainId]
  )
}
