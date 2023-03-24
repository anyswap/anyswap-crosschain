
import { useCallback, useMemo } from 'react'
import JSBI from 'jsbi'
import { useDispatch, useSelector } from 'react-redux'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import {useActiveWeb3React} from '../../hooks'
import { useActiveReact } from '../../hooks/useActiveReact'
import { tryParseAmount5,tryParseAmount6 } from '../swap/hooks'
import { useMulticallContract } from '../../hooks/useContract'
import { isAddress } from '../../utils'
import { BigAmount } from '../../utils/formatBignumber'
import { useSingleContractMultipleData, useMultipleContractSingleData } from '../multicall/hooks'
import { AppState, AppDispatch } from '../index'

import {gnosissafe} from '../../connectors'
import { walletViews, updateTokenBalance } from './actions'

export function useIsGnosisSafeWallet () {
  const { connector, account } = useActiveWeb3React()
  const isGnosisSafeWallet =  useMemo(() => {
    // console.log(gnosissafe)
    // console.log(connector)
    if ( gnosissafe === connector && account) {
      return true
    }
    return false
  }, [gnosissafe, connector, account])
  return {
    isGnosisSafeWallet
  }
}

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHWalletBalances(
  uncheckedAddresses?: (string | undefined)[],
  chainId?: any
): { [address: string]: any | undefined } {
  const multicallContract = useMulticallContract()
  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )

  const results = useSingleContractMultipleData(
    multicallContract,
    'getEthBalance',
    addresses.map(address => [address]),
    undefined,
    chainId
  )
  // console.log(results)
  return useMemo(
    () =>
      addresses.reduce<{ [address: string]: any }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value) memo[address] = BigAmount.format(18, value.toString())
        return memo
      }, {}),
    [addresses, results]
  )
}

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (any | undefined)[],
  chainId?:any
): [{ [tokenAddress: string]: any }, boolean] {
  const validatedTokens: any[] = useMemo(
    () => tokens?.filter((t?: any) => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt.address), [validatedTokens])
  // console.log(chainId)
  // console.log(validatedTokenAddresses)
  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', [address], undefined, chainId)
  // console.log(validatedTokenAddresses)
  // console.log(address)
  // console.log(balances)

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () => {
        if (address && validatedTokens.length > 0) {
          const results = validatedTokens.reduce<{ [tokenAddress: string]: any }>((memo, token, i) => {
            const value = balances?.[i]?.result?.[0]
            const amount = value ? JSBI.BigInt(value.toString()) : undefined
            if (amount) {
              memo[token.address.toLowerCase()] = BigAmount.format(token.decimals, amount)
            }
            // console.log(memo)
            return memo
          }, {})
          return results
        } else {
          return {}
        }
      },
      [address, validatedTokens, balances]
    ),
    anyLoading
  ]
}

export function useTokenBalancesWithLoadingIndicator1(
  address?: any,
  token?: any,
  decimals?: any,
  chainId?:any
): any {
  // const validatedTokens: any[] = useMemo(
  //   () => tokens?.filter((t?: any): t is any => isAddress(t?.address) !== false) ?? [],
  //   [tokens]
  // )

  // const validatedTokenAddresses = isAddress(token) ? [token] : []
  // const validatedAddresses = isAddress(address) ? [address] : [undefined]
  const validatedTokenAddresses = useMemo(() => {
    if (isAddress(token)) {
      return [token]
    } 
    return [undefined]
  }, [token])
  const validatedAddresses = useMemo(() => {
    if (isAddress(address)) {
      return [address]
    } 
    return [undefined]
  }, [address])
  // console.log(chainId)
  // console.log(validatedTokenAddresses)
  // console.log(validatedAddresses)
  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', validatedAddresses, undefined, chainId)
  // console.log(validatedTokenAddresses)
  // console.log(address)
  // console.log(balances)

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return useMemo(
    () => {
      // console.log(token, address, balances)
      if (address && token && !anyLoading) {
        const value = balances?.[0]?.result?.[0]
        const amount = value ? value.toString() : undefined
        // console.log('amount', amount)
        // console.log('decimals', decimals)
        // console.log(balances)
        return amount || amount === 0 ? BigAmount.format(decimals, amount) : undefined
      } else {
        return undefined
      }
    },
    [address, token, balances, anyLoading]
  )
}

export function useOneTokenBalance(token:any): any {
  const { chainId, account } = useActiveReact()
  const lists:any = useSelector<AppState, AppState['wallet']>(state => state.wallet.tokenBalanceList)
  // console.log(lists)
  return useMemo(() => {
    if (chainId && account && lists && token) {
      // console.log(lists)
      // console.log(account)
      // console.log(chainId)
      // console.log(token)
      if (lists?.[account]?.[chainId]?.[token]) {
        const blItem = lists[account][chainId][token]
        if (token === 'NATIVE') {
          // console.log(blItem)
          return {
            ...blItem,
            balances: blItem.balancestr === '0' ? BigAmount.format(18, '0') : tryParseAmount6(blItem.balancestr)
          }
        }
        
        const tokens = {chainId,address: token, decimals: blItem.dec}
        const amount = blItem.balancestr ? JSBI.BigInt(blItem.balancestr.toString()) : undefined
        return {
          ...blItem,
          balances1: tryParseAmount6(blItem.balancestr),
          balances2: tryParseAmount5(blItem.balancestr, blItem.dec),
          balances: tokens && amount ? BigAmount.format(tokens.decimals, amount) : ''
        }
      }
      return {}
    }
    return {}
  }, [lists, chainId, account, token])
}

export function useCurrencyBalance1(account?: string | null, token?: string, decimals?: any, chainId?:any): any | undefined {
  // const balances = useTokenBalanceList()
  // console.log(currency)
  const balanceWallet  = useTokenBalancesWithLoadingIndicator1(account, token, decimals, chainId)
  const blItem = useOneTokenBalance(token ? token?.toLowerCase() : undefined)
  // console.log('balanceWallet', token, balanceWallet)
  return useMemo(() => {
    // console.log('blItem', blItem)
    // console.log('balanceWallet', token, balanceWallet)
    if (balanceWallet) {
      return balanceWallet
    } else {
      if (blItem?.balances) {
        // return BigAmount.format(decimals, blItem.balances)
        return blItem.balances
      }
      return undefined
    }
  }, [balanceWallet, blItem?.balances, decimals])
  // }, [account, token, chainId, balanceWallet, blItem?.balances, decimals])
}


export function useTokenTotalSupplyWithLoadingIndicator(
  tokens?: (any)[],
  chainId?:any
): [{ [tokenAddress: string]: any }, boolean] {
  const validatedTokens: any[] = useMemo(
    () => tokens?.filter((t?: any) => isAddress(t?.address) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt.address), [validatedTokens])
  // console.log(tokens)
  // console.log(validatedTokenAddresses)
  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'totalSupply', [], undefined, chainId)
  // console.log(validatedTokenAddresses)
  // console.log(balances)
  // console.log(balances)

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: any }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                // memo[token.address.toLowerCase()] = new TokenAmount(token, amount)
                memo[token.address.toLowerCase()] = BigAmount.format(token.decimals, amount)
              }
              // console.log(memo)
              return memo
            }, {})
          : {},
      [validatedTokens, balances]
    ),
    anyLoading
  ]
}

export function useTokenBalancesList(
  address?: string,
  tokens?: (string | undefined)[],
  chainId?:any
): [{ [tokenAddress: string]: string | undefined }, boolean] {
  const validatedTokens: string[] = useMemo(
    () => tokens?.filter((t?: string): t is string => isAddress(t) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt), [validatedTokens])
  // console.log(tokens)
  // console.log(validatedTokenAddresses)
  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'balanceOf', [address], undefined, chainId)
  // console.log(validatedTokenAddresses)
  // console.log(address)
  // console.log(balances)

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        address && validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: string | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token] = amount.toString()
              }
              // console.log(memo)
              return memo
            }, {})
          : {},
      [address, validatedTokens, balances]
    ),
    anyLoading
  ]
}

export function useTokenBalanceList(): any {
  const { chainId, account } = useActiveReact()
  const lists:any = useSelector<AppState, AppState['wallet']>(state => state.wallet.tokenBalanceList)
  // console.log(lists)
  return useMemo(() => {
    if (chainId && account && lists) {
      if (lists[account] && lists[account][chainId]) {
        const list:any = {}
        for (const token in lists[account][chainId]) {
          const obj = lists[account][chainId][token]
          // const amount = obj.balancestr ? JSBI.BigInt(obj.balancestr.toString()) : undefined
          try {
            list[token] = {
              ...obj,
              balances: BigAmount.format(obj.dec ? obj.dec : 0, obj.balancestr)
              // balances: amount
            }
          } catch (error) {
            console.log(error)
            console.log(obj)
            console.log(account, chainId, token)
          }
        }
        return list
      }
      return {}
    }
    return {}
  }, [lists, chainId, account])
}


export function useETHBalances(
  uncheckedAddresses?: (string | undefined)[],
  chainId?: any
): { [address: string]: any | undefined } {
  const ethBalance = useETHWalletBalances(uncheckedAddresses, chainId)
  const blItem = useOneTokenBalance('NATIVE')
  const addresses: string[] = useMemo(
    () =>
      uncheckedAddresses
        ? uncheckedAddresses
            .map(isAddress)
            .filter((a): a is string => a !== false)
            .sort()
        : [],
    [uncheckedAddresses]
  )
  return useMemo(
    () => {
      if (chainId) {
        // console.log(1)
        // console.log(ethBalance)
        return ethBalance
      } else {
        // console.log(2)
        // console.log(blItem)
        // console.log(blItem.balances)
        // console.log(ethBalance)
        return addresses.reduce<{ [address: string]: any }>((memo, address) => {
          if (ethBalance[address]) return ethBalance
          if (blItem?.balances) return {[address]: blItem?.balances}
          return memo
        }, {})
      }
    },
    [ethBalance, blItem, chainId]
  )
}
export function useTokenTotalSupply(
  tokens?: (string | undefined)[],
  chainId?:any
): [{ [tokenAddress: string]: string | undefined }, boolean] {
  const validatedTokens: string[] = useMemo(
    () => tokens?.filter((t?: string): t is string => isAddress(t) !== false) ?? [],
    [tokens]
  )

  const validatedTokenAddresses = useMemo(() => validatedTokens.map(vt => vt), [validatedTokens])
  // console.log(tokens)
  // console.log(validatedTokenAddresses)
  const balances = useMultipleContractSingleData(validatedTokenAddresses, ERC20_INTERFACE, 'totalSupply', [], undefined, chainId)
  // console.log(validatedTokenAddresses)
  // console.log(balances)
  // console.log(balances)

  const anyLoading: boolean = useMemo(() => balances.some(callState => callState.loading), [balances])

  return [
    useMemo(
      () =>
        validatedTokens.length > 0
          ? validatedTokens.reduce<{ [tokenAddress: string]: string | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token] = amount.toString()
              }
              // console.log(memo)
              return memo
            }, {})
          : {},
      [validatedTokens, balances]
    ),
    anyLoading
  ]
}

export function useTokenBalances(
  address?: string,
  tokens?: (any | undefined)[],
  chainId?:any
): { [tokenAddress: string]: any } {
  return useTokenBalancesWithLoadingIndicator(address ? address?.toLowerCase() : undefined, tokens, chainId)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: any, chainId?:any): any {
  const tokenBalances = useTokenBalances(account, [token], chainId)
  if (!token?.address) return undefined
  return tokenBalances[token.address.toLowerCase()]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (any | undefined)[],
  chainId?:any,
  isETH?:any
): (any | undefined)[] {
  const tokens = useMemo(() => currencies?.filter((currency) => currency?.address) ?? [], [
    currencies
  ])
  // console.log(tokens)
  const tokenBalances = useTokenBalances(account, tokens, chainId)
  const containsETH: boolean = isETH
  const ethBalance = useETHBalances(containsETH ? [account] : [], chainId)

  return useMemo(
    () =>
      currencies?.map(currency => {
        if (!account || !currency) return undefined
        if (isETH) return ethBalance[account]
        if (currency?.address) return tokenBalances[currency.address?.toLowerCase()]
        // if (currency === ETHER) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: any, chainId?:any, isETH?:any): any | undefined {
  // const balances = useTokenBalanceList()
  // console.log(currency)
  const balanceWallet  = useCurrencyBalances(account, currency ? [currency] : [], chainId, isETH)[0]
  const blItem = useOneTokenBalance(currency ? currency?.address?.toLowerCase() : undefined)
  return useMemo(() => {
    if (chainId || balanceWallet) {
      return balanceWallet
    } else {
      if (blItem && blItem.balances) {
        return blItem.balances
      }
      return undefined
    }
  }, [account, currency, chainId, isETH, balanceWallet, blItem])
}



export function useWalletViews () {
  const walletViewsResult:any = useSelector<AppState, AppState['wallet']>(state => state.wallet.walletViews)
  const dispatch = useDispatch<AppDispatch>()
  // const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)

  const setWalletView = useCallback((type: any) => {
    // console.log(type)
    dispatch(walletViews({type}))
  }, [])

  return {
    walletView: walletViewsResult,
    setWalletView
  }
}

export function useAllTokenBalance() {
  const dispatch = useDispatch<AppDispatch>()
  const tokenBalance:any = useSelector<AppState, AppState['wallet']>(state => state.wallet.tokenBalance)

  const setTokenBalance = useCallback((chainId: any, token:any, account:any, balance:string, decimals:number) => {
    dispatch(updateTokenBalance({chainId, token, account, balance, decimals}))
  }, [dispatch])

  const getTokenBalance = useCallback((chainId: any, token:any, account:any) => {
    // console.log(tokenBalance)
    if (tokenBalance?.[chainId]?.[account]?.[token]) {
      return tokenBalance?.[chainId]?.[account]?.[token]
    }
    return
  }, [tokenBalance])
  return {
    setTokenBalance,
    getTokenBalance
  }
}