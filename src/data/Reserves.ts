import { TokenAmount, Pair, Currency, ChainId } from 'anyswap-sdk'
// import { useEffect, useMemo, useState } from 'react'
// import { useCallback, useMemo, useEffect, useState } from 'react'
import { useMemo } from 'react'
import { abi as IUniswapV2PairABI } from '@uniswap/v2-core/build/IUniswapV2Pair.json'
import { Interface } from '@ethersproject/abi'
import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'

// import {useV2FactoryContract} from '../hooks/useContract'

// import { getPairAddress } from '../utils/tools/getPairAddress'
// import {usePairAddress} from '../hooks/getPairAddress'

const PAIR_INTERFACE = new Interface(IUniswapV2PairABI)
// const PAIR_INTERFACE2 = new Interface(v2Factory)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID
}
// let onlyOne:any = []
export function usePairs(currencies: [Currency | undefined, Currency | undefined][], chainId?: ChainId): [PairState, Pair | null][] {

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => {
        // console.log(currencyA)
        // console.log(currencyB)
        // if (currencyA?.chainId === currencyB?.chainId) {

        // }
        return [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId)
      ]
    }),
    [chainId, currencies]
  )
  
  // console.log(tokens)
  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        // console.log(tokenA)
        // console.log(tokenB)
        // if (tokenA && tokenB) {
        //   console.log(Pair.getAddress(tokenA, tokenB))
        // }
        return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
      }),
    [tokens]
  )
  // console.log(pairAddresses)
  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves', undefined, undefined, chainId)
  // console.log(pairAddresses)
  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]
      if (loading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const { reserve0, reserve1 } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()))
      ]
    })
  }, [results, tokens])
}


export function usePair(chainId?: ChainId, tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]], chainId)[0]
}
