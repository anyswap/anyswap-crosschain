import { createReducer } from '@reduxjs/toolkit'
import { poolLiquidity } from './actions'

export interface BurnState {
  readonly poolLiquidity: any
}

const initialState: BurnState = {
  poolLiquidity: {},
}

export default createReducer<BurnState>(initialState, builder =>
  builder
    .addCase(poolLiquidity, (state, { payload: {poolLiquidity} }) => {
      state.poolLiquidity = poolLiquidity
    })
)
