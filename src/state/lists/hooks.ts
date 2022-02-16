import { toChecksumAddress } from 'web3-utils'
import { ChainId, Token } from 'anyswap-sdk'
import { Tags, TokenInfo, TokenList } from '@uniswap/token-lists'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { AppState } from '../index'
import config from '../../config'
import { isAddress } from 'ethers/lib/utils'

type TagDetails = Tags[keyof Tags]
export interface TagInfo extends TagDetails {
  id: string
}

/**
 * Token instances created from token info.
 */
export class WrappedTokenInfo extends Token {
  public readonly tokenInfo: TokenInfo
  public readonly tags: TagInfo[]
  constructor(tokenInfo: TokenInfo, tags: TagInfo[]) {
    super(tokenInfo.chainId, toChecksumAddress(tokenInfo.address), tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
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
  // public readonly tags: TagInfo[]
  constructor(tokenInfo: any) {
    super(
      tokenInfo.chainId,
      toChecksumAddress(tokenInfo.address),
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
  public readonly tokenInfo: TokenInfo
  constructor(tokenInfo: TokenInfo) {
    super(tokenInfo.chainId, tokenInfo.address, tokenInfo.decimals, tokenInfo.symbol, tokenInfo.name)
    this.tokenInfo = tokenInfo
  }
  public get logoURI(): string | undefined {
    return this.tokenInfo.logoURI
  }
}

export type TokenAddressMap = Readonly<{ [chainId in ChainId]: Readonly<{ [tokenAddress: string]: WrappedTokenInfo }> }>

/**
 * An empty result, useful as a default.
 */
const EMPTY_LIST: TokenAddressMap = {
  [ChainId.KOVAN]: {},
  [ChainId.RINKEBY]: {},
  [ChainId.ROPSTEN]: {},
  [ChainId.GÖRLI]: {},
  [ChainId.MAINNET]: {},
  [ChainId.HTTEST]: {},
  [ChainId.HTMAIN]: {},
  [ChainId.BNBMAIN]: {},
  [ChainId.BNBTEST]: {},
  [ChainId.MATICMAIN]: {},
  [ChainId.XDAIMAIN]: {},
  [ChainId.FTMMAIN]: {},
  [ChainId.OKEX]: {},
  [ChainId.HARMONY]: {},
  [ChainId.AVALANCHE]: {},
}

const listCache: WeakMap<TokenList, TokenAddressMap> | null =
  typeof WeakMap !== 'undefined' ? new WeakMap<TokenList, TokenAddressMap>() : null

export function listToTokenMap(list: TokenList): TokenAddressMap {
  const result = listCache?.get(list)
  if (result) return result

  // console.log(listCache)
  // console.log(result)
  // console.log(list)
  const map = list.tokens.reduce<TokenAddressMap>(
    (tokenMap, tokenInfo) => {
      const tags: TagInfo[] =
        tokenInfo.tags
          ?.map(tagId => {
            if (!list.tags?.[tagId]) return undefined
            return { ...list.tags[tagId], id: tagId }
          })
          ?.filter((x): x is TagInfo => Boolean(x)) ?? []
      const token = new WrappedTokenInfo(tokenInfo, tags)
      if (tokenMap[token.chainId][token.address] !== undefined) throw Error('Duplicate tokens.')
      return {
        ...tokenMap,
        [token.chainId]: {
          ...tokenMap[token.chainId],
          [token.address]: token
        }
      }
    },
    { ...EMPTY_LIST }
  )
  listCache?.set(list, map)
  return map
}

export function listsToTokenMap(list:any): TokenAddressMap {

  // console.log(list)
  const map:any = {}
  for (const t in list) {
    if(!isAddress(t)) continue
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

export function allListsToTokenMap(rlist:any, blist:any, mlist:any, chainId:any): TokenAddressMap {

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
  for (const t in rlist) {
    if(!isAddress(t)) continue
    if (rlist[t].underlying) {
      map[rlist[t].underlying.address] = new WrappedAllTokenInfo(rlist[t].underlying)
    }
    map[t] = new WrappedAllTokenInfo(rlist[t])
  }

  for (const t in mlist) {
    if(!isAddress(t)) continue
    if (mlist[t].underlying) {
      map[mlist[t].underlying.address] = new WrappedAllTokenInfo(mlist[t].underlying)
    }
    map[t] = new WrappedAllTokenInfo(mlist[t])
  }
  // console.log(map)
  // console.log(rlist)
  // console.log(blist)
  for (const t in blist) {
    if(!isAddress(t) || map[t]) continue
    if (blist[t].underlying) {
      map[blist[t].underlying.address] = new WrappedAllTokenInfo(blist[t].underlying)
    }
    map[t] = new WrappedAllTokenInfo(blist[t])
  }
  // console.log(map)
  return map
}

export function useTokenList(url: string | undefined): TokenAddressMap {
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)
  // console.log(lists)
  return useMemo(() => {
    if (!url) return EMPTY_LIST
    const current = lists[url]?.current
    if (!current) return EMPTY_LIST
    try {
      return listToTokenMap(current)
    } catch (error) {
      console.error('Could not show token list due to error', error)
      return EMPTY_LIST
    }
  }, [lists, url])
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

export function useMergeBridgeTokenList(chainId?:any): any {
  const lists:any = useSelector<AppState, AppState['lists']>(state => state.lists.mergeTokenList)
  // console.log(lists)
  const init = {}
  return useMemo(() => {
    if (!chainId) return init
    const current = lists[chainId]?.tokenList
    // console.log(current)
    if (!current) return init
    try {
      // return listsMergeToTokenMap(current)
      return current
    } catch (error) {
      console.error('Could not show token list due to error', error)
      return init
    }
  }, [lists, chainId])
}

export function useAllMergeBridgeTokenList(key?: string | undefined, chainId?:any): any {
  const lists:any = useSelector<AppState, AppState['lists']>(state => state.lists)
  // console.log(lists)
  const init = {}
  return useMemo(() => {
    if (!key || !chainId) return init
    const current = lists[key]?.[chainId]?.tokenList
    // console.log(current)
    if (!current) return init
    try {
      // return listsMergeToTokenMap(current)
      return current
    } catch (error) {
      console.error('Could not show token list due to error', error)
      return init
    }
  }, [lists, chainId])
}

export function useBridgeAllTokenList(chainId?:any): TokenAddressMap {
  const routerLists:any = useSelector<AppState, AppState['lists']['routerTokenList']>(state => state.lists.routerTokenList)
  const bridgeLists:any = useSelector<AppState, AppState['lists']['bridgeTokenList']>(state => state.lists.bridgeTokenList)
  const mergeLists:any = useSelector<AppState, AppState['lists']['mergeTokenList']>(state => state.lists.mergeTokenList)
  // console.log(lists)
  return useMemo(() => {
    if (!chainId) return EMPTY_LIST
    const rcurrent = routerLists[chainId]?.tokenList
    const bcurrent = bridgeLists[chainId]?.tokenList
    const mcurrent = mergeLists[chainId]?.tokenList
    // console.log(current)
    if (!rcurrent && !bcurrent && !mcurrent) return EMPTY_LIST
    try {
      return allListsToTokenMap(rcurrent, bcurrent, mcurrent, chainId)
      // return current
    } catch (error) {
      console.error('Could not show token list due to error', error)
      return EMPTY_LIST
    }
  }, [routerLists, bridgeLists, chainId])
}

export function useSelectedListUrl(): string | undefined {
  // return useSelector<AppState, AppState['lists']['selectedListUrl']>(state => {
  //   return state.lists.selectedListUrl
  // })
  return config.tokenListUrl
}

export function useBridgeSelectedTokenList(key?: string | undefined, chainId?:any): TokenAddressMap {
  return useBridgeTokenList(key, chainId)
}

export function useSelectedTokenList(): TokenAddressMap {
  return useTokenList(useSelectedListUrl())
}

export function useSelectedListInfo(): { current: TokenList | null; pending: TokenList | null; loading: boolean } {
  const selectedUrl = useSelectedListUrl()
  const listsByUrl = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)
  const list = selectedUrl ? listsByUrl[selectedUrl] : undefined
  // console.log(listsByUrl)
  return {
    current: list?.current ?? null,
    pending: list?.pendingUpdate ?? null,
    loading: list?.loadingRequestId !== null
  }
}

// returns all downloaded current lists
export function useAllLists(): TokenList[] {
  const lists = useSelector<AppState, AppState['lists']['byUrl']>(state => state.lists.byUrl)

  return useMemo(
    () =>
      Object.keys(lists)
        .map(url => lists[url].current)
        .filter((l): l is TokenList => Boolean(l)),
    [lists]
  )
}
