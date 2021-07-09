import { Currency, CurrencyAmount, ETHER, JSBI, Token, TokenAmount } from 'anyswap-sdk'
import { useMemo } from 'react'
import ERC20_INTERFACE from '../../constants/abis/erc20'
import { useAllTokens } from '../../hooks/Tokens'
import { useActiveWeb3React } from '../../hooks'
import { useMulticallContract } from '../../hooks/useContract'
import { isAddress } from '../../utils'
import { useSingleContractMultipleData, useMultipleContractSingleData } from '../multicall/hooks'

/**
 * Returns a map of the given addresses to their eventually consistent ETH balances.
 */
export function useETHBalances(
  uncheckedAddresses?: (string | undefined)[]
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
    addresses.map(address => [address])
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
          ? validatedTokens.reduce<{ [tokenAddress: string]: TokenAmount | undefined }>((memo, token, i) => {
              const value = balances?.[i]?.result?.[0]
              const amount = value ? JSBI.BigInt(value.toString()) : undefined
              if (amount) {
                memo[token.address] = new TokenAmount(token, amount)
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
                memo[token.address] = new TokenAmount(token, amount)
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
  return useTokenBalancesWithLoadingIndicator(address, tokens, chainId)[0]
}

// get the balance for a single token/account combo
export function useTokenBalance(account?: string, token?: Token, chainId?:any): TokenAmount | undefined {
  const tokenBalances = useTokenBalances(account, [token], chainId)
  if (!token) return undefined
  return tokenBalances[token.address]
}

export function useCurrencyBalances(
  account?: string,
  currencies?: (Currency | undefined)[],
  chainId?:any
): (CurrencyAmount | undefined)[] {
  const tokens = useMemo(() => currencies?.filter((currency): currency is Token => currency instanceof Token) ?? [], [
    currencies
  ])

  const tokenBalances = useTokenBalances(account, tokens, chainId)
  // console.log(tokenBalances)
  const containsETH: boolean = useMemo(() => currencies?.some(currency => currency === ETHER) ?? false, [currencies])
  const ethBalance = useETHBalances(containsETH ? [account] : [])

  return useMemo(
    () =>
      currencies?.map(currency => {
        if (!account || !currency) return undefined
        if (currency instanceof Token) return tokenBalances[currency.address]
        if (currency === ETHER) return ethBalance[account]
        return undefined
      }) ?? [],
    [account, currencies, ethBalance, tokenBalances]
  )
}

export function useCurrencyBalance(account?: string, currency?: Currency, chainId?:any): CurrencyAmount | undefined {
  return useCurrencyBalances(account, [currency], chainId)[0]
}

// mimics useAllBalances
export function useAllTokenBalances(): { [tokenAddress: string]: TokenAmount | undefined } {
  const { account } = useActiveWeb3React()
  const allTokens = useAllTokens()
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [allTokens])
  // console.log(account)
  // console.log(allTokensArray)
  const balances = useTokenBalances(account ?? undefined, allTokensArray)
  return balances ?? {}
}
