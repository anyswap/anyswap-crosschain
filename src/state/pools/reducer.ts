import { createReducer } from '@reduxjs/toolkit'
import { poolLiquidity, poolList } from './actions'

export interface BurnState {
  readonly poolLiquidity: any
  readonly poolList: any
}

const initialState: BurnState = {
  poolLiquidity: {},
  poolList: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(poolLiquidity, (state, { payload: {poolLiquidity} }) => {
      state.poolLiquidity = poolLiquidity
    })
    .addCase(poolList, (state, { payload: { chainId, tokenList } }) => {
      // console.log(state)
      if (state.poolList) {
        state.poolList[chainId] = {tokenList, timestamp: Date.now()}
      } else {
        state.poolList = {
          [chainId]: {tokenList, timestamp: Date.now()}
        }
      }
    })
)
