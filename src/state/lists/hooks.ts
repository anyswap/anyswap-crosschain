import { ChainId, Token } from 'anyswap-sdk'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, AppState } from '../index'
import config from '../../config'
import { isAddress } from 'ethers/lib/utils'
import {userSelectCurrency} from './actions'

import {getTokenlist, isSupportIndexedDB} from '../../utils/indexedDB'


/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: any
  public readonly tags: any[]
  constructor(tokenInfo: any, tags: any[]) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.tokenInfo = tokenInfo
    this.tags = tags
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}

export class WrappedBridgeTokenInfo extends Token {
  public readonly tokenInfo: any
  public readonly ContractVersion: any
  public readonly destChains: any
  public readonly logoUrl: any
  public readonly price: any
  public readonly sort: any
  constructor(tokenInfo: any) {
    super(
      tokenInfo.chainId,
      tokenInfo.address,
      tokenInfo.decimals,
      tokenInfo.symbol,
      tokenInfo.name,
      tokenInfo.underlying,
    )
    this.tokenInfo = tokenInfo
    this.ContractVersion = tokenInfo.ContractVersion
    this.destChains = tokenInfo.destChains
    this.logoUrl = tokenInfo.logoUrl
    this.price = tokenInfo.price
    this.sort = tokenInfo.sort
    // this.tags = tags
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}

export class WrappedAllTokenInfo extends Token {
  public readonly tokenInfo: any
  constructor(tokenInfo: any) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.tokenInfo = tokenInfo
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}

export type TokenAddressMap = Readonly<{ [chainId in ChainId]: Readonly<{ [tokenAddress: string]: WrappedTokenInfo }> }>

export function listsToTokenMap(list:any): TokenAddressMap {

  // console.log(list)
  const map:any = {}
  for (const t in list) {
    if(!isAddress(t) || !list[t].name || !list[t].symbol) continue
    // console.log(list[t])
    map[t] = new WrappedBridgeTokenInfo(list[t])
  }
  return map
}

export function listsMergeToTokenMap(list:any): TokenAddressMap {

  // console.log(list)
  const map:any = {}
  for (const t in list) {
    // if(!isAddress(t)) continue
    map[t] = new WrappedBridgeTokenInfo(list[t])
  }
  return map
}

export function allListsToTokenMap(mlist:any, chainId:any): TokenAddressMap {

  // console.log(list)
  const map:any = {}
  if (config.getCurChainInfo(chainId).anyToken) {
    map[config.getCurChainInfo(chainId).anyToken] = new WrappedAllTokenInfo({
      chainId: chainId,
      address: config.getCurChainInfo(chainId).anyToken,
      symbol: "ANY",
      name: "Anyswap",
      decimals: 18
    })
  }

  for (const t in mlist) {
    if(!isAddress(t)) continue
    if (mlist[t].underlying) {
      map[mlist[t].underlying.address] = new WrappedAllTokenInfo(mlist[t].underlying)
    }
    map[t] = new WrappedAllTokenInfo(mlist[t])
  }
  // console.log(map)
  return map
}

export function useBridgeTokenList(key?: string | undefined, chainId?:any): any {
  const lists:any = useSelector<AppState, AppState['lists']>(state => state.lists)
  // console.log(lists)
  const init = {}
  return useMemo(() => {
    if (!key || !chainId) return init
    const current = lists[key]?.[chainId]?.tokenList
    // console.log(current)
    if (!current) return init
    try {
      return listsToTokenMap(current)
      // return current
    } catch (error) {
      console.error('Could not show token list due to error', error)
      return init
    }
  }, [lists, key, chainId])
}

export function useAllMergeBridgeTokenList(key?: string | undefined, chainId?:any): any {
  const lists:any = useSelector<AppState, AppState['lists']>(state => state.lists)
  const updateTokenlistTime:any = useSelector<AppState, AppState['lists']>(state => state.lists.updateTokenlistTime)
  // console.log(updateTokenlistTime)
  const [tokenlist, setTokenlist] = useState<any>({})
  const getCurTokenlist = useCallback(() => {
    // console.log(updateTokenlistTime)
    if (isSupportIndexedDB) {
      getTokenlist(chainId).then((res:any) => {
        console.log(res)
        if (res?.tokenList) {
          setTokenlist(res.tokenList)
        } else {
          let current = key ? lists[key]?.[chainId]?.tokenList : ''
          if (!current) current = {}
          setTokenlist(current)
        }
      })
    } else {
      let current = key ? lists[key]?.[chainId]?.tokenList : ''
      if (!current) current = {}
      setTokenlist(current)
    }
  }, [chainId, updateTokenlistTime])

  useEffect(() => {
    getCurTokenlist()
  }, [getCurTokenlist, chainId, updateTokenlistTime])

  return tokenlist
}

export function useBridgeSelectedTokenList(key?: string | undefined, chainId?:any): TokenAddressMap {
  return useBridgeTokenList(key, chainId)
}


export function useInitUserSelectCurrency(chainId?: any) {
  const userInit = useSelector<AppState, AppState['lists']['userSelectCurrency']>(state => state.lists.userSelectCurrency)
  const dispatch = useDispatch<AppDispatch>()
  // console.log(userInit)
  // console.log(chainId)
  // console.log(userInit && chainId && userInit[chainId] ? userInit[chainId] : {})
  const setInitUserSelect = useCallback(({useChainId, token, toChainId}: {useChainId?: any, token?:any, toChainId?:any}) => {
    const id = useChainId ? useChainId : chainId
    if (id && toChainId && id?.toString() !== toChainId?.toString()){
      dispatch(userSelectCurrency({chainId: id, token, toChainId}))
    }
  }, [dispatch])

  return {
    userInit: userInit && chainId && userInit[chainId] ? userInit[chainId] : {},
    setInitUserSelect
  }
}
