import { createAction } from '@reduxjs/toolkit'

export const poolLiquidity = createAction<{poolLiquidity:any}>('pools/liquidity')
export const poolList = createAction<{chainId:any, tokenList:any}>('pools/poolList')
