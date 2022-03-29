// import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount } from 'anyswap-sdk'
import { Currency, CurrencyAmount, JSBI, Token, TokenAmount } from 'anyswap-sdk'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import ERC20_INTERFACE from '../../constants/abis/erc20'
// import { useAllTokens } from '../../hooks/Tokens'
import { useActiveReact } from '../../hooks/useActiveReact'
import { tryParseAmount5,tryParseAmount6 } from '../swap/hooks'
// import { useActiveWeb3React } from '../../hooks'
import { useMulticallContract } from '../../hooks/useContract'
import { isAddress } from '../../utils'
import { useSingleContractMultipleData, useMultipleContractSingleData } from '../multicall/hooks'
import { AppState } from '../index'

import {useToken} from '../../hooks/Tokens'
// import { tokenBalanceList } from './actions'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHWalletBalances(
  uncheckedAddresses?: (string | undefined)[],
  chainId?: any
): { [address: string]: CurrencyAmount | undefined } {
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
      addresses.reduce<{ [address: string]: CurrencyAmount }>((memo, address, i) => {
        const value = results?.[i]?.result?.[0]
        if (value) memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()))
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
  tokens?: (Token | undefined)[],
  chainId?:any
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
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
          const results = validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
            const value = balances?.[i]?.result?.[0]
            const amount = value ? JSBI.BigInt(value.toString()) : undefined
            if (amount) {
              memo[token.address.toLowerCase()] = new TokenAmount(token, amount)
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

export function useTokenTotalSupplyWithLoadingIndicator(
  tokens?: (Token | undefined)[],
  chainId?:any
): [{ [tokenAddress: string]: TokenAmount | undefined }, boolean] {
  const validatedTokens: Token[] = useMemo(
    () => tokens?.filter((t?: Token): t is Token => isAddress(t?.address) !== false) ?? [],
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
          ? validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token.address.toLowerCase()] = new TokenAmount(token, amount)
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
  // console.log(tryParseAmount5('100', 6))
  // console.log(tryParseAmount5('100', 6).toSignificant(3))
  return useMemo(() => {
    if (chainId && account && lists) {
      if (lists[account] && lists[account][chainId]) {
        const list:any = {}
        for (const token in lists[account][chainId]) {
          const obj = lists[account][chainId][token]
          // const amount = obj.balancestr ? JSBI.BigInt(obj.balancestr.toString()) : undefined
          list[token] = {
            ...obj,
            balances: tryParseAmount5(obj.balancestr, obj.dec)
            // balances: amount
          }
        }
        return list
      }
      return {}
    }
    return {}
  }, [lists, chainId, account])
}

export function useOneTokenBalance(token:any): any {
  const { chainId, account } = useActiveReact()
  const lists:any = useSelector<AppState, AppState['wallet']>(state => state.wallet.tokenBalanceList)
  const tokens = useToken(token)
  // console.log(lists)
  // console.log(tryParseAmount5('100', 6))
  // console.log(tryParseAmount5('100', 6).toSignificant(3))
  return useMemo(() => {
    if (chainId && account && lists && token) {
      if (lists[account] && lists[account][chainId] && lists[account][chainId][token]) {
        const blItem = lists[account][chainId][token]
        if (token === 'NATIVE') {
          return {
            ...blItem,
            balances: tryParseAmount6(blItem.balancestr)
          }
        }
        
        const tokens = new Token(chainId,token,blItem.dec)
        const amount = blItem.balancestr ? JSBI.BigInt(blItem.balancestr.toString()) : undefined
        return {
          ...blItem,
          balances1: tryParseAmount6(blItem.balancestr),
          balances2: tryParseAmount5(blItem.balancestr, blItem.dec),
          // balances: tryParseAmount5(blItem.balancestr, blItem.dec),
          balances: tokens && amount ? new TokenAmount(tokens, amount) : ''
        }
      }
      return {}
    }
    return {}
  }, [lists, chainId, account, token, tokens])
}
export function useETHBalances(
  uncheckedAddresses?: (string | undefined)[],
  chainId?: any
): { [address: string]: CurrencyAmount | undefined } {
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
        // console.log(blItem.balances)
        // console.log(ethBalance)
        return addresses.reduce<{ [address: string]: any }>((memo, address) => {
          // const value = results?.[i]?.result?.[0]
          // if (value) memo[address] = CurrencyAmount.ether(JSBI.BigInt(value.toString()))
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
  tokens?: (Token | undefined)[],
  chainId?:any
): { [tokenAddress: string]: TokenAmount | undefined } {
  return useTokenBalancesWithLoadingIndicator(address?.toLowerCase(), tokens, chainId)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token, chainId?:any): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token], chainId)
  if (!token) return undefined
  return tokenBalances[token.address.toLowerCase()]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[],
  chainId?:any,
  isETH?:any
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(() => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [], [
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
        if (currency instanceof Token) return tokenBalances[currency.address?.toLowerCase()]
        // if (currency === ETHER) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency, chainId?:any, isETH?:any): CurrencyAmount | undefined {
  // const balances = useTokenBalanceList()
  const balanceWallet  = useCurrencyBalances(account, [currency], chainId, isETH)[0]
  const blItem = useOneTokenBalance(currency?.address?.toLowerCase())
  // console.log(currency)
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
  // return useCurrencyBalances(account, [currency], chainId, isETH)[0]
  // if (chainId) {
  // } else {
  //   return currency?.address?.toLowerCase() && balances[currency?.address?.toLowerCase()] ? balances[currency?.address?.toLowerCase()] : undefined
  // }
}