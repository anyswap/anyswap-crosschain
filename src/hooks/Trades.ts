import { Currency, CurrencyAmount, Pair, Token, Trade, ChainId } from 'anyswap-sdk'
import flatMap from 'lodash.flatmap'
import { useMemo } from 'react'

import { BASES_TO_CHECK_TRADES_AGAINST, CUSTOM_BASES } from '../constants'
import { PairState, usePairs } from '../data/Reserves'
import { wrappedCurrency } from '../utils/wrappedCurrency'

// import { useActiveWeb3React } from './index'

function useAllCommonPairs(chainId?: ChainId, currencyA?: Currency, currencyB?: Currency): Pair[] {
  // const { chainId } = useActiveWeb3React()
  // const { chainId } = useActiveWeb3React()

  const bases: Token[] = chainId ? BASES_TO_CHECK_TRADES_AGAINST[chainId] : []
  // console.log(bases)
  const [tokenA, tokenB] = chainId
    ? [wrappedCurrency(currencyA, chainId), wrappedCurrency(currencyB, chainId)]
    : [undefined, undefined]

  const basePairs: [Token, Token][] = useMemo(
    () =>
      flatMap(bases, (base): [Token, Token][] => bases.map(otherBase => [base, otherBase])).filter(
        ([t0, t1]) => t0.address !== t1.address
      ),
    [bases]
  )
  // console.log(tokenA)
  // console.log(tokenB)
  // if (tokenA && tokenB) {

  //   console.log([
  //     // 直接对
  //     [tokenA, tokenB],
  //     // token A against all bases
  //     ...bases.map((base): [Token, Token] => [tokenA, base]),
  //     // token B against all bases
  //     ...bases.map((base): [Token, Token] => [tokenB, base]),
  //     // each base against all bases
  //     ...basePairs
  //   ])
  // }
  const allPairCombinations: [Token, Token][] = useMemo(
    () =>
      tokenA && tokenB
        ? [
            // 直接对
            [tokenA, tokenB],
            // token A against all bases
            ...bases.map((base): [Token, Token] => [tokenA, base]),
            // token B against all bases
            ...bases.map((base): [Token, Token] => [tokenB, base]),
            // each base against all bases
            ...basePairs
          ]
            .filter((tokens): tokens is [Token, Token] => Boolean(tokens[0] && tokens[1]))
            .filter(([t0, t1]) => t0.address !== t1.address)
            .filter(([tokenA, tokenB]) => {
              if (!chainId) return true
              // console.log(chainId)
              const customBases = CUSTOM_BASES[chainId]
              if (!customBases) return true

              const customBasesA: Token[] | undefined = customBases[tokenA.address]
              const customBasesB: Token[] | undefined = customBases[tokenB.address]

              if (!customBasesA && !customBasesB) return true

              if (customBasesA && !customBasesA.find(base => tokenB.equals(base))) return false
              if (customBasesB && !customBasesB.find(base => tokenA.equals(base))) return false

              return true
            })
        : [],
    [tokenA, tokenB, bases, basePairs, chainId]
  )
  // console.log(allPairCombinations)
  // console.log(chainId)
  const allPairs = usePairs(allPairCombinations, chainId)

  // 只传递有效对、非重复对
  return useMemo(
    () =>
      Object.values(
        allPairs
          // 筛选出无效对
          .filter((result): result is [PairState.EXISTS, Pair] => Boolean(result[0] === PairState.EXISTS && result[1]))
          // 过滤出重复的对
          .reduce<{ [pairAddress: string]: Pair }>((memo, [, curr]) => {
            memo[curr.liquidityToken.address] = memo[curr.liquidityToken.address] ?? curr
            return memo
          }, {})
      ),
    [allPairs]
  )
}

/**
 * 返回给定令牌出的确切数量的令牌的最佳交易
 */
export function useTradeExactIn(chainId: ChainId, currencyAmountIn?: CurrencyAmount, currencyOut?: Currency): Trade | null {
  const allowedPairs = useAllCommonPairs(chainId, currencyAmountIn?.currency, currencyOut)

  // console.log(allowedPairs)
  // console.log(currencyAmountIn)
  // console.log(allowedPairs)
  return useMemo(() => {
    if (currencyAmountIn && currencyOut && allowedPairs.length > 0) {
      return (
        Trade.bestTradeExactIn(allowedPairs, currencyAmountIn, currencyOut, { maxHops: 3, maxNumResults: 1 })[0] ?? null
      )
    }
    return null
  }, [allowedPairs, currencyAmountIn, currencyOut])
}

/**
 * 将代币入市的最佳交易金额返回到代币的确切金额
 */
export function useTradeExactOut(chainId?: ChainId, currencyIn?: Currency, currencyAmountOut?: CurrencyAmount): Trade | null {
  const allowedPairs = useAllCommonPairs(chainId, currencyIn, currencyAmountOut?.currency)
  return useMemo(() => {
    if (currencyIn && currencyAmountOut && allowedPairs.length > 0) {
      return (
        Trade.bestTradeExactOut(allowedPairs, currencyIn, currencyAmountOut, { maxHops: 3, maxNumResults: 1 })[0] ??
        null
      )
    }
    return null
  }, [allowedPairs, currencyIn, currencyAmountOut])
}
